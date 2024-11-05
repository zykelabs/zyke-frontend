import type { AppProps } from 'next/app';
import { GoogleAnalytics } from 'nextjs-google-analytics';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Google Analytics Tracking */}
      <GoogleAnalytics trackPageViews />

      {/* Render the main component for each page */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;