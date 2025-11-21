"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Todo {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
}

export default function TodosPage() {
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Todos</h1>
      <Link
        href="/todos/new"
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mb-4 inline-block"
      >
        + Add Todo
      </Link>

      {loading ? (
        <p>Loading...</p>
      ) : todos.length === 0 ? (
        <p>No todos yet.</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="border p-3 rounded hover:shadow">
              <Link href={`/todos/${todo.id}`}>
                <h2 className="font-semibold">{todo.title}</h2>
                <p>{todo.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
