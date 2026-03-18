import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

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
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
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
      const { data: regData } = await axios.post(`${API_BASE}/api/registrations`, payload);
      const registrationId: string = regData.registrationId;

      // Step 2: Create Razorpay order
      const { data: orderData } = await axios.post(`${API_BASE}/api/payments/order`, {
        registrationId,
        amount: priceInRupees * 100, // convert to paise
      });

      // Step 3: Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load Razorpay. Check your connection.");

      // Step 4: Open Razorpay checkout
      const leadParticipant = payload.participant ?? payload.participants?.[0];

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          order_id: orderData.orderId,
          name: "IT Fest",
          description: payload.eventName,
          prefill: {
            name: leadParticipant?.name,
            email: leadParticipant?.email,
            contact: leadParticipant?.phone,
          },
          theme: { color: "#00af5a" },
          handler: async (response: RazorpayResponse) => {
            try {
              // Step 5: Verify payment
              await axios.post(`${API_BASE}/api/payments/verify`, {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                registrationId,
              });

              // Step 6: Fetch full registration for confirmation
              const { data: fullReg } = await axios.get(`${API_BASE}/api/registrations/${registrationId}`);
              setConfirmation({
                registrationId,
                eventName: fullReg.eventName,
                participants: fullReg.participants,
                paymentStatus: fullReg.payment?.status ?? "confirmed",
                isTeamEvent: fullReg.isTeamEvent,
                teamName: fullReg.teamName,
              });
              resolve();
            } catch (err) {
              reject(new Error("Payment verification failed. Contact support."));
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled.")),
          },
        });
        rzp.open();
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
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
