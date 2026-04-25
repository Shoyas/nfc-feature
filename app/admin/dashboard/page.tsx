"use client";

import { useState } from "react";

export default function AdminPage() {
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");

  const createBracelet = async () => {
    await fetch("/api/bracelet", {
      method: "POST",
      body: JSON.stringify({ slug, category })
    });

    alert("Created!");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Slug"
        onChange={(e) => setSlug(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Category"
        onChange={(e) => setCategory(e.target.value)}
      />

      <button
        onClick={createBracelet}
        className="bg-black text-white px-4 py-2"
      >
        Create Bracelet
      </button>

      <hr className="my-6" />

      <form
        action="/api/upload"
        method="post"
        encType="multipart/form-data"
      >
        <input type="file" name="file" />
        <button className="bg-blue-500 text-white px-4 py-2 mt-2">
          Upload CSV
        </button>
      </form>
    </div>
  );
}