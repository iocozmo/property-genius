

export default async function handler(req,res) {
    if (req.query.API_SECRET !== process.env.API_SECRET) {
        res.status(401).send("Not authorized");
    }

    // const {name, city} = req.body.record.raw_user_meta_data    
    // const {user_id} = req.body.record;
    // const {email, name} = req.body.record;
    // const formatted
    // console.log(user_id, email, name);
    
    // const stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY);
    // const customer = await stripe.customers.create({
    //     email: email,
    //     name: name.toString()
    // });
    // console.log("Stripe customer ", customer)

    // use service level supabase
    
    // try {
    //     const {data, error} = await supabase
    //     .from('Users')
    //     .update({'stripe_id': customer.id,})
    //     .eq('user_id', user_id)
    //     .select();
    //     // console.log("Data", data);
    //     // console.log("Error", error);        
    //     // if (updateError) {
    //     //     console.log("Update Error", updateError)
    //     // }
    //     // get the user_id after the request
    //     // use the user_id returned to update the table 
        
    // } catch (e) {
    // }
    
    res.send({message: `Customer added`})
}