export interface AppConfigInterface {
  ga4ContainerId: string;
  uaContainerId: string;
}

export interface OptionsInterface {
  enableGa4Tracking?: boolean;
  enableUaTracking?: boolean;
  cookieDomain?: string;
  isDataSensitive?: boolean;
  enableFormChangeTracking: boolean;
  enableFormErrorTracking: boolean;
  enableFormResponseTracking: boolean;
  enableNavigationTracking: boolean;
  enablePageViewTracking: boolean;
  enableSelectContentTracking: boolean;
}
