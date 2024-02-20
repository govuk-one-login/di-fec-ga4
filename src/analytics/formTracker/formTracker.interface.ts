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
    link_domain: string;
    "link_path_parts.1": string;
    "link_path_parts.2": string;
    "link_path_parts.3": string;
    "link_path_parts.4": string;
    "link_path_parts.5": string;
  };
}

export interface FormField {
  id: string;
  name: string;
  value: string | undefined;
  type: string;
}

export interface FormTrackerOptionsInterface {
  disableFreeTextTracking?: boolean;
}
