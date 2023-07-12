import { supabase } from "@/lib/client"

export default async function handler(req, res) {
    await supabase.auth.api.setAuthCookie(req, res)

}