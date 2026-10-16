import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function DailySales() {
  const [stocks, setStocks] = useState([]);
  const [sales, setSales] = useState([]);
  const [stockId, setStockId] = useState("");
  const [quantitySold, setQuantitySold] = useState("");
  const [error, setError] = useState("");

  // Fetch stocks (for dropdown)
  const fetchStocks = () => {
    fetch("https://inventory-and-sales-management-system-j9i6.onrender.com/stocks")
      .then(res => res.json())
      .then(data => setStocks(data));
  };

  // Fetch today's sales
  const fetchDailySales = () => {
    fetch("https://inventory-and-sales-management-system-j9i6.onrender.com/daily-sales")
      .then(res => res.json())
      .then(data => setSales(data));
  };

  useEffect(() => {
    fetchStocks();
    fetchDailySales();
  }, []);

  // Add Sale
  const handleAddSale = (e) => {
    e.preventDefault();

    if (!stockId || quantitySold <= 0) {
      setError("Select product and valid quantity");
      return;
    }

    setError("");

    fetch("https://inventory-and-sales-management-system-j9i6.onrender.com/add-sale", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      stock_id: stockId,
      quantity_sold: Number(quantitySold)
    })
  })
  .then(async (res) => {
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Sale failed");
    }

    return data;
  })
  .then(() => {
    setQuantitySold("");
    setError("");
    fetchStocks();
    fetchDailySales();
  })
  .catch(err => {
    setError(err.message);
  });
    
    };

    const dailySalesChart = {
    labels: sales.map(s => s.product),
    datasets: [
        {
        label: "Quantity Sold",
        data: sales.map(s => s.quantity),
        backgroundColor: "#4caf50",
        borderRadius: 6
        }
        ]
    };

    const dailySalesOptions = {
    responsive: true,
    plugins: {
        legend: { display: false }
    },
    scales: {
        y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
        }
    }
    };

    const downloadDailySalesPDF = () => {
    window.open(
      "https://inventory-and-sales-management-system-j9i6.onrender.com/download-daily-sales-pdf",
      "_blank"
    );
    };

    const downloadDailySalesExcel= () => {  
    window.open(
      "https://inventory-and-sales-management-system-j9i6.onrender.com/daily-sales-excel", 
      "_blank"
    );
    };


    return (
    <div className="app-container">
      <h2>Daily Sales</h2>

      {/* ===== ADD SALE ===== */}
      <form onSubmit={handleAddSale} style={{ marginBottom: "20px" }}>
        <select
          value={stockId}
          onChange={(e) => setStockId(e.target.value)}
        >
          <option value="">Select Product</option>
          {stocks.map(s => (
            <option key={s.id} value={s.id}>
              {s.product_name} (Stock: {s.quantity})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity Sold"
          value={quantitySold}
          onChange={(e) => setQuantitySold(e.target.value)}
        />

        <button className="action-btn" type="submit">Add Sale</button>
      </form>

      {error && <p className="error">{error}</p>}

      {/* ===== TODAY SALES ===== */}
      <h3>Today's Sales</h3>

      {sales.length === 0 ? (
        <p>No sales today</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity Sold</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s, i) => (
              <tr key={i}>
                <td>{s.product}</td>
                <td>{s.quantity}</td>
                <td>₹ {s.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
        <h3 style={{ marginTop: "30px" }}>Today Sales Chart</h3>
        {sales.length === 0 ? (
        <p>No sales data to show chart</p>
        ) : (
        <div className="card">
            <Bar data={dailySalesChart} options={dailySalesOptions} />
        </div>
        )}
        <button className="action-btn" onClick={downloadDailySalesPDF} style={{ marginBottom: "15px" }}>Download Today Sales PDF
        </button>
        <button className="action-btn" onClick={downloadDailySalesExcel} style={{ marginTop: "20px" }}>Download Today Sales Excel
        </button>
    </div>
  );
}

export default DailySales;
