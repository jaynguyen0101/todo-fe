"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/config/api";
import { useRouter } from "next/navigation";
import TaskForm from "../components/TaskForm";

export default function CreateTaskPage() {
  const router = useRouter();
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

  const handleAddTask = (title: string, color: string) => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    addTaskMutation.mutate({ title: title.trim(), color: color });
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
      <TaskForm onSubmit={handleAddTask} />
    </div>
  );
}
