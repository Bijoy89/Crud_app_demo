import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServerClient";

export async function POST(req: Request) {
  try {
    const { title, description, user_id } = await req.json();
    if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });

    const supabase = createServerClient();

    const { data: todo, error: todoErr } = await supabase
      .from("todos")
      .insert({ title, description, user_id })
      .select()
      .single();

    if (todoErr) return NextResponse.json({ error: todoErr.message }, { status: 500 });

    // audit logs table is 'audit_logs' (not 'audit_log')
    const { error: auditErr } = await supabase.from("audit_logs").insert({
      user_id,
      action: "create",
      entity_id: todo.id,
      previous_data: null,
      new_data: todo,
    });

    if (auditErr) return NextResponse.json({ error: auditErr.message }, { status: 500 });

    return NextResponse.json({ success: true, todo });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "unknown error" }, { status: 500 });
  }
}
