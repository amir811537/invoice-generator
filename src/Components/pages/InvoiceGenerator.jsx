/* eslint-disable react/prop-types */
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { useMemo, useState } from "react";
import logo from "../../assets/bgremovelogo.png";
import QR from "../../assets/qr-code.png";

// ---- Font (Bengali) ----
Font.register({
  family: "NotoSerifBengali",
  fonts: [
    {
      src: "/fonts/NotoSerifBengali-VariableFont_wdth,wght.ttf",
      fontStyle: "normal",
      fontWeight: "normal",
    },
  ],
});

// ---- PDF styles ----
const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSerifBengali",
    padding: 30,
    fontSize: 12,
    backgroundColor: "#fff",
    color: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  companyInfo: { flexDirection: "row", alignItems: "center" },
  logo: { width: 32, height: 32, marginRight: 8 },
  invoiceInfo: { textAlign: "right" },
  invoiceTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  section: {
    borderBottom: "2px solid #ccc",
    paddingBottom: 10,
    marginBottom: 20,
  },
  billToTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  billToText: { color: "#4a4a4a", marginBottom: 2 },
  table: { width: "100%", marginBottom: 20 },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    backgroundColor: "#f3f3f3",
    padding: 6,
  },
  tableRow: { flexDirection: "row", padding: 6, borderBottom: "1px solid #eee" },
  cell: { flex: 1, textAlign: "left" },
  rightCell: { textAlign: "right" },
  summaryRow: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 6 },
  summaryText: { marginRight: 10, color: "#4a4a4a" },
  totalText: { fontWeight: "bold", fontSize: 16 },
  notes: {
    borderTop: "2px solid #ccc",
    paddingTop: 10,
    marginTop: 20,
    color: "#4a4a4a",
    fontSize: 11,
  },


  
  billCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  billRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  billLabel: {
    fontWeight: "600",
    color: "#444",
    width: 90,
  },
  billValue: {
    flex: 1,
    color: "#555",
  },

});

// ---- Suggestion list (you can extend this) ----
const productList = [
  { name: "Smart Watch", price: 800 },
  { name: "Sunglass", price: 300 },
];

const currency = (n) =>
  new Intl.NumberFormat("bn-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(
    Number.isFinite(n) ? n : 0
  );

const todayISO = () => new Date().toISOString().split("T")[0];

const InvoiceComponent = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    apartment: "",
    phone: "",
    email: "",
    customDate: todayISO(),
    paymentMethod: "Cash",
    deliveryCharge: 0,
    items: [{ name: "", quantity: 0, price: 0 }],
  });

  // ---- Derived amounts (always live) ----
  const { subtotal, total } = useMemo(() => {
    const sub = form.items.reduce((acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.price) || 0), 0);
    return {
      subtotal: sub,
      total: sub + (Number(form.deliveryCharge) || 0),
    };
  }, [form.items, form.deliveryCharge]);

  // ---- Handlers ----
  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setItemField = (idx, key, val) =>
    setForm((f) => {
      const items = [...f.items];
      items[idx] = { ...items[idx], [key]: key === "name" ? val : Number(val) };
      return { ...f, items };
    });

  const selectFromList = (idx, name) => {
    const selected = productList.find((p) => p.name === name);
    if (!selected) {
      setItemField(idx, "name", name);
      return;
    }
    setForm((f) => {
      const items = [...f.items];
      items[idx] = { ...items[idx], name: selected.name, price: selected.price };
      return { ...f, items };
    });
  };

  const addItem = () =>
    setForm((f) => ({ ...f, items: [...f.items, { name: "", quantity: 1, price: 0 }] }));
  const removeItem = (idx) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  const resetForm = () =>
    setForm({
      name: "",
      address: "",
      apartment: "",
      phone: "",
      email: "",
      customDate: todayISO(),
      paymentMethod: "Cash",
      deliveryCharge: 0,
      items: [{ name: "", quantity: 0, price: 0 }],
    });

  // ---- PDF component (rendered from live form state) ----
  const InvoicePdf = ({ formData }) => {
    const formattedDate = new Date(formData.customDate).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const invoiceId = Math.random().toString(36).substring(2, 10).toUpperCase();

    const sub = formData.items.reduce(
      (acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.price) || 0),
      0
    );
    const ttl = sub + (Number(formData.deliveryCharge) || 0);

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.companyInfo}>
              <Image style={styles.logo} src={logo} />
              <Text style={{ fontSize: 28, color: "red" }}>Optiwatch BD</Text>
            </View>
            <View style={styles.invoiceInfo}>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <Text>Date: {formattedDate}</Text>
              <Text>Invoice ID#: {invoiceId}</Text>
              <Text>Payment: {formData.paymentMethod}</Text>
            </View>
          </View>

       <View style={styles.section}>
  <Text style={styles.billToTitle}>Bill To</Text>
  <View style={styles.billCard}>
    <View style={styles.billRow}>
      <Text style={styles.billLabel}>Name:</Text>
      <Text style={styles.billValue}>{formData.name}</Text>
    </View>
    <View style={styles.billRow}>
      <Text style={styles.billLabel}>Address:</Text>
      <Text style={styles.billValue}>{formData.address}</Text>
    </View>
    {formData.apartment ? (
      <View style={styles.billRow}>
        <Text style={styles.billValue}>{formData.apartment}</Text>
      </View>
    ) : null}
    <View style={styles.billRow}>
      <Text style={styles.billLabel}>Phone:</Text>
      <Text style={styles.billValue}>{formData.phone}</Text>
    </View>
    {formData.email ? (
      <View style={styles.billRow}>
        <Text style={styles.billLabel}>Email:</Text>
        <Text style={styles.billValue}>{formData.email}</Text>
      </View>
    ) : null}
  </View>
</View>


          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.cell}>Product</Text>
              <Text style={styles.cell}>Quantity</Text>
              <Text style={[styles.cell, styles.rightCell]}>Price</Text>
              <Text style={[styles.cell, styles.rightCell]}>Total</Text>
            </View>

            {formData.items.map((it, i) => {
              const line = (Number(it.quantity) || 0) * (Number(it.price) || 0);
              return (
                <View key={i} style={styles.tableRow}>
                  <Text style={styles.cell}>{it.name}</Text>
                  <Text style={styles.cell}>{Number(it.quantity) || 0}</Text>
                  <Text style={[styles.cell, styles.rightCell]}>
                    ৳{(Number(it.price) || 0).toFixed(2)}
                  </Text>
                  <Text style={[styles.cell, styles.rightCell]}>৳{line.toFixed(2)}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Subtotal:</Text>
            <Text style={styles.summaryText}>৳{sub.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Delivery Charge:</Text>
            <Text style={styles.summaryText}>৳{(Number(formData.deliveryCharge) || 0).toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Total Amount:</Text>
            <Text style={styles.totalText}>৳{ttl.toFixed(2)}</Text>
          </View>

          <View style={styles.notes}>
            <Text>Thanks for your order. We hope to serve you again soon.</Text>
          </View>

          <View style={{ alignItems: "center", marginTop: 30 }}>
            <Image src={QR} style={{ width: 100, height: 100 }} />
            <Text style={{ marginTop: 5, fontSize: 10 }}>
              আমাদের ওয়েবসাইট ভিজিট করুন: https://al-amin-watachandsunglassessbd.netlify.app/
            </Text>
          </View>
        </Page>
      </Document>
    );
  };

  // ---- UI ----
  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      {/* Top bar actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-red-600">Optiwatch BD — Invoice Builder</h1>

        <div className="flex items-center gap-3">
          <PDFDownloadLink
            document={<InvoicePdf formData={form} />}
            fileName={`invoice_${new Date(form.customDate).toISOString().slice(0,10)}.pdf`}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            {({ loading }) => (loading ? "Building PDF..." : "Download PDF")}
          </PDFDownloadLink>

          <button
            onClick={resetForm}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: form */}
        <div className="w-full space-y-4">
          <div className="bg-white rounded-2xl shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Customer & Order</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className="border p-2 rounded"
                placeholder="Customer Name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
              />
              <input
                className="border p-2 rounded"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
              <input
                className="border p-2 rounded sm:col-span-2"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
              />
              <input
                className="border p-2 rounded"
                placeholder="Apartment (optional)"
                value={form.apartment}
                onChange={(e) => setField("apartment", e.target.value)}
              />
              <input
                className="border p-2 rounded"
                placeholder="Email (optional)"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
              />
              <input
                type="date"
                className="border p-2 rounded"
                value={form.customDate}
                onChange={(e) => setField("customDate", e.target.value)}
              />
              <select
                className="border p-2 rounded"
                value={form.paymentMethod}
                onChange={(e) => setField("paymentMethod", e.target.value)}
              >
                <option>Cash</option>
                <option>COD</option>
                <option>Bkash</option>
                <option>Nagad</option>
              </select>
              <div className="sm:col-span-2 flex items-center gap-3">
                <label className="text-sm text-gray-600">Delivery Charge</label>
                <input
                  type="number"
                  className="border p-2 rounded w-40"
                  value={form.deliveryCharge}
                  onChange={(e) => setField("deliveryCharge", Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Items</h2>
              <button onClick={addItem} className="text-blue-600 hover:underline">
                + Add Item
              </button>
            </div>

            <datalist id="products">
              {productList.map((p, i) => (
                <option key={i} value={p.name} />
              ))}
            </datalist>

            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 border-b pb-2">
              <div className="col-span-5">Product</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Line Total</div>
              <div className="col-span-1 text-center">—</div>
            </div>

            {form.items.map((it, idx) => {
              const qty = Number(it.quantity) || 0;
              const price = Number(it.price) || 0;
              const line = qty * price;
              return (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center py-2 border-b">
                  {/* Product name: type OR pick existing (with datalist) */}
                  <input
                    className="col-span-5 border p-2 rounded"
                    list="products"
                    placeholder="Product name"
                    value={it.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      // If the picked value exists in suggestions, auto-fill price
                      if (productList.some((p) => p.name === val)) {
                        selectFromList(idx, val);
                      } else {
                        setItemField(idx, "name", val);
                      }
                    }}
                    onBlur={(e) => {
                      // On blur, try fill price if matched
                      const val = e.target.value;
                      const hit = productList.find((p) => p.name === val);
                      if (hit) selectFromList(idx, val);
                    }}
                  />

                  {/* Quantity */}
                  <input
                    type="number"
                    className="col-span-2 border p-2 rounded text-right"
                    value={it.quantity}
                    min={0}
                    onChange={(e) => setItemField(idx, "quantity", e.target.value)}
                  />

                  {/* Price (editable custom price) */}
                  <input
                    type="number"
                    className="col-span-2 border p-2 rounded text-right"
                    value={it.price}
                    min={0}
                    onChange={(e) => setItemField(idx, "price", e.target.value)}
                  />

                  {/* Line total */}
                  <div className="col-span-2 text-right font-medium">{currency(line)}</div>

                  {/* Remove */}
                  <div className="col-span-1 text-center">
                    {form.items.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: live preview / totals */}
        <div className="w-full space-y-4">
          <div className="bg-white rounded-2xl shadow p-4">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h3 className="text-xl font-bold text-red-600">Optiwatch BD</h3>
                <p className="text-xs text-gray-600">Invoice Preview</p>
              </div>
              <div className="text-right text-xs">
                <p>Date: {new Date(form.customDate).toLocaleDateString("bn-BD")}</p>
                <p>Payment: {form.paymentMethod}</p>
              </div>
            </div>

            <div className="mt-3 text-sm">
              <h4 className="font-semibold">Bill To:</h4>
              <p>{form.name || "—"}</p>
              <p>{form.address || "—"}</p>
              <p>{form.apartment || ""}</p>
              <p>Phone: {form.phone || "—"}</p>
              <p>{form.email || ""}</p>
            </div>

            <table className="w-full text-left border mt-4 text-xs">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-1">Product</th>
                  <th className="p-1 text-right">Qty</th>
                  <th className="p-1 text-right">Price</th>
                  <th className="p-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {form.items.map((it, i) => {
                  const qty = Number(it.quantity) || 0;
                  const price = Number(it.price) || 0;
                  return (
                    <tr key={i} className="border-b">
                      <td className="p-1">{it.name || "—"}</td>
                      <td className="p-1 text-right">{qty}</td>
                      <td className="p-1 text-right">{currency(price)}</td>
                      <td className="p-1 text-right">{currency(qty * price)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="text-right mt-3 space-y-1 text-sm">
              <p>Subtotal: <span className="font-medium">{currency(subtotal)}</span></p>
              <p>Delivery Charge: <span className="font-medium">{currency(Number(form.deliveryCharge) || 0)}</span></p>
              <p className="font-semibold text-base">Total: {currency(total)}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-4">
            <p className="text-xs text-gray-600">
              💡 টিপ: পণ্যের নাম নিজে টাইপ করতে পারেন বা তালিকা থেকে বেছে নিতে পারেন। মূল্য (Price) ঘরে কাস্টম মূল্য লিখলেই সেটি ধরা হবে।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceComponent;
