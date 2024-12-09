import { useRef, useEffect } from "react";

export function useOutsideClick(handler, useCapture = true) {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };

    document.addEventListener("click", handleClick, useCapture);

    return () => document.removeEventListener("click", handleClick, useCapture);
  }, [handler, useCapture]);

  return ref;
}
