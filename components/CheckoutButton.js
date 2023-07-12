import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_KEY
)

const CheckoutButton = () => {
    const router = useRouter();
    const handleCheckout = async () => {
        try {
            const stripe = await stripePromise;
            const response = await fetch("/api/checkout_sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const {sessionId} = await response.json();
            const {error} = await stripe.redirectToCheckout({
                sessionId
            })
            if (error) {
                router.push(`${process.env.CLIENT_URL}/login-failed`)
            }
        } catch (err) {
            console.log("Error in creating session", err);
            router.push(`${process.env.CLIENT_URL}/login-failed`)
        }
    }
    
}

export default CheckoutButton