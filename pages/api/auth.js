import { supabase } from "@/lib/client";

export default function handler(req,res) {
    supabase.auth.api.setAuthCookie(res,res)
}