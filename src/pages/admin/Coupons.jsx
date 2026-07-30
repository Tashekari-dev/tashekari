import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabase";

const EMPTY_FORM = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minimumOrder: "",
  maximumDiscount: "",
  usageLimit: "",
  startsAt: "",
  expiresAt: "",
  active: true,
};

function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(
    date.getTime() - offset * 60 * 1000
  );

  return localDate.toISOString().slice(0, 16);
}

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteCoupon, setDeleteCoupon] = useState(null);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const filteredCoupons = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return coupons;

    return coupons.filter((coupon) =>
      String(coupon.code || "")
        .toLowerCase()
        .includes(query)
    );
  }, [coupons, search]);

  async function fetchCoupons() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      setCoupons(data || []);
    } catch (error) {
      console.error("Fetch coupons error:", error);

      toast.dismiss();
      toast.error(
        error.message || "Coupons load nahi ho paye."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function openAddModal() {
    resetForm();
    setShowModal(true);
  }

  function closeModal() {
    if (saving) return;

    setShowModal(false);
    resetForm();
  }

  function handleChange(event) {
    const { name, value, type, checked } =
      event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validateForm() {
    const code = form.code.trim().toUpperCase();
    const discountValue = Number(form.discountValue);
    const minimumOrder = Number(
      form.minimumOrder || 0
    );
    const maximumDiscount =
      form.maximumDiscount === ""
        ? null
        : Number(form.maximumDiscount);
    const usageLimit =
      form.usageLimit === ""
        ? null
        : Number(form.usageLimit);

    if (!code) {
      toast.error("Coupon code required hai.");
      return false;
    }

    if (
      !["percentage", "flat"].includes(
        form.discountType
      )
    ) {
      toast.error("Discount type invalid hai.");
      return false;
    }

    if (
      !Number.isFinite(discountValue) ||
      discountValue <= 0
    ) {
      toast.error(
        "Discount value zero se zyada hona chahiye."
      );
      return false;
    }

    if (
      form.discountType === "percentage" &&
      discountValue > 100
    ) {
      toast.error(
        "Percentage discount 100 se zyada nahi ho sakta."
      );
      return false;
    }

    if (
      !Number.isFinite(minimumOrder) ||
      minimumOrder < 0
    ) {
      toast.error("Minimum order invalid hai.");
      return false;
    }

    if (
      maximumDiscount !== null &&
      (!Number.isFinite(maximumDiscount) ||
        maximumDiscount < 0)
    ) {
      toast.error("Maximum discount invalid hai.");
      return false;
    }

    if (
      usageLimit !== null &&
      (!Number.isInteger(usageLimit) ||
        usageLimit <= 0)
    ) {
      toast.error(
        "Usage limit positive whole number hona chahiye."
      );
      return false;
    }

    if (
      form.startsAt &&
      form.expiresAt &&
      new Date(form.expiresAt) <=
        new Date(form.startsAt)
    ) {
      toast.error(
        "Expiry date start date ke baad honi chahiye."
      );
      return false;
    }

    return true;
  }

  function getPayload() {
    return {
      code: form.code.trim().toUpperCase(),
      discount_type: form.discountType,
      discount_value: Number(form.discountValue),
      minimum_order: Number(
        form.minimumOrder || 0
      ),
      maximum_discount:
        form.maximumDiscount === ""
          ? null
          : Number(form.maximumDiscount),
      usage_limit:
        form.usageLimit === ""
          ? null
          : Number(form.usageLimit),
      starts_at: form.startsAt
        ? new Date(form.startsAt).toISOString()
        : null,
      expires_at: form.expiresAt
        ? new Date(form.expiresAt).toISOString()
        : null,
      active: form.active,
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = getPayload();

      if (editingId) {
        const { error } = await supabase
          .from("coupons")
          .update(payload)
          .eq("id", editingId);

        if (error) throw error;

        toast.success("Coupon updated successfully.");
      } else {
        const { error } = await supabase
          .from("coupons")
          .insert(payload);

        if (error) throw error;

        toast.success("Coupon created successfully.");
      }

      setShowModal(false);
      resetForm();
      await fetchCoupons();
    } catch (error) {
      console.error("Save coupon error:", error);

      toast.dismiss();

      if (error.code === "23505") {
        toast.error(
          "Ye coupon code already exist karta hai."
        );
      } else {
        toast.error(
          error.message || "Coupon save nahi hua."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(coupon) {
    setEditingId(coupon.id);

    setForm({
      code: coupon.code || "",
      discountType:
        coupon.discount_type || "percentage",
      discountValue:
        coupon.discount_value ?? "",
      minimumOrder: coupon.minimum_order ?? "",
      maximumDiscount:
        coupon.maximum_discount ?? "",
      usageLimit: coupon.usage_limit ?? "",
      startsAt: toDateTimeLocal(
        coupon.starts_at
      ),
      expiresAt: toDateTimeLocal(
        coupon.expires_at
      ),
      active: Boolean(coupon.active),
    });

    setShowModal(true);
  }

  async function handleToggleActive(coupon) {
    try {
      const { error } = await supabase
        .from("coupons")
        .update({
          active: !coupon.active,
        })
        .eq("id", coupon.id);

      if (error) throw error;

      toast.success(
        coupon.active
          ? "Coupon disabled."
          : "Coupon enabled."
      );

      await fetchCoupons();
    } catch (error) {
      console.error("Toggle coupon error:", error);

      toast.error(
        error.message ||
          "Coupon status update nahi hua."
      );
    }
  }

  async function handleDeleteCoupon() {
    if (!deleteCoupon) return;

    try {
      setDeleting(true);

      const { error } = await supabase
        .from("coupons")
        .delete()
        .eq("id", deleteCoupon.id);

      if (error) throw error;

      toast.success("Coupon deleted successfully.");

      setDeleteCoupon(null);
      await fetchCoupons();
    } catch (error) {
      console.error("Delete coupon error:", error);

      toast.error(
        error.message || "Coupon delete nahi hua."
      );
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(value) {
    if (!value) return "No limit";

    return new Date(value).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#6B4F3A]">
              Coupons
            </h1>

            <p className="mt-2 text-gray-500">
              Create and manage discount coupons.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="rounded-xl bg-[#6B4F3A] px-5 py-3 text-white transition hover:opacity-90"
          >
            + Add Coupon
          </button>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow">
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search coupon code..."
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#6B4F3A]"
          />
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow">
          <div className="border-b px-6 py-5">
            Total Coupons: {coupons.length}
          </div>

          {loading ? (
            <div className="p-10 text-center">
              Loading...
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No coupons found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1050px] w-full">
                <thead className="bg-[#F8F5F1]">
                  <tr>
                    <th className="p-5 text-left">
                      Code
                    </th>

                    <th className="p-5 text-left">
                      Discount
                    </th>

                    <th className="p-5 text-left">
                      Minimum
                    </th>

                    <th className="p-5 text-left">
                      Usage
                    </th>

                    <th className="p-5 text-left">
                      Validity
                    </th>

                    <th className="p-5 text-left">
                      Status
                    </th>

                    <th className="p-5 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCoupons.map((coupon) => (
                    <tr
                      key={coupon.id}
                      className="border-t"
                    >
                      <td className="p-5">
                        <span className="rounded-lg bg-[#F8F5F1] px-3 py-2 font-semibold text-[#6B4F3A]">
                          {coupon.code}
                        </span>
                      </td>

                      <td className="p-5">
                        {coupon.discount_type ===
                        "percentage"
                          ? `${coupon.discount_value}%`
                          : `₹${Number(
                              coupon.discount_value
                            ).toLocaleString(
                              "en-IN"
                            )}`}

                        {coupon.maximum_discount !==
                          null && (
                          <p className="mt-1 text-xs text-gray-500">
                            Max ₹
                            {Number(
                              coupon.maximum_discount
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        )}
                      </td>

                      <td className="p-5">
                        ₹
                        {Number(
                          coupon.minimum_order || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      <td className="p-5">
                        {coupon.used_count || 0}
                        {" / "}
                        {coupon.usage_limit || "∞"}
                      </td>

                      <td className="p-5 text-sm">
                        <p>
                          Start:{" "}
                          {formatDate(
                            coupon.starts_at
                          )}
                        </p>

                        <p className="mt-1">
                          End:{" "}
                          {formatDate(
                            coupon.expires_at
                          )}
                        </p>
                      </td>

                      <td className="p-5">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleActive(coupon)
                          }
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            coupon.active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {coupon.active
                            ? "Active"
                            : "Inactive"}
                        </button>
                      </td>

                      <td className="p-5">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(coupon)
                            }
                            className="rounded-lg border px-4 py-2"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteCoupon(coupon)
                            }
                            className="rounded-lg bg-red-500 px-4 py-2 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-[#6B4F3A]">
                  {editingId
                    ? "Edit Coupon"
                    : "Add Coupon"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Configure discount and validity.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="text-3xl disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block font-medium text-[#6B4F3A]">
                    Coupon Code *
                  </label>

                  <input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="WELCOME10"
                    className="w-full rounded-xl border px-4 py-3 uppercase"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-[#6B4F3A]">
                    Discount Type *
                  </label>

                  <select
                    name="discountType"
                    value={form.discountType}
                    onChange={handleChange}
                    className="w-full rounded-xl border px-4 py-3"
                  >
                    <option value="percentage">
                      Percentage
                    </option>

                    <option value="flat">
                      Flat Amount
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-medium text-[#6B4F3A]">
                    Discount Value *
                  </label>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    name="discountValue"
                    value={form.discountValue}
                    onChange={handleChange}
                    placeholder={
                      form.discountType ===
                      "percentage"
                        ? "10"
                        : "100"
                    }
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-[#6B4F3A]">
                    Minimum Order
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="minimumOrder"
                    value={form.minimumOrder}
                    onChange={handleChange}
                    placeholder="499"
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-[#6B4F3A]">
                    Maximum Discount
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="maximumDiscount"
                    value={form.maximumDiscount}
                    onChange={handleChange}
                    disabled={
                      form.discountType === "flat"
                    }
                    placeholder="200"
                    className="w-full rounded-xl border px-4 py-3 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-[#6B4F3A]">
                    Usage Limit
                  </label>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    name="usageLimit"
                    value={form.usageLimit}
                    onChange={handleChange}
                    placeholder="100"
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-[#6B4F3A]">
                    Start Date
                  </label>

                  <input
                    type="datetime-local"
                    name="startsAt"
                    value={form.startsAt}
                    onChange={handleChange}
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-[#6B4F3A]">
                    Expiry Date
                  </label>

                  <input
                    type="datetime-local"
                    name="expiresAt"
                    value={form.expiresAt}
                    onChange={handleChange}
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                />

                Active Coupon
              </label>

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-[#6B4F3A] px-5 py-3 text-[#6B4F3A]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#6B4F3A] px-5 py-3 text-white disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Coupon"
                    : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteCoupon && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-[#6B4F3A]">
              Delete Coupon
            </h2>

            <p className="mt-4 text-gray-600">
              Delete{" "}
              <span className="font-semibold">
                {deleteCoupon.code}
              </span>
              ?
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeleteCoupon(null)
                }
                disabled={deleting}
                className="rounded-xl border border-[#6B4F3A] px-5 py-3 text-[#6B4F3A]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteCoupon}
                disabled={deleting}
                className="rounded-xl bg-red-500 px-5 py-3 text-white disabled:opacity-60"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}