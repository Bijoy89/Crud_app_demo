import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServerClient";

export async function POST(req: Request) {
  try {
    const { id, newData } = await req.json();
    if (!id || !newData) return NextResponse.json({ error: "id and newData are required" }, { status: 400 });

    const supabase = createServerClient();

    const { data: oldRecord, error: getErr } = await supabase
      .from("todos")
      .select("*")
      .eq("id", id)
      .single();

    if (getErr) return NextResponse.json({ error: getErr.message }, { status: 404 });

    const { error: updateErr } = await supabase
      .from("todos")
      .update({ ...newData, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

    const { error: auditErr } = await supabase.from("audit_logs").insert({
      user_id: oldRecord.user_id,
      action: "update",
      entity_id: id,
      previous_data: oldRecord,
      new_data: newData,
    });

    if (auditErr) return NextResponse.json({ error: auditErr.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "unknown error" }, { status: 500 });
  }
}
