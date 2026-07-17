export default function DashboardCards({ products = [] }) {
  const totalProducts = products.length;

  const featuredProducts = products.filter(
    (item) => item.featured
  ).length;

  const bestsellerProducts = products.filter(
    (item) => item.bestseller
  ).length;

  const lowStockProducts = products.filter(
    (item) => Number(item.stock) <= 5
  ).length;

  const cards = [
    {
      title: "Total Products",
      value: totalProducts,
      color: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: "📦",
    },
    {
      title: "Featured",
      value: featuredProducts,
      color: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      icon: "⭐",
    },
    {
      title: "Best Sellers",
      value: bestsellerProducts,
      color: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      icon: "🔥",
    },
    {
      title: "Low Stock",
      value: lowStockProducts,
      color: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: "⚠️",
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-2xl border ${card.border} ${card.color} p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {card.title}
              </p>

              <h2
                className={`mt-2 text-3xl font-bold ${card.text}`}
              >
                {card.value}
              </h2>
            </div>

            <div className="text-4xl">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}