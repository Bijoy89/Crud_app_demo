"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface Todo {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTodos() {
      const { data, error } = await supabase
        .from<"todos", Todo>("todos") // ✅ two type arguments
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setTodos(data ?? []);
      setLoading(false);
    }

    fetchTodos();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      <Link
        href="/todos/new"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6 inline-block"
      >
        + New Todo
      </Link>

      {loading ? (
        <p>Loading todos...</p>
      ) : todos.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="border p-4 rounded-lg hover:shadow transition flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">{todo.title}</h2>
                <p className="text-gray-600">{todo.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-white font-medium ${
                  todo.is_completed ? "bg-green-500" : "bg-yellow-500"
                }`}
              >
                {todo.is_completed ? "Completed" : "Pending"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
