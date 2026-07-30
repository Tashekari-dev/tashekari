import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function getNumber(value) {
  const cleanedValue = String(value ?? 0).replace(/[₹,\s]/g, "");
  const numberValue = Number(cleanedValue);

  return Number.isFinite(numberValue) ? numberValue : 0;
}

export default function InvoiceButton({ order }) {
  function downloadInvoice() {
    const doc = new jsPDF();

    const items = Array.isArray(order?.items) ? order.items : [];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Tashekari", 14, 20);

    doc.setFontSize(15);
    doc.text("INVOICE", 14, 30);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(`Order ID: ${order?.id || "-"}`, 14, 42);

    doc.text(
      `Date: ${
        order?.created_at
          ? new Date(order.created_at).toLocaleDateString("en-IN")
          : "-"
      }`,
      14,
      49
    );

    doc.text(
      `Customer: ${order?.customer_name || "Customer"}`,
      14,
      60
    );

    doc.text(`Email: ${order?.email || "-"}`, 14, 67);
    doc.text(`Phone: ${order?.phone || "-"}`, 14, 74);

    const address = [
      order?.address,
      order?.city,
      order?.state,
      order?.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    doc.text(`Address: ${address || "-"}`, 14, 81, {
      maxWidth: 180,
    });

    const rows = items.map((item) => {
      const price = getNumber(item.price);
      const quantity = getNumber(item.quantity) || 1;
      const total = price * quantity;

      return [
        item.name || "Tashekari Product",
        String(quantity),
        `Rs. ${price.toLocaleString("en-IN")}`,
        `Rs. ${total.toLocaleString("en-IN")}`,
      ];
    });

    autoTable(doc, {
      startY: 92,
      head: [["Product", "Qty", "Price", "Total"]],
      body: rows,
      theme: "grid",

      headStyles: {
        fillColor: [107, 79, 58],
        textColor: [255, 255, 255],
      },

      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 4,
      },

      columnStyles: {
        0: {
          cellWidth: 85,
        },
        1: {
          halign: "center",
        },
        2: {
          halign: "right",
        },
        3: {
          halign: "right",
        },
      },
    });

    const finalY = doc.lastAutoTable?.finalY
      ? doc.lastAutoTable.finalY + 14
      : 120;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);

    doc.text(
      `Grand Total: Rs. ${getNumber(order?.amount).toLocaleString(
        "en-IN"
      )}`,
      14,
      finalY
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text(
      `Payment Method: ${order?.payment_method || "-"}`,
      14,
      finalY + 9
    );

    doc.text(
      `Payment Status: ${order?.payment_status || "Pending"}`,
      14,
      finalY + 16
    );

    doc.text(
      "Thank you for shopping with Tashekari.",
      14,
      finalY + 30
    );

    doc.save(`Tashekari-Invoice-${order?.id || "order"}.pdf`);
  }

  return (
    <button
      type="button"
      onClick={downloadInvoice}
      className="w-full rounded-full bg-[#6B4F3A] px-6 py-3 font-body font-medium text-white transition hover:bg-[#4E3829]"
    >
      Download Invoice
    </button>
  );
}