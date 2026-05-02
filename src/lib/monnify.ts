/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

declare global {
  interface Window {
    MonnifySDK: any;
  }
}

interface PaymentOptions {
  amount: number;
  customerName: string;
  customerEmail: string;
  paymentReference: string;
  paymentDescription: string;
  onComplete: (response: any) => void;
  onClose: (response: any) => void;
}

export const initializePayment = async ({
  amount,
  customerName,
  customerEmail,
  paymentReference,
  paymentDescription,
  onComplete,
  onClose,
}: PaymentOptions) => {
  const loadSDK = () => {
    return new Promise((resolve, reject) => {
      if (window.MonnifySDK) {
        resolve(window.MonnifySDK);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://sdk.monnify.com/plugin/monnify.js";
      script.async = true;
      script.onload = () => resolve(window.MonnifySDK);
      script.onerror = () => reject(new Error("Failed to load Monnify SDK"));
      document.head.appendChild(script);
    });
  };

  try {
    const sdk = await loadSDK();
    if (!sdk) throw new Error("SDK loaded but not initialized");

    window.MonnifySDK.initialize({
    amount,
    currencyCode: "NGN",
    customerName,
    customerEmail,
    paymentReference,
    paymentDescription,
    apiKey: import.meta.env.VITE_MONNIFY_API_KEY || "MK_TEST_SDK",
    contractCode: import.meta.env.VITE_MONNIFY_CONTRACT_CODE || "1234567890",
    onComplete: (response: any) => {
      console.log("Payment Complete", response);
      onComplete(response);
    },
    onClose: (data: any) => {
      console.log("Payment Closed", data);
      onClose(data);
    }
  });
  } catch (error) {
    console.error("Monnify Error:", error);
    // Prefer showing a UI message instead of alert
  }
};
