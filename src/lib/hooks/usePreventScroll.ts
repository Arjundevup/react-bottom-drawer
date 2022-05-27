import * as React from "react";
import {disableBodyScroll, enableBodyScroll} from "body-scroll-lock";

function usePreventScroll(enabled: boolean, contentWrapperClass: string) {
  React.useLayoutEffect(() => {
    if (typeof document === "undefined" || !enabled) {
      return;
    }
    
    const scrollableElement = document.querySelector(`.${contentWrapperClass}`);

    disableBodyScroll(scrollableElement, {
      allowTouchMove: el => {
        while (el && el !== document.body) {
          if (el.getAttribute('bodyscrolllockignore') !== null) {
            return true;
          }
    
          el = el.parentElement;
        }
      }});
    console.log("Disable body scrol");

    return () => {
      enableBodyScroll(scrollableElement);
    }
  }, [enabled]);
}

export default usePreventScroll;
