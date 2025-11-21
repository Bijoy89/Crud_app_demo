"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Todo {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
}

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchTodos() {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setTodos(data);

      setLoading(false);
    }

    fetchTodos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Link
        href="/todos/new"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 inline-block"
      >
        + New Todo
      </Link>

      {loading ? (
        <p>Loading todos...</p>
      ) : todos.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li key={todo.id} className="border p-3 rounded hover:shadow">
              <Link href={`/todos/${todo.id}`} className="block">
                <h2 className="font-semibold">{todo.title}</h2>
                <p className="text-gray-600">{todo.description}</p>
                <p>Status: {todo.is_completed ? "Completed" : "Pending"}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
