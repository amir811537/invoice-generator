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
import { useState } from "react";
import logo from "../../assets/logo-fresh.png";
import QR from "../../assets/frame.png";

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
  companyInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: { width: 32, height: 32, marginRight: 8 },
  invoiceInfo: { textAlign: "right" },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  section: {
    borderBottom: "2px solid #ccc",
    paddingBottom: 10,
    marginBottom: 20,
  },
  billToTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  billToText: {
    color: "#4a4a4a",
    marginBottom: 2,
  },
  table: { width: "100%", marginBottom: 20 },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    backgroundColor: "#f3f3f3",
    padding: 6,
  },
  tableRow: {
    flexDirection: "row",
    padding: 6,
    borderBottom: "1px solid #eee",
  },
  cell: { flex: 1, textAlign: "left" },
  rightCell: { textAlign: "right" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 6,
  },
  summaryText: { marginRight: 10, color: "#4a4a4a" },
  totalText: { fontWeight: "bold", fontSize: 16 },
  notes: {
    borderTop: "2px solid #ccc",
    paddingTop: 10,
    marginTop: 20,
    color: "#4a4a4a",
    fontSize: 11,
  },
});

const productList = [
  { name: "চামড়া সহ", price: 280 },
  { name: "চামড়া ছাড়া", price: 300 },
  { name: "বেস্ট বনলেস", price: 410 },
  { name: "লেগ বনলেস", price: 380 },
  { name: "ফুল লেগ (চামড়া সহ)", price: 280 },
  { name: "ফুল লেগ (চামড়া ছাড়া)", price: 299 },
  { name: "থাই", price: 325 },
  { name: "উইংস", price: 240 },
  { name: "কিমা", price: 420 },
  { name: "গিলা-কলিজা", price: 310 },
  { name: "মুরগীর পা – ৫ কেজি", price: 190 },
  { name: "মুরগির মাথা – ৫ কেজি", price: 500 },
  { name: "মুরগির হাড় – ৫ কেজি", price: 500 },
  { name: "চামড়া (বয়লার)", price: 100 },
  { name: "ডামিস্টিক মুরগি (চামড়া সহ)", price: 299 },
  { name: "ডামিস্টিক মুরগি (চামড়া ছাড়া)", price: 325 },
  { name: "সোনালী মুরগি", price: 300 },
  { name: "লায়ার মুরগি (লাল/সাদা খাসি)", price: 449 },
  { name: "লায়ার মুরগি (চামড়া)", price: 300 },
];

const InvoiceComponent = () => {
 const [form, setForm] = useState({
    name: "",
    address: "",
    apartment: "",
    phone: "",
    email: "",
    customDate: new Date().toISOString().split("T")[0],
    paymentMethod: "Cash",
    items: [{ name: "", quantity: 1, price: 0 }],
  });
  const [data, setData] = useState(null);
  const deliveryCharge = 60;

  const handleChange = (index, field, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = field === "name" ? value : Number(value);
    setForm({ ...form, items: updatedItems });
  };

  const handleProductSelect = (index, selectedName) => {
    const selected = productList.find((p) => p.name === selectedName);
    if (selected) {
      const updatedItems = [...form.items];
      updatedItems[index].name = selected.name;
      updatedItems[index].price = selected.price;
      setForm({ ...form, items: updatedItems });
    }
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { name: "", quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updatedItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subtotal = form.items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    const totalAmount = subtotal + deliveryCharge;
    const invoiceData = {
      _id: Math.random().toString(36).substring(2, 10).toUpperCase(),
      orderDate: new Date(form.customDate),
      paymentMethod: form.paymentMethod,
      customer: {
        name: form.name,
        address: form.address,
        apartment: form.apartment,
        phone: form.phone,
        email: form.email,
      },
      items: form.items,
      totalAmount,
    };
    setData(invoiceData);
  };

  const InvoicePdf = ({ data }) => {
    const { _id, orderDate, customer, items, totalAmount, paymentMethod } = data;
    const formattedDate = new Date(orderDate).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.companyInfo}>
              <Image style={styles.logo} src={logo} />
              <Text style={{ fontSize: 20, color: "red" }}>
                Fresh Cut Chicken Service
              </Text>
            </View>
            <View style={styles.invoiceInfo}>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <Text>Date: {formattedDate}</Text>
              <Text>Invoice ID#: {_id}</Text>
              <Text>Payment: {paymentMethod}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.billToTitle}>Bill To:</Text>
            <Text style={styles.billToText}>{customer.name}</Text>
            <Text style={styles.billToText}>{customer.address}</Text>
            <Text style={styles.billToText}>{customer.apartment}</Text>
            <Text style={styles.billToText}>Phone: {customer.phone}</Text>
            <Text style={styles.billToText}>{customer.email}</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.cell}>Product</Text>
              <Text style={styles.cell}>Quantity</Text>
              <Text style={[styles.cell, styles.rightCell]}>Price</Text>
              <Text style={[styles.cell, styles.rightCell]}>Total</Text>
            </View>
            {items.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.quantity}kg</Text>
                <Text style={[styles.cell, styles.rightCell]}>৳{item.price.toFixed(2)}</Text>
                <Text style={[styles.cell, styles.rightCell]}>
                  ৳{(item.quantity * item.price).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Delivery Charge:</Text>
            <Text style={styles.summaryText}>৳{deliveryCharge.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Total Amount:</Text>
            <Text style={styles.totalText}>৳{totalAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.notes}>
            <Text>Thanks for your order. We hope to serve you again soon.</Text>
          </View>

          <View style={{ alignItems: "center", marginTop: 30 }}>
            <Image src={QR} style={{ width: 100, height: 100 }} />
            <Text style={{ marginTop: 5, fontSize: 10 }}>
              আমাদের ওয়েবসাইট ভিজিট করুন:
              https://freshcutchikenclinetside.vercel.app
            </Text>
          </View>
        </Page>
      </Document>
    );
  };

  const InvoicePreview = ({ data }) => {
    const { name, address, apartment, phone, email, paymentMethod, items } = data;
    const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const total = subtotal + deliveryCharge;

    return (
      <div className="text-sm space-y-4 font-[NotoSerifBengali]">
        <div className="flex justify-between items-center border-b pb-2">
          <div>
            <h1 className="text-xl font-bold text-red-600">
              Fresh Cut Chicken Service
            </h1>
            <p className="text-xs text-gray-600">Invoice Preview</p>
          </div>
          <div className="text-right text-xs">
            <p>Date: {new Date().toLocaleDateString("bn-BD")}</p>
            <p>Payment: {paymentMethod}</p>
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Bill To:</h2>
          <p>{name}</p>
          <p>{address}</p>
          <p>{apartment}</p>
          <p>Phone: {phone}</p>
          <p>{email}</p>
        </div>

        <table className="w-full text-left border mt-4 text-xs">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-1">Product</th>
              <th className="p-1">Qty (kg)</th>
              <th className="p-1 text-right">Price</th>
              <th className="p-1 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="p-1">{item.name}</td>
                <td className="p-1">{item.quantity} kg</td>
                <td className="p-1 text-right">৳{item.price.toFixed(2)}</td>
                <td className="p-1 text-right">
                  ৳{(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-2 text-sm">
          <p>Delivery Charge: ৳{deliveryCharge.toFixed(2)}</p>
          <p className="font-semibold">Total: ৳{total.toFixed(2)}</p>
        </div>
      </div>
    );
  };
return (
  <div className="flex flex-col md:flex-row gap-10 p-6 max-w-7xl mx-auto">
    <div className="w-full md:w-1/2 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input className="border p-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="border p-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="border p-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input className="border p-2" placeholder="Apartment" value={form.apartment} onChange={(e) => setForm({ ...form, apartment: e.target.value })} />
          <input className="border p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="date" className="border p-2" value={form.customDate} onChange={(e) => setForm({ ...form, customDate: e.target.value })} />
          <select className="border p-2 col-span-2" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
            <option>Cash</option>
            <option>COD</option>
            <option>Bkash</option>
            <option>Nagad</option>
          </select>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Product Items</h3>
          {form.items.map((item, index) => (
            <div key={index} className="grid grid-cols-5 gap-2 items-center mb-2">
              <select className="border p-1 col-span-2" value={item.name} onChange={(e) => handleProductSelect(index, e.target.value)}>
                <option value="">-- পণ্য নির্বাচন করুন --</option>
                {productList.map((p, i) => (
                  <option key={i} value={p.name}>{p.name} – ৳{p.price}</option>
                ))}
              </select>
              <input className="border p-1" type="number" placeholder="Qty" value={item.quantity} onChange={(e) => handleChange(index, "quantity", e.target.value)} />
              <input className="border p-1" type="number" value={item.price} readOnly />
              {form.items.length > 1 && (
                <button type="button" onClick={() => removeItem(index)} className="text-red-600">❌</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addItem} className="text-blue-600 mt-2">+ Add Item</button>
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Generate Invoice</button>
      </form>

      {data && (
        <PDFDownloadLink
          document={<InvoicePdf data={data} />}
          fileName={`invoice_${data._id}.pdf`}
          className="text-blue-600 underline mt-4 block"
        >
          {({ loading }) => (loading ? "Generating PDF..." : "Download Invoice")}
        </PDFDownloadLink>
      )}
    </div>

    <div className="w-full md:w-1/2 border p-4 rounded shadow bg-white">
      <InvoicePreview data={form} />
    </div>
  </div>
);
}
export default InvoiceComponent;
