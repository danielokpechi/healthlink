/// <reference types="vite/client" />

// Augment the global Window interface for GA4/gtag
interface Window {
  dataLayer: any[];  // or unknown[] for stricter typing
}

// Optional: Stronger typing for gtag function
declare function gtag(...args: any[]): void;