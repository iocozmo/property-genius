
const stripe = require('stripe')(process.env.STRIPE_TEST_SECRET_KEY);

export default async function handler(req, res) {    
    // Extract email & user_id from sign up
    const email = req.body['email']    
    const user_id = req.body['user_id']
    
    if (req.method === "POST") {
        try {
            // Create Stripe checkout session
            // TODO: Update urls to use dynamic routing
            const session = await stripe.checkout.sessions.create({                   
                customer_email: email,         
                line_items: [
                    {
                        price: 'price_1NNlt6GjMvPQVfL7qj4Qy49Y', 
                        quantity: 1
                    }
                ],
                mode: "subscription",
                success_url: `${process.env.CLIENT_URL}/signup-success/?success=true&id=${user_id}`,
                cancel_url: `${process.env.CLIENT_URL}/signup/failure=true?`,
                automatic_tax: {enabled: true},
                metadata: {
                    "email": email, 
                    "user_id": user_id
                }
            })
            // res.status(200).json({sessionId: session.id});
            // res.redirect(303, session.url);
            res.send({url: session.url})
        } catch (err) {
            console.log(err)
            res.status(err.statusCode || 500).json(err.message);
            // res.status(500).json({error: `Error creating checkout session: ${err}`})
        }
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
}