"use client";

import { useState } from "react";

interface TodoFormProps {
  initialTitle?: string;
  initialDescription?: string;
  initialCompleted?: boolean;
  onSubmit: (title: string, description: string, isCompleted: boolean) => void;
}

export default function TodoForm({
  initialTitle = "",
  initialDescription = "",
  initialCompleted = false,
  onSubmit,
}: TodoFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [isCompleted, setIsCompleted] = useState(initialCompleted);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(title, description, isCompleted);
      }}
      className="space-y-3"
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      ></textarea>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
        />
        <span>Completed</span>
      </label>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Submit
      </button>
    </form>
  );
}
