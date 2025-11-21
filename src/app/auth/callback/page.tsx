"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CallbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Supabase automatically parses URL on page load for magic link
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setError(error.message);
        } else if (data.session) {
          router.push("/dashboard");
        } else {
          setError("No session found. Please login again.");
        }
      } catch (err: any) {
        setError(err.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    handleAuth();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Processing login...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  return null;
}
