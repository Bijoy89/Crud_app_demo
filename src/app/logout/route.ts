// src/app/logout/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    // get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      return NextResponse.json({ error: sessionError.message }, { status: 400 });
    }

    if (!session) {
      return NextResponse.json({ error: "No active session found" }, { status: 400 });
    }

    // sign out current session
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      return NextResponse.json({ error: signOutError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "unknown error" }, { status: 500 });
  }
}
