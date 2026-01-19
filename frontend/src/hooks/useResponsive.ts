import { useState, useEffect } from "react";
import { Dimensions, Platform, PixelRatio } from "react-native";

export type Breakpoint = "mobile" | "tablet" | "desktop";

interface ResponsiveValues {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: Breakpoint;
  width: number;
  height: number;
}

// Use density-independent pixels for native
const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
};

export function useResponsive(): ResponsiveValues {
  const [dimensions, setDimensions] = useState(() => {
    const { width, height } = Dimensions.get("window");
    return { width, height };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = dimensions;

  // For native platforms, use the smaller dimension to determine if it's a phone
  // This accounts for both portrait and landscape orientations
  const getBreakpoint = (): Breakpoint => {
    if (Platform.OS === "web") {
      // For web, use standard CSS-like breakpoints
      if (width >= BREAKPOINTS.desktop) return "desktop";
      if (width >= BREAKPOINTS.tablet) return "tablet";
      return "mobile";
    } else {
      // For native (Android/iOS), use density-independent width
      // Most phones are under 600dp wide, tablets are 600dp+
      const dpWidth = width / PixelRatio.get();
      const smallerDimension = Math.min(width, height);

      // If smaller dimension is less than 600, it's likely a phone
      if (smallerDimension < 600) return "mobile";
      if (smallerDimension < 900) return "tablet";
      return "desktop";
    }
  };

  const breakpoint = getBreakpoint();

  return {
    isMobile: breakpoint === "mobile",
    isTablet: breakpoint === "tablet",
    isDesktop: breakpoint === "desktop",
    breakpoint,
    width,
    height,
  };
}

export default useResponsive;
