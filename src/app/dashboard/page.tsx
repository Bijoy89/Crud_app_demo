// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import LogoutButton from "@/components/LogoutButton";

interface Todo {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
}

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="p-6 max-w-4xl mx-auto bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center">Dashboard</h1>
        <LogoutButton />
      </div>

      {loading ? (
        <p>Loading todos...</p>
      ) : todos.length === 0 ? (
        <p>No todos found.</p>
      ) : (
        <ul className="space-y-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="border p-4 rounded-lg hover:shadow transition flex justify-between items-center bg-gray-800"
            >
              <div>
                <h2 className="font-semibold text-lg">{todo.title}</h2>
                <p className="text-gray-300">{todo.description}</p>
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
