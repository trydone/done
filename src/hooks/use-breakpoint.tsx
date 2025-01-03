/*

Returns the current breakpoint of the theme, like media query max-width

*/

import { useWindowSize } from "usehooks-ts";

export const breakpoints = {
  xxs: 400,
  xs: 500,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export function useBreakpoint() {
  const bp = Object.entries(breakpoints).sort(
    ([, width1], [, width2]) => width1 - width2,
  );
  const size = useWindowSize();

  if (size?.width >= breakpoints.xl) {
    return "xl";
  }

  for (const breakpoint of bp) {
    if (size?.width < breakpoint[1]) {
      return breakpoint[0] as keyof typeof breakpoints;
    }
    continue;
  }

  return "sm";
}
