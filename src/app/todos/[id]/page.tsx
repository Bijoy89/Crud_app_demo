"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { updateTodo, deleteTodo } from "@/lib/todoApi";

interface Todo {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export default function TodoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch single todo
  useEffect(() => {
    async function fetchTodo() {
      if (!id) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) return alert(error.message);

      setTodo(data);
      setTitle(data.title);
      setDescription(data.description);
      setIsCompleted(data.is_completed);
      setLoading(false);
    }

    fetchTodo();
  }, [id, router]);

  // Update todo
  const handleUpdate = async () => {
    if (!todo) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert("Login required");

    const res = await updateTodo(todo.id, {
      title,
      description,
      is_completed: isCompleted,
      user_id: user.id, // include user id in the object
    });

    if (res.success) alert("Updated!");
    else alert(res.error || "Error updating");
  };

  // Delete todo
  const handleDelete = async () => {
    if (!todo) return;

    const res = await deleteTodo(todo.id);
    if (res.success) router.push("/dashboard");
    else alert(res.error || "Error deleting");
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
        />
        <span>Completed</span>
      </label>
      <div className="flex space-x-2">
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
