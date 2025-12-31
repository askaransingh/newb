import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Manual payout (admin-controlled)
export const payMechanic = async ({ amount, mechanic }) => {
  return await stripe.payouts.create({
    amount: amount * 100, // ₹ to paisa
    currency: "inr",
    method: "standard",
    destination: mechanic.bankDetails.accountNumber, // later: Stripe Connect
  });
};