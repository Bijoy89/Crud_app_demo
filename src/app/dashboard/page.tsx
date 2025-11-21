"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
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
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTodos() {
      const { data, error } = await supabase
        .from<"todos",Todo>("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) setError(error.message);
      else setTodos(data ?? []);

      setLoading(false);
    }

    fetchTodos();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      <div className="flex justify-center mb-6">
        <Link
          href="/todos/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          + New Todo
        </Link>
      </div>

      {loading && <p className="text-center">Loading todos...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && todos.length === 0 && <p className="text-center">No todos found.</p>}

      {!loading && todos.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="border p-4 rounded hover:shadow transition bg-white"
            >
              <Link href={`/todos/${todo.id}`} className="block">
                <h2 className="font-semibold text-lg mb-2">{todo.title}</h2>
                <p className="text-gray-600 mb-2">{todo.description}</p>
                <p
                  className={`font-semibold ${
                    todo.is_completed ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {todo.is_completed ? "Completed" : "Pending"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
