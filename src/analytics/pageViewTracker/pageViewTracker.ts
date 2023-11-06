import PageViewInterface from "./pageViewInterface";

function pageViewTracker(params: PageViewInterface) {
  const { language, location } = params;
  console.log("running pageViewTracker");
  const dataLayer = {
    event: "page_view",
    page_view: {
      language: language,
      location: location,
      // 'organisations':'',
      // 'primary_publishing_organisation':'',
      // 'status_code': '',
      // 'title': '',
      // 'taxonomy_level1': '',
      // 'taxonomy_level2': ''
    },
  };
  return dataLayer;
}

export default pageViewTracker;
