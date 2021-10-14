import debounce from "lodash.debounce";
import * as React from "react";
import { useSwipeable } from "react-swipeable";
import { Transition } from "react-transition-group";
import useEscButton from "./lib/hooks/useEscButton";
import usePreventScroll from "./lib/hooks/usePreventScroll";
import {
  BackdropStyles,
  TransitionStyles,
} from "./lib/styles";
import useGlobalStyles from "./lib/hooks/useGlobalStyles";
import clsx from "clsx";

interface IProps {
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  hideScrollbars?: boolean;
  unmountOnExit?: boolean;
  mountOnEnter?: boolean;
  className?: string;
  backdropClassname?: string;
  children: React.ReactNode;
}


let defaultHeight = 400;

const SlideUpTransition = ({
  isVisible,
  children,
  onClose,
  unmountOnExit = true,
  mountOnEnter = true,
  duration = 250,
  hideScrollbars = false,
  className = "",
}: IProps) => {
  const classNames = useGlobalStyles(duration, hideScrollbars);
  const nodeRef = React.useRef(null);
  const containerRef = React.useRef(null);

  // Actions to close
  useEscButton(onClose, isVisible);
  usePreventScroll(isVisible, classNames.contentWrapper);

  // Swiping down interaction
  const [currentDeltaY, setDeltaY] = React.useState(0);
  const [height, setHeight] = React.useState(defaultHeight);

  const swipeHandlers = useSwipeable({
    onSwipedDown: debounce(
      ({ velocity }) => {
        defaultHeight = height;
        if (velocity > 0.5) {
          onClose();
          setTimeout(() => {
            defaultHeight = 400;
            setHeight(defaultHeight)
          }, 500)
        }
        console.log('DH:', defaultHeight)
      },
      500,
      { leading: true }
    ),
    onSwipedUp: debounce(
      ({ velocity }) => {
        defaultHeight = height;
        console.log('DH:', defaultHeight)
      },
      500,
      { leading: true }
    ),
    onSwiping: ({ deltaY }) => {
      setDeltaY(deltaY);
      setHeight(defaultHeight + Number(deltaY));
      console.log('H:', height)
    },
  });

  // Layout
  return (
    <>
      <Transition
        appear={true}
        in={isVisible}
        timeout={{ appear: 0, enter: 0, exit: duration }}
        unmountOnExit={unmountOnExit}
        mountOnEnter={mountOnEnter}
        nodeRef={nodeRef}
      >
        {(state) => (
          <div ref={nodeRef}>
            <div onClick={onClose} className={clsx(className && `${className}__backdrop`, classNames.backdrop)} style={BackdropStyles[state]} />
            <div
              className={clsx(className, classNames.drawer)}
              style={{
                ...TransitionStyles[state]
              }}
            >
              <div style={{ height: height }} ref={containerRef}>
                <div {...swipeHandlers} className={clsx(className && `${className}__handle-wrapper`, classNames.handleWrapper)}>
                  <div className={clsx(className && `${className}__handle`, classNames.handle)} />
                </div>
                <div className={clsx(className && `${className}__content`, classNames.contentWrapper)}>{children}</div>
              </div>

            </div>
          </div>
        )}
      </Transition>
    </>
  );
};

export default SlideUpTransition;
