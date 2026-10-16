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

function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const fetchSales = () => {
    let url = "https://inventory-and-sales-management-system-j9i6.onrender.com/sales-history";

    if (start && end) {
      url += `?start=${start}&end=${end}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => setSales(data));
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const downloadExcel = () => {
    window.open(
      `https://inventory-and-sales-management-system-j9i6.onrender.com/sales-history/excel?start=${start}&end=${end}`
    );
  };

  const downloadPDF = () => {
    window.open(
      `https://inventory-and-sales-management-system-j9i6.onrender.com/sales-history/pdf?start=${start}&end=${end}`
    );
  };

  // ===== GROUP SALES BY DATE =====
  const salesByDate = {};

  sales.forEach(s => {
    salesByDate[s.date] =
      (salesByDate[s.date] || 0) + Number(s.amount);
  });

  const chartLabels = Object.keys(salesByDate);
  const chartValues = Object.values(salesByDate);

  const salesTrendChart = {
    labels: chartLabels,
    datasets: [
      {
        label: "Daily Sales Amount",
        data: chartValues,
        backgroundColor: "#4caf50",
        borderRadius: 6
      }
    ]
  };

  const salesTrendOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };


  return (
    <div className="app-container">
      <h2>Sales History</h2>

      {/* FILTERS */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />

        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <button className="action-btn" onClick={fetchSales} style={{ marginLeft: "10px" }}>
          Filter
        </button>
      </div>

      {/* EXPORT BUTTONS */}
      <div style={{ marginBottom: "20px" }}>
        <button className="action-btn" onClick={downloadExcel}>Download Excel</button>
        <button className="action-btn" onClick={downloadPDF} style={{ marginLeft: "10px" }}>
          Download PDF
        </button>
      </div>

      {/* TABLE */}
      {sales.length === 0 ? (
        <p>No sales found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s, i) => (
              <tr key={i}>
                <td>{s.date}</td>
                <td>{s.product}</td>
                <td>{s.quantity}</td>
                <td>₹ {s.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h3 style={{ marginTop: "30px" }}>Sales Trend</h3>
      {chartLabels.length === 0 ? (
        <p>No data to display chart</p>
      ) : (
        <div className="card">
          <Bar data={salesTrendChart} options={salesTrendOptions} />
        </div>
      )}
    </div>
  );
}

export default SalesHistory;
