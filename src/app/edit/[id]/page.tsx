"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/config/api";
import { ArrowLeftIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const COLORS = [
  { color: "bg-red-500", value: "red" },
  { color: "bg-yellow-500", value: "yellow" },
  { color: "bg-green-500", value: "green" },
  { color: "bg-blue-500", value: "blue" },
  { color: "bg-purple-500", value: "purple" },
  { color: "bg-pink-500", value: "pink" },
  { color: "bg-gray-500", value: "gray" },
];

export default function EditTaskPage() {
  const router = useRouter();
  const { id } = useParams(); // Get the task ID from the URL
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);

  // Fetch the existing task
  const {
    data: task,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/tasks/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch task");
      }
      return res.json();
    },
    enabled: !!id,
  });

  // Populate the form with the task data when available
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setSelectedColor(task.color);
    }
  }, [task]);

  // Mutation to update the task
  const updateTaskMutation = useMutation({
    mutationFn: async ({
      id,
      title,
      color,
    }: {
      id: string;
      title: string;
      color: string;
    }) => {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, color }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refresh the task list
      alert("Task updated successfully!");
      router.push("/"); // Redirect to Home View
    },
    onError: (error) => {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (typeof id === "string") {
      updateTaskMutation.mutate({ id, title, color: selectedColor });
    } else {
      alert("Invalid task ID");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error fetching task. Please try again.
      </div>
    );
  }

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
          disabled={isLoading}
          className={`w-full px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 ${
            isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-primary hover:bg-blue-600 text-white"
          }`}
        >
          {isLoading ? "Saving..." : "Save"}
          {!isLoading && <CheckCircleIcon className="h-6 w-6" />}
        </button>
      </form>
    </div>
  );
}
