import { useState } from "react";
import { products } from "./products";

export default function App() {
  const [query, setQuery] = useState(""); // user ne jo likha
  const [shown, setShown] = useState(products); // jo products screen pe dikh rahe hain
  const [message, setMessage] = useState(""); // AI ka reason ya error
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null); // jis product pe click kiya uski id

  async function handleSearch() {
    setLoading(true);
    setMessage("");

    try {
      // 1. Server ko user ki baat bhejo
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // 2. Sirf wahi products rakho jinki id AI ne batayi
      setShown(products.filter((p) => data.ids.includes(p.id)));
      setMessage(data.reason);
    } catch (error) {
      setMessage("Error: " + error.message);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="mb-4 text-3xl font-bold text-center">Product Finder</h1>

      {/* Search box */}
      <div className="flex gap-2">
        <input
          className="flex-1 rounded border p-3"
          placeholder="e.g. I want a phone under $500"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);

            // text delete kiya to sab products wapas dikha do
            if (e.target.value === "") {
              setShown(products);
              setMessage("");
            }
          }}
        />
        <button
          className="rounded bg-green-700 px-5 text-white disabled:opacity-50"
          onClick={handleSearch}
          disabled={loading || !query}
        >
          {loading ? "Searching..." : "Recommend"}
        </button>
      </div>

      {/* AI ka message */}
      {message && <p className="mt-4 rounded bg-green-100 p-3">{message}</p>}

      {/* Products list */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 hover:">
        {shown.map((p) => (
          <div key={p.id} className="rounded border bg-white p-4">
            <p className="text-sm text-green-700">{p.category}</p>
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-500">{p.description}</p>
            <p className="mt-2 text-lg font-bold">${p.price}</p>
          </div>
        ))}
      </div>

      {shown.length === 0 && <p className="mt-6 text-gray-500">No matching products found.</p>}
    </div>
  );
}