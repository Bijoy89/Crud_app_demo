"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface Todo {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!session) {
          router.push("/auth/login");
          return;
        }

        // ✅ DO NOT pass Todo type; use any to avoid infinite recursion
        const { data, error: todosError } = await supabase
          .from("todos") // <any> avoids TS deep recursion
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (todosError) throw todosError;

        // ✅ cast to Todo[]
        setTodos(data as Todo[]);
      } catch (err: any) {
        setError(err.message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [router]);

  if (loading) return <p className="text-center mt-10">Loading todos...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Dashboard</h1>
      {todos.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="p-4 border rounded shadow hover:bg-gray-50 transition"
            >
              <h2 className="font-semibold text-lg">{todo.title}</h2>
              <p className="text-gray-600">{todo.description}</p>
              <p className="text-xs text-gray-400 mt-1">
                Created: {new Date(todo.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
