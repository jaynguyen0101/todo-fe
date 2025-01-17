"use client";

import { useState } from "react";
import {
  ArrowLeftIcon,
  PlusCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { TASK_COLORS } from "../../../constants";
import { TaskFormProps } from "../../../types";

const TaskForm: React.FC<TaskFormProps> = ({
  initialTitle = "",
  initialColor = TASK_COLORS[0].value,
  isEditing = false,
  onSubmit,
}) => {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [selectedColor, setSelectedColor] = useState(initialColor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    onSubmit(title.trim(), selectedColor);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 w-full max-w-3xl bg-gray-800 p-6 rounded-lg shadow-md space-y-6"
    >
      {/* Back Button */}
      <button
        type="button"
        onClick={() => router.push("/")}
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
          {TASK_COLORS.map(({ color, value }) => (
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
        className={`w-full px-6 py-3 rounded-lg shadow-md flex items-center justify-center gap-2 ${
          isEditing
            ? "bg-primary hover:bg-blue-600 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isEditing ? "Save" : "Add Task"}
        {isEditing ? (
          <CheckCircleIcon className="h-6 w-6" />
        ) : (
          <PlusCircleIcon className="h-6 w-6" />
        )}
      </button>
    </form>
  );
};

export default TaskForm;
