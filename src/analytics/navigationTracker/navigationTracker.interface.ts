export interface NavigationEventInterface {
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
