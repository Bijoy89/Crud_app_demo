// src/app/dashboard/page.tsx
import { createServerClient } from "@/lib/supabaseServerClient";
import { redirect } from "next/navigation";

type Todo = {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
};

export default async function DashboardPage() {
  // Initialize Supabase server client (service role key, no arguments)
  const supabase = createServerClient();

  // Get current session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("Session error:", sessionError.message);
    redirect("/auth/login");
  }

  if (!session) {
    redirect("/auth/login");
  }

  const userId = session.user.id;

  // Fetch todos for this user
  const { data: todos, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch todos error:", error.message);
    return <p>Error loading todos: {error.message}</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {todos && todos.length > 0 ? (
        <ul className="space-y-4">
          {todos.map((todo: any) => (
            <li key={todo.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{todo.title}</h2>
              <p className="mt-2">{todo.description}</p>
              <small className="text-gray-500">
                Created at: {new Date(todo.created_at).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No todos found. Create your first todo!</p>
      )}
    </div>
  );
}
