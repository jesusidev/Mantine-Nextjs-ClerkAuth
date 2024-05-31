// https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api

type ClarityEvents = Record<string, any> & {
  /**
   * @param {upgrade} upgrade Upgrade Session Object
   * @param {reason} upgrade.reason of the session upgrade
   **/
  upgrade?: { reason: string };
  /**
   * Cookie Consent
   * @param {consent} consent
   **/
  consent?: boolean;
  /**
   * @param {event} event Setup custom tags
   * @param {name} event.name The tag name that identifies the kind of information you're sending
   * @param {value} event.value The value attached to the tag
   */
  event?: { name: string; value: string };
  /**
   * @param {identify} Identify user
   * @param {userId} identify.userId Unique ID of a user
   * @param {sessionId} identify.sessionId Unique ID of a session
   * @param {pageId} identify.pageId Unique ID of a page
   */
  identify?: { userId: string; sessionId?: string; pageId?: string };
};

declare global {
  interface Window {
    clarity: (action: keyof ClarityEvents, params: ClarityEvents[keyof ClarityEvents]) => void;
  }
}

export function cevent({ upgrade, event, identify, consent }: ClarityEvents = {}): void {
  if (window.clarity === undefined) {
    console.error('window.clarity is undefined');
    return;
  }

  if (upgrade !== undefined) {
    const upgradeString = `'${upgrade.reason}'`;
    window?.clarity('upgrade', upgradeString);
  }

  if (event !== undefined) {
    const eventString = `"${event.value}", "${event.name}"`;
    console.log('set', eventString);
    window?.clarity('set', eventString);
  }

  if (identify !== undefined) {
    let identifyString = `"${identify.userId}"`;

    if (identify.sessionId) {
      identifyString += `, "${identify.sessionId}"`;
    }
    if (identify.pageId) {
      identifyString += `, "${identify.pageId}"`;
    }

    window?.clarity('identify', identifyString);
  }

  if (consent !== undefined) {
    window?.clarity('consent', consent);
  }
}
