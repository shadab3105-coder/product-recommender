export default function ProductCard({ product, highlighted }) {
  return (
    <article
      className={`flex flex-col rounded-xl border bg-white p-5 ${
        highlighted ? "border-brand" : "border-gray-200"
      }`}
    >
      <span className="text-xs text-brand">{product.category}</span>
      <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>
      <p className="mb-3 mt-1 flex-1 text-sm text-gray-500">{product.description}</p>
      <p className="text-xl font-bold">${product.price}</p>
    </article>
  );
}
