export interface AppConfigInterface {
  ga4ContainerId: string;
}

export interface OptionsInterface {
  disableGa4Tracking?: boolean;
  disableUaTracking?: boolean;
  disableAnalyticsCookie?: boolean;
  disableFormFreeTextTracking?: boolean;
}
