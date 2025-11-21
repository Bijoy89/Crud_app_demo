import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServerClient";

export async function POST(req: Request) {
    try {
        const { title, description, user_id } = await req.json();
        if (!user_id) return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
        const supabase = createServerClient();


        //insert todo
        const { data: todo, error: todoErr } = await supabase
            .from('todos')
            .insert({ title, description, user_id })
            .select()
            .single();
        if (todoErr) {
            console.error('todo insert Error', todoErr);
            return NextResponse.json({ error: todoErr.message }, { status: 500 });

        }

        //insert audit log
        const { error: auditErr } = await supabase.from('audit_log').insert({
            user_id,
            action: 'create',
            entity_id: todo.id,
            previous_data: null,
            new_data: todo

        });
        if (auditErr) {
            console.error('audit  insert Error', auditErr);
            return NextResponse.json({ error: auditErr.message }, { status: 500 });

        }
        return NextResponse.json({ success: true, todo });

    }
    catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message ?? 'unknown error' }, { status: 500 });

    }
}