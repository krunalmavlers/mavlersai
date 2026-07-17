import Script from 'next/script';
import type { SiteSettings } from '@/lib/types';
import { RawScripts } from './RawScripts';

/**
 * Injects third-party marketing/analytics scripts configured in Site Settings.
 * - GA4, Google Tag Manager and Facebook Pixel from their IDs (proper snippets).
 * - Arbitrary raw HTML/JS from the header/body/footer script fields.
 *
 * `position="body-start"` renders right after <body> opens; "body-end" at the
 * end of <body>. Head-targeted tags (GA/GTM) use next/script which hoists them.
 */
export function Scripts({
  settings,
  position,
}: {
  settings: SiteSettings;
  position: 'body-start' | 'body-end';
}) {
  if (position === 'body-start') {
    return (
      <>
        {/* GTM noscript fallback belongs immediately after <body> */}
        {settings.gtm_id && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${settings.gtm_id}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {settings.fb_pixel_id && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              alt=""
              src={`https://www.facebook.com/tr?id=${settings.fb_pixel_id}&ev=PageView&noscript=1`}
            />
          </noscript>
        )}
        {settings.body_start_scripts && <RawScripts html={settings.body_start_scripts} />}
      </>
    );
  }

  // body-end: load the executable snippets + footer raw scripts.
  return (
    <>
      {settings.gtm_id && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${settings.gtm_id}');`}
        </Script>
      )}
      {settings.ga_id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${settings.ga_id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${settings.ga_id}');`}
          </Script>
        </>
      )}
      {settings.fb_pixel_id && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${settings.fb_pixel_id}');fbq('track','PageView');`}
        </Script>
      )}
      {settings.header_scripts && <RawScripts html={settings.header_scripts} />}
      {settings.footer_scripts && <RawScripts html={settings.footer_scripts} />}
    </>
  );
}
