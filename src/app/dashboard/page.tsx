"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Define the Todo type
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

  // Check session and fetch todos
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!session) {
        router.push("/auth/login");
        return;
      }

      fetchTodos(session.user.id);
    };

    const fetchTodos = async (userId: string) => {
      setLoading(true);
      try {
        // Here we provide both type arguments: Row type and Select type
        const { data, error } = await supabase
          .from<Todo, Todo>("todos")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setTodos(data || []);
      } catch (err: any) {
        setError(err.message ?? "Failed to load todos");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
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
