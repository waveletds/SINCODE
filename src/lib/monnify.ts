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
    if (!sdk || !window.MonnifySDK) {
      throw new Error("Monnify SDK failed to initialize on window object");
    }

    const apiKey = import.meta.env.VITE_MONNIFY_API_KEY || "MK_TEST_SDK";
    const contractCode = import.meta.env.VITE_MONNIFY_CONTRACT_CODE || "1234567890";

    console.log("Initializing Monnify with:", { 
      apiKey: apiKey.substring(0, 8) + "...", 
      contractCode,
      customerEmail 
    });

    window.MonnifySDK.initialize({
      amount,
      currencyCode: "NGN",
      customerName,
      customerEmail,
      paymentReference,
      paymentDescription,
      apiKey,
      contractCode,
      onComplete: (response: any) => {
        console.log("Monnify: Payment Complete", response);
        onComplete(response);
      },
      onClose: (data: any) => {
        console.log("Monnify: Payment Closed", data);
        onClose(data);
      }
    });
  } catch (error) {
    console.error("Monnify Initialization Error:", error);
    throw error; // Re-throw to be caught by the caller
  }
};
