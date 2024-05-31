// https://developers.google.com/tag-platform/devguides/consent#gtag.js

// @ts-nocheck
type ConsentOptions = {
  arg: any;
  params: any;
};

export function consent({ arg, params }: ConsentOptions): void {
  if (!window.gtag) {
    return;
  }
  window.gtag('consent', arg, params);
}
