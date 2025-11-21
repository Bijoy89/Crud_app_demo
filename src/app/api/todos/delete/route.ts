import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServerClient";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const supabase = createServerClient();

    const { data: oldRecord, error: getErr } = await supabase
      .from("todos")
      .select("*")
      .eq("id", id)
      .single();

    if (getErr) return NextResponse.json({ error: getErr.message }, { status: 404 });

    const { error: delErr } = await supabase.from("todos").delete().eq("id", id);
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

    const { error: auditErr } = await supabase.from("audit_logs").insert({
      user_id: oldRecord.user_id,
      action: "delete",
      entity_id: id,
      previous_data: oldRecord,
      new_data: null,
    });

    if (auditErr) return NextResponse.json({ error: auditErr.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "unknown error" }, { status: 500 });
  }
}
