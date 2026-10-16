import { useEffect, useState } from "react";
import "../App.css";

function Stocks() {
  const [errorMsg, setErrorMsg] = useState("");
  const [stocks, setStocks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  const fetchStocks = () => {
    fetch("https://inventory-and-sales-management-system-j9i6.onrender.com/stocks")
      .then((res) => res.json())
      .then((data) => setStocks(data));
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // SUMMARY
  const totalProducts = stocks.length;
  const totalQuantity = stocks.reduce(
    (sum, stock) => sum + Number(stock.quantity),
    0
  );
  const overallProfit = stocks.reduce(
    (sum, stock) => sum + Number(stock.total_profit || 0),
    0
  );

  // ROW HIGHLIGHT
  const getRowStyle = (stock) => {
    if (editingId === stock.id) return "";
    if (stock.profit_per_unit < 0) return "row-loss";
    if (stock.profit_per_unit < 5) return "row-low";
    return "";
  };

  // DOWNLOADS
  const downloadExcel = () => {
    window.open("https://inventory-and-sales-management-system-j9i6.onrender.com/download-excel", "_blank");
  };

  const downloadPDF = () => {
    window.open("https://inventory-and-sales-management-system-j9i6.onrender.com/download-pdf", "_blank");
  };

  // ADD
  const handleAddStock = (e) => {
    e.preventDefault();

    const qty = Number(quantity);
    const cost = Number(costPrice);
    const sell = Number(sellingPrice);

    if (
      !productName ||
      isNaN(qty) || qty <= 0 ||
      isNaN(cost) || cost <= 0 ||
      isNaN(sell) || sell <= 0
    ) {
      setErrorMsg("Enter valid positive numbers only");
      return;
    }

    setErrorMsg("");

    fetch("https://inventory-and-sales-management-system-j9i6.onrender.com/add-stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_name: productName,
        quantity: qty,
        cost_price: cost,
        selling_price: sell,
      }),
    }).then(() => {
      setProductName("");
      setQuantity("");
      setCostPrice("");
      setSellingPrice("");
      fetchStocks();
    });
  };

  // DELETE
  const handleDeleteStock = async (id) => {
  const res = await fetch(`https://inventory-and-sales-management-system-j9i6.onrender.com/delete-stock/${id}`, {
    method: "DELETE"
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error); // 👈 USER UNDERSTANDS
    return;
  }

  fetchStocks();
  };


  // EDIT
  const startEdit = (stock) => {
    setEditingId(stock.id);
    setEditData({ ...stock });
    setErrorMsg("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setErrorMsg("");
  };

  const saveEdit = (id) => {
    const qty = Number(editData.quantity);
    const cost = Number(editData.cost_price);
    const sell = Number(editData.selling_price);

    if (
      !editData.product_name ||
      isNaN(qty) || qty <= 0 ||
      isNaN(cost) || cost <= 0 ||
      isNaN(sell) || sell <= 0
    ) {
      setErrorMsg("Enter valid positive numbers only");
      return;
    }

    setErrorMsg("");

    fetch(`https://inventory-and-sales-management-system-j9i6.onrender.com/update-stock/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_name: editData.product_name,
        quantity: qty,
        cost_price: cost,
        selling_price: sell,
      }),
    }).then(() => {
      setEditingId(null);
      setEditData({});
      fetchStocks();
    });
  };

  return (
    <div className="app-container">
      <h2>StockThozhan</h2>

      {/* SUMMARY */}
      <div className="summary">
        <h3>Summary</h3>
        <p>Total Products: {totalProducts}</p>
        <p>Total Quantity: {totalQuantity}</p>
        <p>
          Overall Profit: <strong>₹ {overallProfit}</strong>
        </p>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button className="action-btn" onClick={downloadExcel}>Download Excel</button>
          <button className="action-btn" onClick={downloadPDF}>Download PDF</button>
        </div>
      </div>

      <h3>Add Stock</h3>
      <form onSubmit={handleAddStock}>
        <input placeholder="Product name" value={productName} onChange={(e) => setProductName(e.target.value)} />
        <input placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <input placeholder="Cost price" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} />
        <input placeholder="Selling price" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
        <button className="action-btn" type="submit">Add Stock</button>
      </form>

      {errorMsg && <p className="error">{errorMsg}</p>}

      <hr />

      <h3>Stock List</h3>

      {stocks.length === 0 ? (
        <p>No stocks available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Cost</th>
              <th>Selling</th>
              <th>Profit / Unit</th>
              <th>Total Profit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr key={stock.id} className={getRowStyle(stock)}>
                <td>{index + 1}</td>

                {editingId === stock.id ? (
                  <>
                    <td><input value={editData.product_name} onChange={(e) => setEditData({ ...editData, product_name: e.target.value })} /></td>
                    <td><input value={editData.quantity} onChange={(e) => setEditData({ ...editData, quantity: e.target.value })} /></td>
                    <td><input value={editData.cost_price} onChange={(e) => setEditData({ ...editData, cost_price: e.target.value })} /></td>
                    <td><input value={editData.selling_price} onChange={(e) => setEditData({ ...editData, selling_price: e.target.value })} /></td>
                    <td>-</td>
                    <td>-</td>
                    <td>
                      <button className="action-btn" onClick={() => saveEdit(stock.id)}>Save</button>
                      <button className="action-btn" onClick={cancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{stock.product_name}</td>
                    <td>{stock.quantity}</td>
                    <td>{stock.cost_price}</td>
                    <td>{stock.selling_price}</td>
                    <td>{stock.profit_per_unit}</td>
                    <td>{stock.total_profit}</td>
                    <td>
                      <button className="action-btn" onClick={() => startEdit(stock)}>Edit</button>
                      <button className="action-btn delete" onClick={() => handleDeleteStock(stock.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Stocks;
