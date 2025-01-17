"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/config/api";
import { PlusCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const COLORS = [
  { color: "bg-red-500", value: "red" },
  { color: "bg-orange-500", value: "orange" },
  { color: "bg-yellow-500", value: "yellow" },
  { color: "bg-green-500", value: "green" },
  { color: "bg-blue-500", value: "blue" },
  { color: "bg-purple-500", value: "purple" },
  { color: "bg-pink-500", value: "pink" },
  { color: "bg-rose-500", value: "pink-red" },
  { color: "bg-amber-500", value: "beige" },
];

export default function CreateTaskPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const queryClient = useQueryClient();

  // React Query Mutation for adding a task
  const addTaskMutation = useMutation({
    mutationFn: async ({ title, color }: { title: string; color: string }) => {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, color }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate the tasks query to refresh the task list
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      alert("Task added successfully!");
      router.push("/");
    },
    onError: (error) => {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    addTaskMutation.mutate({ title: title.trim(), color: selectedColor });
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center">
      {/* Header */}
      <header className="w-full  bg-black  text-center h-52 flex flex-col items-center justify-center z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
            <span role="img" aria-label="rocket">
              🚀
            </span>
            <span className="text-primary">Todo</span>{" "}
            <span className="text-accent">App</span>
          </h1>
        </div>
      </header>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-8 w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-md space-y-6"
      >
        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.push("/")} // Navigate back without saving
          className="text-white hover:text-gray-200"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>

        {/* Title Field */}
        <div>
          <label htmlFor="title" className="block text-blue-400 font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex. Brush your teeth"
            className="mt-2 w-full p-3 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Color Selector */}
        <div>
          <label className="block text-blue-400 font-medium mb-2">Color</label>
          <div className="flex items-center gap-4">
            {COLORS.map(({ color, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedColor(value)}
                className={`h-10 w-10 rounded-full border-2 hover:scale-110 ${
                  selectedColor === value
                    ? "border-primary"
                    : "border-transparent"
                } ${color} focus:outline-none`}
              ></button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={addTaskMutation.isPending === true}
          className={`w-full px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 ${
            addTaskMutation.isPending === true
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {addTaskMutation.isPending === true ? "Adding..." : "Add Task"}
          {!addTaskMutation.isPending === true && (
            <PlusCircleIcon className="h-6 w-6" />
          )}
        </button>
      </form>
    </div>
  );
}
