import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const CASHFREE_ENV = import.meta.env.VITE_CASHFREE_ENV || "sandbox";

export interface Participant {
  name: string;
  email: string;
  phone: string;
  college: string;
  food: "veg" | "non-veg";
  isLeader?: boolean;
}

export interface RegistrationPayload {
  eventId: string;
  eventName: string;
  isTeamEvent: boolean;
  teamName?: string;
  participant?: Participant;
  participants?: Participant[];
}

export interface ConfirmationData {
  registrationId: string;
  eventName: string;
  participants: Participant[];
  paymentStatus: string;
  isTeamEvent: boolean;
  teamName?: string;
  qrCode: string;
}

declare global {
  interface Window {
    Cashfree: new (config: { mode: string }) => CashfreeInstance;
  }
}

interface CashfreeInstance {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget: string;
  }) => Promise<{
    error?: { message: string };
    paymentDetails?: object;
  }>;
}

function loadCashfreeScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("cashfree-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "cashfree-script";
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function useRegistration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null);

  async function register(payload: RegistrationPayload, priceInRupees: number) {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create registration
      const { data: regData } = await axios.post(
        `${API_BASE}/api/registrations`,
        payload
      );
      const registrationId: string = regData.registrationId;

      // Step 2: Create Cashfree order (amount in rupees directly)
      const { data: orderData } = await axios.post(
        `${API_BASE}/api/payments/order`,
        {
          registrationId,
          amount: priceInRupees, // NOT multiplied by 100, Cashfree uses rupees
        }
      );

      // Step 3: Load Cashfree script
      const loaded = await loadCashfreeScript();
      if (!loaded)
        throw new Error("Failed to load payment SDK. Check your connection.");

      // Step 4: Open Cashfree checkout popup
      await new Promise<void>((resolve, reject) => {
        const cashfree = new window.Cashfree({
          mode: CASHFREE_ENV, // "sandbox" or "production"
        });

        cashfree
          .checkout({
            paymentSessionId: orderData.orderToken,
            redirectTarget: "_modal", // opens as popup, stays on your site
          })
          .then(async (result) => {
            // Payment failed or cancelled
            if (result.error) {
              reject(
                new Error(result.error.message || "Payment failed or cancelled.")
              );
              return;
            }

            // Payment completed successfully
            if (result.paymentDetails) {
              try {
                // Step 5: Verify payment on backend
                const { data: verifyData } = await axios.post(
                  `${API_BASE}/api/payments/verify`,
                  {
                    orderId: orderData.orderId,
                    registrationId,
                  }
                );

                // Step 6: Fetch full registration for confirmation screen
                const { data: fullReg } = await axios.get(
                  `${API_BASE}/api/registrations/${registrationId}`
                );

                setConfirmation({
                  registrationId,
                  eventName: fullReg.eventName,
                  participants: fullReg.participants,
                  paymentStatus: fullReg.payment?.status ?? "confirmed",
                  isTeamEvent: fullReg.isTeamEvent,
                  teamName: fullReg.teamName,
                  qrCode: verifyData.qrCode ?? "",
                });

                resolve();
              } catch {
                reject(
                  new Error("Payment verification failed. Contact support.")
                );
              }
            }
          })
          .catch(() => {
            reject(new Error("Payment cancelled."));
          });
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setConfirmation(null);
    setError(null);
  }

  return { register, loading, error, confirmation, reset };
}