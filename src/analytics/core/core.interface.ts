export interface AppConfigInterface {
  ga4ContainerId: string;
  uaContainerId: string;
}

export interface OptionsInterface {
  disableGa4Tracking?: boolean;
  disableUaTracking?: boolean;
  cookieDomain?: string;
}
