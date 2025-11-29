import { NavigationContainerRef, createNavigationContainerRef } from '@react-navigation/native';

export type RootNavigationParamList = Record<string, object | undefined>;

export const navigationRef = createNavigationContainerRef<RootNavigationParamList>();

export function navigate<RouteName extends keyof RootNavigationParamList>(
  name: RouteName,
  params?: RootNavigationParamList[RouteName]
) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params);
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function resetRoot(state: Parameters<NavigationContainerRef<RootNavigationParamList>['resetRoot']>[0]) {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot(state);
  }
}

