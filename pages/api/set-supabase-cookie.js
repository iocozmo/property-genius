
const handler = async (req, res) => {
    const refreshToken = req.cookies['my-refresh-token']
    const accessToken = req.cookies['my-access-token']

    if (refreshToken && accessToken) {
        await supabase.auth.setSession({
            refresh_token: refreshToken,
            access_token: accessToken,
            // {
            // auth: { persistSession: false },
            // }
        })
    } else {
    // make sure you handle this case!
    // throw new Error('User is not authenticated.')
    }

    // returns user information
    await supabase.auth.getUser()
    }

export default handler;