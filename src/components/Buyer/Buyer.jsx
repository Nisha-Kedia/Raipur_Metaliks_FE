import { useState, useEffect } from "react";
import { Plus, RefreshCcw, CheckCircle, XCircle } from "lucide-react";
import './Buyer.css'

export default function Buyer() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    quantity: "",
    price: "",
    product: "",
    status: "Pending"
  });
  const [formSuccess, setFormSuccess] = useState(false);

  // Fetch all buyers - API endpoint matches controller's GetMapping
  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://raipurmetaliksbackend-production.up.railway.app/api/getbuyers");
      if (!response.ok) {
        throw new Error("Failed to fetch buyers");
      }
      const data = await response.json();
      setBuyers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Format the data properly for API to match Buyerdto structure
    const submissionData = {
      ...formData,
      phoneNo: formData.phoneNo ? parseInt(formData.phoneNo, 10) : null,
      quantity: formData.quantity ? parseInt(formData.quantity, 10) : null,
      price: formData.price ? parseFloat(formData.price) : null,
    };

    try {
      // API endpoint matches controller's PostMapping
      const response = await fetch("http://raipurmetaliksbackend-production.up.railway.app/api/Buyerform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit buyer data");
      }

      // Show success message
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 3000);
      
      // Reset form and refresh data
      setFormData({
        name: "",
        phoneNo: "",
        quantity: "",
        price: "",
        product: "",
        status: "Pending"
      });
      fetchBuyers();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Get status badge styles
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "badge badge-success";
      case "pending":
        return "badge badge-warning";
      case "cancelled":
        return "badge badge-error";
      default:
        return "badge badge-neutral";
    }
  };

  return (
    <div className="buyer-container">
      <div className="buyer-header">
        <h1 className="buyer-title">Raipur Metaliks Buyers</h1>
        <div className="buyer-actions">
          <button
            onClick={() => fetchBuyers()}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCcw size={16} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            <span>Add Buyer</span>
          </button>
        </div>
      </div>

      {/* Success message */}
      {formSuccess && (
        <div className="alert alert-success">
          <CheckCircle size={20} className="alert-icon" />
          <span>Buyer added successfully!</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="alert alert-error">
          <XCircle size={20} className="alert-icon" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Buyer Form */}
      {showForm && (
        <div className="buyer-form">
          <h2 className="form-title">Add New Buyer</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="number"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Product</label>
              <input
                type="text"
                name="product"
                value={formData.product}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price</label>
              <input
                type="number"
                name="price"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Buyers Table */}
      <div className="buyer-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading buyers...</p>
          </div>
        ) : buyers.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">No buyers found. Add a new buyer to get started.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="buyer-table">
              <thead className="table-header">
                <tr>
                  <th className="table-cell">ID</th>
                  <th className="table-cell">Name</th>
                  <th className="table-cell">Phone</th>
                  <th className="table-cell">Product</th>
                  <th className="table-cell">Quantity</th>
                  <th className="table-cell">Price</th>
                  <th className="table-cell">Status</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {buyers.map((buyer) => (
                  <tr key={buyer.id} className="table-row">
                    <td className="table-cell">{buyer.id}</td>
                    <td className="table-cell table-cell-name">{buyer.name}</td>
                    <td className="table-cell">{buyer.phoneNo}</td>
                    <td className="table-cell">{buyer.product}</td>
                    <td className="table-cell">{buyer.quantity}</td>
                    <td className="table-cell">
                    ₹ {buyer.price}   
                    </td>
                    <td className="table-cell">
                      <span className={getStatusBadge(buyer.status)}>
                        {buyer.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}