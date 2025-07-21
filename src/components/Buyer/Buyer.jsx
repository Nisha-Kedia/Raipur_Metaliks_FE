import { useState, useEffect, useMemo } from "react";
import { Plus, RefreshCcw, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Buyer.css'

export default function Buyer() {
  const [buyers, setBuyers] = useState([]);
  const [metalVsDayData, setMetalVsDayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metalDataLoading, setMetalDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("Steel Rods");
  const [formData, setFormData] = useState({
    name: "",
    phoneNo: "",
    quantity: "",
    price: "",
    product: "",
    status: "Pending"
  });
  const [formSuccess, setFormSuccess] = useState(false);

  // Available products
  const products = [
    "Steel Rods", "Iron Sheets", "Aluminum Pipes", "Copper Wires", 
    "Brass Fittings", "Stainless Steel", "Galvanized Steel", "Carbon Steel"
  ];

  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8393/api/getbuyers");
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

  const fetchMetalVsDayData = async () => {
    setMetalDataLoading(true);
    try {
      const response = await fetch("http://raipurmetaliksbe-production.up.railway.app:8080/api/getmetalvsday");
      if (!response.ok) {
        throw new Error("Failed to fetch metal vs day data");
      }
      const data = await response.json();
      setMetalVsDayData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setMetalDataLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
    fetchMetalVsDayData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    const submissionData = {
      ...formData,
      phoneNo: formData.phoneNo ? parseInt(formData.phoneNo, 10) : null,
      quantity: formData.quantity ? parseInt(formData.quantity, 10) : null,
      price: formData.price ? parseFloat(formData.price) : null,
    };

    try {
      const response = await fetch("http://raipurmetaliksbe-production.up.railway.app:8080/api/Buyerform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit buyer data");
      }

      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 3000);
      
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

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

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

  // Process API data for the selected product
  const getProcessedPriceData = (product) => {
    if (!metalVsDayData || metalVsDayData.length === 0) {
      return [];
    }

    // Filter data for the selected metal type
    const filteredData = metalVsDayData.filter(item => 
      item.metalType === product
    );

    // Convert to the format expected by Highcharts
    const processedData = filteredData.map(item => {
      // Parse the date string to timestamp
      const date = new Date(item.date);
      return [date.getTime(), item.price];
    });

    // Sort by date
    return processedData.sort((a, b) => a[0] - b[0]);
  };

  // Get available metal types from API data for the dropdown
  const availableMetalTypes = useMemo(() => {
    if (!metalVsDayData || metalVsDayData.length === 0) {
      return products; // Fallback to default products
    }
    
    const uniqueTypes = [...new Set(metalVsDayData.map(item => item.metalType))];
    return uniqueTypes.length > 0 ? uniqueTypes : products;
  }, [metalVsDayData]);

  // Update selectedProduct if it's not available in API data
  useEffect(() => {
    if (availableMetalTypes.length > 0 && !availableMetalTypes.includes(selectedProduct)) {
      setSelectedProduct(availableMetalTypes[0]);
    }
  }, [availableMetalTypes, selectedProduct]);

  // Price vs Date Chart Configuration
  const priceChartOptions = useMemo(() => {
    const priceData = getProcessedPriceData(selectedProduct);
    
    return {
      chart: {
        type: 'line',
        height: 400,
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        marginTop: 60
      },
      title: {
        text: `${selectedProduct} - Price Trend`,
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#2c3e50'
        }
      },
      subtitle: {
        text: 'Price trends over time',
        style: {
          color: '#7f8c8d'
        }
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date',
          style: {
            color: '#2c3e50',
            fontWeight: 'bold'
          }
        },
        labels: {
          style: {
            color: '#2c3e50'
          }
        },
        gridLineColor: '#e9ecef',
        lineColor: '#dee2e6'
      },
      yAxis: {
        title: {
          text: 'Price (₹)',
          style: {
            color: '#2c3e50',
            fontWeight: 'bold'
          }
        },
        labels: {
          style: {
            color: '#2c3e50'
          },
          formatter: function() {
            return '₹' + (this.value >= 1000 ? (this.value / 1000).toFixed(0) + 'k' : this.value);
          }
        },
        gridLineColor: '#e9ecef'
      },
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#dee2e6',
        borderRadius: 8,
        shadow: true,
        formatter: function() {
          return `<b>${selectedProduct}</b><br/>
                  Date: ${Highcharts.dateFormat('%e %b %Y', this.x)}<br/>
                  Price: ₹${this.y.toLocaleString()}`;
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: false
          },
          enableMouseTracking: true,
          marker: {
            fillColor: '#3498db',
            lineColor: '#2980b9',
            lineWidth: 2,
            radius: 4,
            states: {
              hover: {
                fillColor: '#e74c3c',
                lineColor: '#c0392b',
                radius: 6
              }
            }
          }
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        name: selectedProduct,
        data: priceData,
        color: '#3498db',
        lineWidth: 3,
        states: {
          hover: {
            lineWidth: 4
          }
        }
      }],
      credits: {
        enabled: false
      }
    };
  }, [selectedProduct, metalVsDayData]);

  // Buyer Quantity Chart Configuration
  const quantityChartOptions = useMemo(() => {
    const categories = buyers.map(buyer => buyer.name);
    const quantityData = buyers.map(buyer => buyer.quantity);

    return {
      chart: {
        type: 'line',
        height: 400,
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        marginTop: 60
      },
      title: {
        text: 'Order Quantity by Buyer',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#2c3e50'
        }
      },
      subtitle: {
        text: 'Quantity trends across buyers',
        style: {
          color: '#7f8c8d'
        }
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Buyer',
          style: {
            color: '#2c3e50',
            fontWeight: 'bold'
          }
        },
        labels: {
          style: {
            fontSize: '11px',
            color: '#2c3e50'
          },
          rotation: -45
        },
        gridLineColor: '#e9ecef',
        lineColor: '#dee2e6'
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Quantity (units)',
          style: {
            color: '#2c3e50',
            fontWeight: 'bold'
          }
        },
        labels: {
          style: {
            color: '#2c3e50'
          }
        },
        gridLineColor: '#e9ecef'
      },
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#dee2e6',
        borderRadius: 8,
        shadow: true,
        formatter: function() {
          return `<b>${this.point.category}</b><br/>
                  Quantity: <b>${this.y}</b> units`;
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true,
            style: {
              color: '#2c3e50',
              fontWeight: 'bold'
            }
          },
          enableMouseTracking: true,
          marker: {
            fillColor: '#2a9d8f',
            lineColor: '#229B8D',
            lineWidth: 2,
            radius: 6,
            states: {
              hover: {
                fillColor: '#e74c3c',
                lineColor: '#c0392b',
                radius: 8
              }
            }
          }
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'Quantity',
        data: quantityData,
        color: '#2a9d8f',
        lineWidth: 3,
        states: {
          hover: {
            lineWidth: 4
          }
        }
      }],
      credits: {
        enabled: false
      }
    };
  }, [buyers]);

  const handleRefresh = () => {
    fetchBuyers();
    fetchMetalVsDayData();
  };

  return (
    <div className="buyer-container">
      <div className="buyer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={handleBackToDashboard}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="buyer-title">Raipur Metaliks Buyers</h1>
        </div>
        <div className="buyer-actions">
          <button
            onClick={handleRefresh}
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

      {formSuccess && (
        <div className="alert alert-success">
          <CheckCircle size={20} className="alert-icon" />
          <span>Buyer added successfully!</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <XCircle size={20} className="alert-icon" />
          <span>{error}</span>
        </div>
      )}

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
              <select
                name="product"
                value={formData.product}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Product</option>
                {availableMetalTypes.map(product => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
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

      {/* Product Selection and Price Chart */}
      <div className="buyer-chart-container">
        <div className="product-selector" style={{ marginBottom: '20px' }}>
          <label className="form-label" style={{ marginRight: '10px', fontSize: '16px', fontWeight: 'bold' }}>
            Select Product:
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="form-select"
            style={{ width: '200px', display: 'inline-block' }}
            disabled={metalDataLoading}
          >
            {availableMetalTypes.map(product => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '30px' }}>
          {metalDataLoading ? (
            <div className="loading-state" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading price data...</p>
            </div>
          ) : (
            <HighchartsReact
              highcharts={Highcharts}
              options={priceChartOptions}
            />
          )}
        </div>

        {!loading && buyers.length > 0 && (
          <HighchartsReact
            highcharts={Highcharts}
            options={quantityChartOptions}
          />
        )}
      </div>

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
                  <th className="table-cell">Action</th>
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
