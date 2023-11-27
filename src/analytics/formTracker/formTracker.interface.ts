export interface FormEventInterface {
  event: string;
  event_data: {
    event_name: string;
    type: string;
    url: string;
    text: string;
    section: string;
    action: string;
    external: string;
  };
}

export interface FormField {
  id: string;
  name: string;
  value: string | undefined;
  type: string;
}

export interface formTrackerOptionsInterface {
  disableFreeTextTracking?: boolean;
}
