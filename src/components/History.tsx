"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function History() {
  const [queries, setQueries] = useState<string[]>(() => {
    // Load queries from localStorage only once during initialization
    try {
      return JSON.parse(localStorage.getItem("queries") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      if (queries.length > 0) {
        localStorage.setItem("queries", JSON.stringify(queries));
      } else {
        localStorage.removeItem("queries"); // Cleanup when empty
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [queries]);

  const addQuery = () => {
    setQueries((prev) => [...prev, `Query ${prev.length + 1}`]);
  };

  const clearQueries = () => setQueries([]);

  return (
    <div className="p-4 space-y-4">
      <Button
        onClick={addQuery}
        variant="default"
        className="w-full bg-blue-500 text-white hover:bg-blue-600"
      >
        Add Query
      </Button>

      <h2 className="text-lg font-bold text-green-600">Past Queries</h2>

      {queries.length > 0 ? (
        <div className="space-y-2">
          {queries.map((q, i) => (
            <Button
              key={i}
              variant="outline"
              className="w-full text-left justify-start bg-yellow-50 hover:bg-yellow-100"
            >
              {q}
            </Button>
          ))}
          <Button
            onClick={clearQueries}
            variant="destructive"
            className="w-full bg-red-500 text-white hover:bg-red-600 mt-2"
          >
            Clear History
          </Button>
        </div>
      ) : (
        <p className="text-gray-500 italic">No queries yet.</p>
      )}
    </div>
  );
}
