import { useEffect, useState } from "react";
import "../App.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,           
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2"; 
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,            
  Tooltip,
  Legend
);

function Dashboard() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/stocks")
      .then(res => res.json())
      .then(data => setStocks(data));
  }, []);

  const totalProducts = stocks.length;

  const totalQuantity = stocks.reduce(
    (sum, s) => sum + Number(s.quantity),
    0
  );

  const overallProfit = stocks.reduce(
    (sum, s) => sum + Number(s.total_profit || 0),
    0
  );

  const lossProducts = stocks.filter(
    s => s.profit_per_unit < 0
  );

  const topProducts = [...stocks]
    .sort((a, b) => b.total_profit - a.total_profit)
    .slice(0, 5);

  /* ===== BAR CHART DATA ===== */

  const profitLossChart = {
    labels: stocks.map(s => s.product_name),
    datasets: [
      {
        label: "Total Profit",
        data: stocks.map(s => s.total_profit),
        backgroundColor: stocks.map(s =>
          s.total_profit < 0 ? "#ff4d4d" : "#4caf50"
        ),
        borderRadius: 6
      }
    ]
  };

  const profitLossOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  };

  const topProductsChart = {
    labels: topProducts.map(p => p.product_name),
    datasets: [
      {
        label: "Profit",
        data: topProducts.map(p => p.total_profit),
        backgroundColor: "#4caf50",
        borderRadius: 6
      }
    ]
  };

  const topProductsOptions = {
    indexAxis: "y",
    plugins: { legend: { display: false } }
  };

  /* ===== DONUT CHART DATA (NEW, SIMPLE) ===== */

  const profitDistributionChart = {
    labels: ["Profit Products", "Loss Products"],
    datasets: [
      {
        data: [
          stocks.filter(s => s.total_profit >= 0).length,
          stocks.filter(s => s.total_profit < 0).length
        ],
        backgroundColor: ["#4caf50", "#ff4d4d"],
        borderWidth: 0
      }
    ]
  };


  return (
    <div className="app-container">
      <h2>Dashboard</h2>
      
      {/* ===== KPI CARDS ===== */}
      <div className="dashboard-grid">
        <div className="card">
          <h4>Total Products</h4>
          <p>{totalProducts}</p>
        </div>

        <div className="card">
          <h4>Total Quantity</h4>
          <p>{totalQuantity}</p>
        </div>

        <div className="card">
          <h4>Potential Profit</h4>
          <p>₹ {overallProfit}</p>
        </div>

        <div className="card danger">
          <h4>Loss Products</h4>
          <p>{lossProducts.length}</p>
        </div>
      </div>

      {/* ===== CHART CARDS ===== */}
      <div className="dashboard-grid" style={{ marginTop: "30px" }}>
        <div className="card">
          <h4>Profit vs Loss</h4>
          {stocks.length === 0 ? (
            <p>No data available</p>
          ) : (
            <Bar data={profitLossChart} options={profitLossOptions} />
          )}
        </div>

        <div className="card">
          <h4>Top Profitable Products</h4>
          {topProducts.length === 0 ? (
            <p>No data available</p>
          ) : (
            <Bar data={topProductsChart} options={topProductsOptions} />
          )}
        </div>

        {/* ✅ NEW DONUT CARD */}
        <div className="card">
          <h4>Profit Distribution</h4>
          {stocks.length === 0 ? (
            <p>No data available</p>
          ) : (
            <Doughnut data={profitDistributionChart} />
          )}
        </div>
      </div>

      {/* ===== SMART SUGGESTIONS ===== */}
      <div className="section">
        <h3>Smart Suggestions</h3>
        {lossProducts.length === 0 ? (
          <p>✅ No loss-making products. Good job!</p>
        ) : (
          lossProducts.map(p => (
            <p key={p.id} className="warning">
              ⚠️ {p.product_name} is running at loss. Consider revising price.
            </p>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
