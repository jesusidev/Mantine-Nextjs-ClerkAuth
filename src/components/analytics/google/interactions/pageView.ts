// https://developers.google.com/analytics/devguides/collection/gtagjs/pages

// @ts-nocheck
import { env } from '~/env.mjs';

type PageViewOptions = {
  title?: string;
  location?: string;
  path?: string;
  sendPageView?: boolean;
  userId?: string;
};

declare global {
  interface Window {
    gtag: () => void;
  }
}

export function pageView(
  { title, location, path, sendPageView, userId }: PageViewOptions = {},
  measurementId?: string
): void {
  const gaMeasurementId = env.NEXT_PUBLIC_GA_TAG ?? measurementId;

  if (!gaMeasurementId || !window.gtag) {
    return;
  }

  const pageViewOptions: {
    page_title?: string;
    page_location?: string;
    page_path?: string;
    send_page_view?: boolean;
    user_id?: string;
  } = {};

  if (title !== undefined) {
    pageViewOptions.page_title = title;
  }

  if (location !== undefined) {
    pageViewOptions.page_location = location;
  }

  if (path !== undefined) {
    pageViewOptions.page_path = path;
  }

  if (sendPageView !== undefined) {
    pageViewOptions.send_page_view = sendPageView;
  }

  if (userId !== undefined) {
    pageViewOptions.user_id = userId;
  }

  window.gtag('config', gaMeasurementId, pageViewOptions);
}
