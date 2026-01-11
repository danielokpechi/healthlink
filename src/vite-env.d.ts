/// <reference types="vite/client" />

// Augment the global Window interface for GA4/gtag
interface Window {
  dataLayer: any[];  
}

declare function gtag(...args: any[]): void;