import { supabase } from '@/lib/client';
import { buffer } from 'micro';
import Stripe from 'stripe';


// this hook should fetch the 
// const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);
export const config = {api: {bodyParser: false}}

const handler = async (req,res) => {
    const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY)
    const sig = req.headers['stripe-signature']
    const reqBuffer = await buffer(req)
    let event;
    try {
        event = stripe.webhooks.constructEvent(reqBuffer, sig, process.env.STRIPE_SIGNING_SECRET);
        // res.send({received: true})
    } catch(error) {
        console.log(error)
        res.status(400).send(`Webhook error: ${error.message}`)
    }
    
    // const supabase = getServiceSupabase();
    
    // Handle the event
    switch (event.type) {
        case 'customer.subscription.created':
            // const userId = event.data.object.metadata['user_id']
            const email = event.data.object.metadata['email']
            const stripeId = event.data.object.customer;
            const {data} = await supabase
            .from('Users')
            .update({
                stripe_id: stripeId,
                is_subscribed: true
            })
            .eq('email', email)
            .select()
            console.log('User after subscription update', data)
            // get metadata from webhook [x]
            // use email to lookup customer in supabase [x]
            // then update the User with the stripe_ with id event.data.object.customer and change is_subscribed = true [x]
            // console.log("Stripe Webhook data", event.data.object)
        // const customer = await stripe.customers.search({query: 'email:\'fakename\' AND metadata[\'foo\']:\'bar\'',});
        // fetch customer via email
        // extract stripe customer id
        // await supabase
            // .from('Stripe')
            // .update({
            //     is_subscribed: true
            // })
            // .eq("stripe_id", event.data.object.customer);
            // const customerSubscriptionCreated = event.data.object;
            // Then define and call a function to handle the event customer.subscription.created
            res.send(200)
            break;
        case 'customer.subscription.deleted':
            const customerSubscriptionDeleted = event.data.object;
            // Then define and call a function to handle the event customer.subscription.deleted
            break;
            // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // console.log(event)
    res.send({received: true})
}

export default handler;