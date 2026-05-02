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

export const initializePayment = ({
  amount,
  customerName,
  customerEmail,
  paymentReference,
  paymentDescription,
  onComplete,
  onClose,
}: PaymentOptions) => {
  if (!window.MonnifySDK) {
    console.error("Monnify SDK not loaded");
    return;
  }

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
};
