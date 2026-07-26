import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    pending: 0,
    packed: 0,
    shipped: 0,
    delivered: 0,
    products: 0,
    lowStock: 0,
    customOrders: 0,
    pendingCustomOrders: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        setLoading(true);
        setError("");

        const [
          { data: ordersData, error: ordersError },
          { data: productsData, error: productsError },
          { data: recentOrdersData, error: recentOrdersError },
          { data: customOrdersData, error: customOrdersError },
        ] = await Promise.all([
          supabase
            .from("orders")
            .select("amount, payment_status, status"),

          supabase
            .from("products")
            .select("id, stock"),

          supabase
            .from("orders")
            .select(
              "id, customer_name, amount, payment_method, payment_status, status, created_at"
            )
            .order("created_at", { ascending: false })
            .limit(5),

          supabase
            .from("custom_orders")
            .select("id, status"),
        ]);

        if (ordersError) {
          throw ordersError;
        }

        if (productsError) {
          throw productsError;
        }

        if (recentOrdersError) {
          throw recentOrdersError;
        }

        if (customOrdersError) {
          throw customOrdersError;
        }

        const orders = ordersData || [];
        const products = productsData || [];
        const customOrders = customOrdersData || [];

        const totalRevenue = orders.reduce((total, order) => {
          if (order.payment_status === "paid") {
            return total + Number(order.amount || 0);
          }

          return total;
        }, 0);

        setRecentOrders(recentOrdersData || []);

        setStats({
          orders: orders.length,

          revenue: totalRevenue,

          pending: orders.filter(
            (order) => (order.status || "Pending") === "Pending"
          ).length,

          packed: orders.filter(
            (order) => order.status === "Packed"
          ).length,

          shipped: orders.filter(
            (order) => order.status === "Shipped"
          ).length,

          delivered: orders.filter(
            (order) => order.status === "Delivered"
          ).length,

          products: products.length,

          lowStock: products.filter(
            (product) => Number(product.stock || 0) <= 5
          ).length,

          customOrders: customOrders.length,

          pendingCustomOrders: customOrders.filter(
            (order) => (order.status || "Pending") === "Pending"
          ).length,
        });
      } catch (fetchError) {
        console.error("Dashboard stats error:", fetchError);

        setError(
          fetchError?.message ||
            "Unable to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardStats();
  }, []);

  const cards = [
    {
      label: "Total Orders",
      value: stats.orders,
    },
    {
      label: "Revenue",
      value: `₹${stats.revenue.toLocaleString("en-IN")}`,
    },
    {
      label: "Pending Orders",
      value: stats.pending,
    },
    {
      label: "Packed Orders",
      value: stats.packed,
    },
    {
      label: "Shipped Orders",
      value: stats.shipped,
    },
    {
      label: "Delivered Orders",
      value: stats.delivered,
    },
    {
      label: "Products",
      value: stats.products,
    },
    {
      label: "Low Stock",
      value: stats.lowStock,
    },
    {
      label: "Custom Orders",
      value: stats.customOrders,
    },
    {
      label: "Pending Custom",
      value: stats.pendingCustomOrders,
    },
  ];

  return (
    <AdminLayout>
      <h1 className="font-heading text-4xl font-semibold text-[#6B4F3A]">
        Admin Dashboard
      </h1>

      <p className="mt-3 font-body text-gray-600">
        Welcome to Tashekari Admin Panel
      </p>

      {loading && (
        <p className="mt-8 font-body text-gray-500">
          Loading dashboard...
        </p>
      )}

      {error && (
        <div className="mt-8 rounded-2xl bg-red-50 px-5 py-4 font-body text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => (
              <div
                key={card.label}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <p className="font-body text-sm text-gray-500">
                  {card.label}
                </p>

                <h2 className="mt-3 font-heading text-4xl font-semibold text-[#6B4F3A]">
                  {card.value}
                </h2>
              </div>
            ))}
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="border-b border-[#E7D8CA] px-6 py-5">
              <h2 className="font-heading text-2xl font-semibold text-[#6B4F3A]">
                Recent Orders
              </h2>

              <p className="mt-1 font-body text-sm text-gray-500">
                Latest 5 customer orders.
              </p>
            </div>

            {recentOrders.length === 0 ? (
              <div className="px-6 py-10 text-center font-body text-gray-500">
                No recent orders found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead className="bg-[#F8F5F1]">
                    <tr className="font-body text-sm text-[#6B4F3A]">
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4">Order Status</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t border-[#E7D8CA] font-body text-sm text-gray-700"
                      >
                        <td className="px-6 py-5 font-semibold text-[#6B4F3A]">
                          {order.customer_name || "Unknown"}
                        </td>

                        <td className="px-6 py-5 font-semibold text-[#6B4F3A]">
                          ₹
                          {Number(order.amount || 0).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="px-6 py-5 capitalize">
                          {order.payment_method || "—"}

                          <span
                            className={`ml-2 rounded-full px-2 py-1 text-xs ${
                              order.payment_status === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.payment_status || "pending"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "Shipped"
                                  ? "bg-blue-100 text-blue-700"
                                  : order.status === "Packed"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : order.status === "Cancelled"
                                      ? "bg-gray-200 text-gray-700"
                                      : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          {order.created_at
                            ? new Date(
                                order.created_at
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}