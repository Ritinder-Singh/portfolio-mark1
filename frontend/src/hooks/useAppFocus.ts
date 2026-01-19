import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

/**
 * Hook that calls a callback when the app comes to the foreground.
 * Useful for refreshing data when the user returns to the app.
 */
export function useAppFocus(onFocus: () => void) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        // App came to foreground (from background or inactive)
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          onFocus();
        }
        appState.current = nextAppState;
      }
    );

    return () => {
      subscription.remove();
    };
  }, [onFocus]);
}

export default useAppFocus;
