// analytics.ts
export const GA_MEASUREMENT_ID = 'G-QYBR5DYCWZ';  // ← Your actual ID here!

export const initGA = () => {
  if (!GA_MEASUREMENT_ID) return;

  // Load the gtag script dynamically
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    (window.dataLayer as any[]).push(args);
  }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, { send_page_view: true });  // Ensure page views are sent

  // Optional: If using React Router for SPA route tracking
  // history.listen(() => gtag('event', 'page_view', { page_path: window.location.pathname }));
};