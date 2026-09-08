/**
 * PALASH Navigation Context & Stack Manager
 * Lightweight stack router designed for resource-constrained Android devices.
 * Provides standard navigate, goBack, and current route access.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RootStackParamList, ScreenName, RouteStackItem } from './types';

export interface NavigationContextValue {
  currentRoute: RouteStackItem;
  canGoBack: boolean;
  navigate: <T extends ScreenName>(screen: T, params?: RootStackParamList[T]) => void;
  goBack: () => void;
  reset: (screen: ScreenName) => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export interface NavigationProviderProps {
  initialRouteName?: ScreenName;
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  initialRouteName = 'Login',
  children,
}) => {
  const [stack, setStack] = useState<RouteStackItem[]>([{ name: initialRouteName }]);

  const currentRoute = stack[stack.length - 1];
  const canGoBack = stack.length > 1;

  const navigate = <T extends ScreenName>(screen: T, params?: RootStackParamList[T]) => {
    setStack((prev) => [...prev, { name: screen, params } as RouteStackItem]);
  };

  const goBack = () => {
    setStack((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, prev.length - 1);
    });
  };

  const reset = (screen: ScreenName) => {
    setStack([{ name: screen }]);
  };

  return (
    <NavigationContext.Provider
      value={{
        currentRoute,
        canGoBack,
        navigate,
        goBack,
        reset,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
