import Raven from 'raven-js';

const sentry_key = '3b4ddaf0659a440abe7b9df760cfd4b0';
const sentry_app = '263417';

export const sentry_url = `https://${sentry_key}@app.getsentry.com/${sentry_app}`;

export function logException(ex, context) {
    Raven.captureException(ex, {
        extra: context 
    });

    window && window.console && console.error && console.error(ex);
}