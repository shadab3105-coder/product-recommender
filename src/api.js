// Sends the user's preferences to our backend, which calls the AI.
export async function getRecommendations(query) {
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data; // { ids: number[], reason: string }
}
