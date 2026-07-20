import AdminLayout from "../../components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [stats, setStats] = useState({
  orders: 0,
  revenue: 0,
  pending: 0,
  products: 0,
});
useEffect(() => {
  async function fetchDashboardStats() {
    try {
      const [
        { data: ordersData, error: ordersError },
        { count: productsCount, error: productsError },
      ] = await Promise.all([
        supabase
          .from("orders")
          .select("amount, payment_status"),

        supabase
          .from("products")
          .select("*", { count: "exact", head: true }),
      ]);

      if (ordersError) {
        throw ordersError;
      }

      if (productsError) {
        throw productsError;
      }

      const totalOrders = ordersData?.length || 0;

      const totalRevenue =
        ordersData?.reduce((total, order) => {
          if (order.payment_status === "paid") {
            return total + Number(order.amount || 0);
          }

          return total;
        }, 0) || 0;

      const pendingOrders =
        ordersData?.filter(
          (order) => order.payment_status !== "paid"
        ).length || 0;

      setStats({
        orders: totalOrders,
        revenue: totalRevenue,
        pending: pendingOrders,
        products: productsCount || 0,
      });
    } catch (error) {
      console.error("Dashboard stats error:", error);
    }
  }

  fetchDashboardStats();
}, []);
  return (
    <AdminLayout>
      <h1 className="text-4xl font-bold text-[#6B4F3A]">
        Admin Dashboard
      </h1>

      <p className="mt-3 text-gray-600">
        Welcome to Tashekari Admin Panel
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

  <div className="rounded-3xl bg-white p-6 shadow-sm">
    <p className="text-sm text-gray-500">
      Total Orders
    </p>

    <h2 className="mt-3 text-4xl font-bold text-[#6B4F3A]">
      {stats.orders}
    </h2>
  </div>

  <div className="rounded-3xl bg-white p-6 shadow-sm">
    <p className="text-sm text-gray-500">
      Revenue
    </p>

    <h2 className="mt-3 text-4xl font-bold text-[#6B4F3A]">
      ₹{stats.revenue.toLocaleString()}
    </h2>
  </div>

  <div className="rounded-3xl bg-white p-6 shadow-sm">
    <p className="text-sm text-gray-500">
      Pending Orders
    </p>

    <h2 className="mt-3 text-4xl font-bold text-[#6B4F3A]">
      {stats.pending}
    </h2>
  </div>

  <div className="rounded-3xl bg-white p-6 shadow-sm">
    <p className="text-sm text-gray-500">
      Products
    </p>

    <h2 className="mt-3 text-4xl font-bold text-[#6B4F3A]">
      {stats.products}
    </h2>
  </div>

</div>
    </AdminLayout>
  );
}