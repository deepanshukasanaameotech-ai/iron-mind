import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Publishable Key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default stripePromise;
