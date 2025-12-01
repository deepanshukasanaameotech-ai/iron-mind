import React, { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from './UIComponents';
import { supabase } from '../services/supabase';

interface PaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          onSuccess();
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: window.location.href,
      },
      redirect: 'if_required' // Use 'if_required' to avoid redirect if not needed (e.g. card payments without 3DS)
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message ?? "An unexpected error occurred.");
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else {
      // Payment succeeded directly (no redirect)
      setMessage("Payment succeeded!");
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" options={{layout: 'tabs'}} />
      <div className="flex gap-4 mt-6">
          <Button disabled={isLoading || !stripe || !elements} id="submit" className="flex-1">
            <span id="button-text">
              {isLoading ? <div className="spinner" id="spinner">Processing...</div> : "Pay Now"}
            </span>
          </Button>
          <button type="button" onClick={onCancel} className="text-neutral-400 hover:text-white text-sm font-mono">
            Cancel
          </button>
      </div>
      {message && <div id="payment-message" className="text-red-400 text-xs font-mono mt-2">{message}</div>}
    </form>
  );
}
