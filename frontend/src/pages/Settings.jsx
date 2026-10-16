import "../App.css";
function Settings() {

  const handleReset = async () => {
  const confirmReset = window.confirm(
    "⚠️ This will permanently delete ALL stocks and sales.\n\nAre you sure?"
  );

  if (!confirmReset) return;

  try {
    const res = await fetch("https://inventory-and-sales-management-system-j9i6.onrender.com/reset-all", {
      method: "DELETE"
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Reset failed");
      return;
    }

    alert("✅ All data reset successfully");
    window.location.reload(); // refresh UI

  } catch (err) {
    alert("Server error. Try again.");
  }
  };

  return (
  <button className="action-btn delete" onClick={() => handleReset()}>Reset All Data</button>);
}
export default Settings;
