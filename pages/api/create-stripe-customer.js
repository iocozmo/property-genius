// import { Stripe } from 'stripe';

const handler = async (req,res) => {
    const {val} = JSON.parse(req.body);
    res.send({val});
    // const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    // const customer = await stripe.customers.create({
    //     email: req.body.record.email
    // });
    // res.send({message: `stripe customer ${customer.id}`})
}

export default handler;