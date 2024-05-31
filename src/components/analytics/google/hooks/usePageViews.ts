import { useEffect } from 'react';
import { Router } from 'next/router';
import { pageView } from '../interactions/pageView';
import { env } from '~/env.mjs';

export interface UsePageViewsOptions {
  gaMeasurementId?: string;
  ignoreHashChange?: boolean;
  disabled?: boolean;
}

export function usePageViews({
  gaMeasurementId,
  ignoreHashChange,
  disabled,
}: UsePageViewsOptions = {}) {
  useEffect(() => {
    if (disabled) {
      return undefined;
    }

    const handleRouteChange = (url: URL) => {
      const _gaMeasurementId = env.NEXT_PUBLIC_GA_TAG ?? gaMeasurementId;

      pageView({ path: url.toString() }, _gaMeasurementId);
    };

    Router.events.on('routeChangeComplete', handleRouteChange);

    if (!ignoreHashChange) {
      Router.events.on('hashChangeComplete', handleRouteChange);
    }

    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);

      if (!ignoreHashChange) {
        Router.events.off('hashChangeComplete', handleRouteChange);
      }
    };
  }, [Router.events, gaMeasurementId, ignoreHashChange]);
}
