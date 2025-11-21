"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Get session from Supabase auth automatically
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error.message);
        router.push("/auth/login");
        return;
      }

      if (data.session) {
        router.push("/dashboard"); // redirect if session exists
      } else {
        router.push("/auth/login");
      }
    };

    handleAuth();
  }, [router]);

  return <p>Logging in...</p>;
}
