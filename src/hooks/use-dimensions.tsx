import { MutableRefObject, useMemo, useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  window.addEventListener("resize", callback);
  return () => {
    window.removeEventListener("resize", callback);
  };
};

const useDimensions = (
  ref: MutableRefObject<{ offsetWidth?: number; offsetHeight?: number } | null>,
) => {
  const dimensions = useSyncExternalStore(subscribe, () =>
    JSON.stringify({
      width: Math.ceil(ref?.current?.offsetWidth ?? 0), // 0 is default width
      height: Math.ceil(ref?.current?.offsetHeight ?? 0), // 0 is default height
    }),
  );
  return useMemo(() => JSON.parse(dimensions), [dimensions]);
};

export { useDimensions };
