import { supabase } from "@/lib/client";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    
    // Get user from supabase with user_id
    const {user_id} = req.body;
    const {data, error: fetchUserError} = await supabase
    .from('Users')
    .select()
    .eq('user_id', user_id)
    .single()

    if (fetchUserError) {
        console.log('Error fetching user from /api/update-stripe-user', fetchUserError.message)
    }
    // Extract email from user obj
    const email = data['email']
    const query = `email:"${email}"`
    
    // Get customer_id from stripe using email
    const customer = await stripe.customers.search({
        query: query,
      });
    const stripeId = customer.data[0].id
    
    // Update supabase user to have the correct stripe_id & change subscription status
    const {data: updatedUser, error: updateUserError} = await supabase
    .from('Users')
    .update({
        stripe_id: stripeId,
        is_subscribed: true
    })
    .eq('user_id', user_id)
    .select()

    if (updateUserError) {
        console.log('Error updating user from /api/update-stripe-user', updateUserError.message)
    }

    res.send({updateUserError})

}