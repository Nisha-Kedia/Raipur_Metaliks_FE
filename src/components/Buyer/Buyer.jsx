// import { useState, useEffect, useMemo } from "react";
// import { Plus, RefreshCcw, CheckCircle, XCircle } from "lucide-react";
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import './Buyer.css'

// export default function Buyer() {
//   const [buyers, setBuyers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState("Steel Rods");
//   const [formData, setFormData] = useState({
//     name: "",
//     phoneNo: "",
//     quantity: "",
//     price: "",
//     product: "",
//     status: "Pending"
//   });
//   const [formSuccess, setFormSuccess] = useState(false);

//   // Available products
//   const products = [
//     "Steel Rods", "Iron Sheets", "Aluminum Pipes", "Copper Wires", 
//     "Brass Fittings", "Stainless Steel", "Galvanized Steel", "Carbon Steel"
//   ];

//   // Generate random price data for each product
//   const generatePriceData = (product) => {
//     const basePrice = {
//       "Steel Rods": 45000,
//       "Iron Sheets": 38000,
//       "Aluminum Pipes": 52000,
//       "Copper Wires": 68000,
//       "Brass Fittings": 42000,
//       "Stainless Steel": 75000,
//       "Galvanized Steel": 48000,
//       "Carbon Steel": 41000
//     };

//     const data = [];
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - 30); // Start 30 days ago
    
//     for (let i = 0; i < 15; i++) {
//       const date = new Date(startDate);
//       date.setDate(startDate.getDate() + (i * 2)); // Every 2 days
      
//       const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
//       const price = basePrice[product] * (1 + variation);
      
//       data.push([date.getTime(), Math.round(price)]);
//     }
    
//     return data.sort((a, b) => a[0] - b[0]); // Sort by date
//   };

//   const fetchBuyers = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("http://raipurmetaliksbe-production.up.railway.app:8080/api/getbuyers");
//       if (!response.ok) {
//         throw new Error("Failed to fetch buyers");
//       }
//       const data = await response.json();
//       setBuyers(data);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBuyers();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();
    
//     const submissionData = {
//       ...formData,
//       phoneNo: formData.phoneNo ? parseInt(formData.phoneNo, 10) : null,
//       quantity: formData.quantity ? parseInt(formData.quantity, 10) : null,
//       price: formData.price ? parseFloat(formData.price) : null,
//     };

//     try {
//       const response = await fetch("http://raipurmetaliksbe-production.up.railway.app:8080/api/Buyerform", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(submissionData),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to submit buyer data");
//       }

//       setFormSuccess(true);
//       setTimeout(() => setFormSuccess(false), 3000);
      
//       setFormData({
//         name: "",
//         phoneNo: "",
//         quantity: "",
//         price: "",
//         product: "",
//         status: "Pending"
//       });
//       fetchBuyers();
//       setShowForm(false);
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch (status?.toLowerCase()) {
//       case "completed":
//         return "badge badge-success";
//       case "pending":
//         return "badge badge-warning";
//       case "cancelled":
//         return "badge badge-error";
//       default:
//         return "badge badge-neutral";
//     }
//   };

//   // Price vs Date Chart Configuration
//   const priceChartOptions = useMemo(() => {
//     const priceData = generatePriceData(selectedProduct);
    
//     return {
//       chart: {
//         type: 'line',
//         height: 400,
//         backgroundColor: '#f8f9fa',
//         borderRadius: 10,
//         marginTop: 60
//       },
//       title: {
//         text: `${selectedProduct} - Price Trend`,
//         style: {
//           fontSize: '18px',
//           fontWeight: 'bold',
//           color: '#2c3e50'
//         }
//       },
//       subtitle: {
//         text: 'Price per ton over the last 30 days',
//         style: {
//           color: '#7f8c8d'
//         }
//       },
//       xAxis: {
//         type: 'datetime',
//         title: {
//           text: 'Date',
//           style: {
//             color: '#2c3e50',
//             fontWeight: 'bold'
//           }
//         },
//         labels: {
//           style: {
//             color: '#2c3e50'
//           }
//         },
//         gridLineColor: '#e9ecef',
//         lineColor: '#dee2e6'
//       },
//       yAxis: {
//         title: {
//           text: 'Price (₹ per ton)',
//           style: {
//             color: '#2c3e50',
//             fontWeight: 'bold'
//           }
//         },
//         labels: {
//           style: {
//             color: '#2c3e50'
//           },
//           formatter: function() {
//             return '₹' + (this.value / 1000).toFixed(0) + 'k';
//           }
//         },
//         gridLineColor: '#e9ecef'
//       },
//       tooltip: {
//         backgroundColor: '#ffffff',
//         borderColor: '#dee2e6',
//         borderRadius: 8,
//         shadow: true,
//         formatter: function() {
//           return `<b>${selectedProduct}</b><br/>
//                   Date: ${Highcharts.dateFormat('%e %b %Y', this.x)}<br/>
//                   Price: ₹${this.y.toLocaleString()} per ton`;
//         }
//       },
//       plotOptions: {
//         line: {
//           dataLabels: {
//             enabled: false
//           },
//           enableMouseTracking: true,
//           marker: {
//             fillColor: '#3498db',
//             lineColor: '#2980b9',
//             lineWidth: 2,
//             radius: 4,
//             states: {
//               hover: {
//                 fillColor: '#e74c3c',
//                 lineColor: '#c0392b',
//                 radius: 6
//               }
//             }
//           }
//         }
//       },
//       legend: {
//         enabled: false
//       },
//       series: [{
//         name: selectedProduct,
//         data: priceData,
//         color: '#3498db',
//         lineWidth: 3,
//         states: {
//           hover: {
//             lineWidth: 4
//           }
//         }
//       }],
//       credits: {
//         enabled: false
//       }
//     };
//   }, [selectedProduct]);

//   // Buyer Quantity Chart Configuration
//   const quantityChartOptions = useMemo(() => {
//     const categories = buyers.map(buyer => buyer.name);
//     const quantityData = buyers.map(buyer => buyer.quantity);

//     return {
//       chart: {
//         type: 'line',
//         height: 400,
//         backgroundColor: '#f8f9fa',
//         borderRadius: 10,
//         marginTop: 60
//       },
//       title: {
//         text: 'Order Quantity by Buyer',
//         style: {
//           fontSize: '18px',
//           fontWeight: 'bold',
//           color: '#2c3e50'
//         }
//       },
//       subtitle: {
//         text: 'Quantity trends across buyers',
//         style: {
//           color: '#7f8c8d'
//         }
//       },
//       xAxis: {
//         categories: categories,
//         title: {
//           text: 'Buyer',
//           style: {
//             color: '#2c3e50',
//             fontWeight: 'bold'
//           }
//         },
//         labels: {
//           style: {
//             fontSize: '11px',
//             color: '#2c3e50'
//           },
//           rotation: -45
//         },
//         gridLineColor: '#e9ecef',
//         lineColor: '#dee2e6'
//       },
//       yAxis: {
//         min: 0,
//         title: {
//           text: 'Quantity (units)',
//           style: {
//             color: '#2c3e50',
//             fontWeight: 'bold'
//           }
//         },
//         labels: {
//           style: {
//             color: '#2c3e50'
//           }
//         },
//         gridLineColor: '#e9ecef'
//       },
//       tooltip: {
//         backgroundColor: '#ffffff',
//         borderColor: '#dee2e6',
//         borderRadius: 8,
//         shadow: true,
//         formatter: function() {
//           return `<b>${this.point.category}</b><br/>
//                   Quantity: <b>${this.y}</b> units`;
//         }
//       },
//       plotOptions: {
//         line: {
//           dataLabels: {
//             enabled: true,
//             style: {
//               color: '#2c3e50',
//               fontWeight: 'bold'
//             }
//           },
//           enableMouseTracking: true,
//           marker: {
//             fillColor: '#2a9d8f',
//             lineColor: '#229B8D',
//             lineWidth: 2,
//             radius: 6,
//             states: {
//               hover: {
//                 fillColor: '#e74c3c',
//                 lineColor: '#c0392b',
//                 radius: 8
//               }
//             }
//           }
//         }
//       },
//       legend: {
//         enabled: false
//       },
//       series: [{
//         name: 'Quantity',
//         data: quantityData,
//         color: '#2a9d8f',
//         lineWidth: 3,
//         states: {
//           hover: {
//             lineWidth: 4
//           }
//         }
//       }],
//       credits: {
//         enabled: false
//       }
//     };
//   }, [buyers]);

//   return (
//     <div className="buyer-container">
//       <div className="buyer-header">
//         <h1 className="buyer-title">Raipur Metaliks Buyers</h1>
//         <div className="buyer-actions">
//           <button
//             onClick={() => fetchBuyers()}
//             className="btn btn-secondary btn-sm"
//           >
//             <RefreshCcw size={16} />
//             <span>Refresh</span>
//           </button>
//           <button
//             onClick={() => setShowForm(!showForm)}
//             className="btn btn-primary btn-sm"
//           >
//             <Plus size={16} />
//             <span>Add Buyer</span>
//           </button>
//         </div>
//       </div>

//       {formSuccess && (
//         <div className="alert alert-success">
//           <CheckCircle size={20} className="alert-icon" />
//           <span>Buyer added successfully!</span>
//         </div>
//       )}

//       {error && (
//         <div className="alert alert-error">
//           <XCircle size={20} className="alert-icon" />
//           <span>{error}</span>
//         </div>
//       )}

//       {showForm && (
//         <div className="buyer-form">
//           <h2 className="form-title">Add New Buyer</h2>
//           <div className="form-grid">
//             <div className="form-group">
//               <label className="form-label">Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="form-input"
//               />
//             </div>
//             <div className="form-group">
//               <label className="form-label">Phone Number</label>
//               <input
//                 type="number"
//                 name="phoneNo"
//                 value={formData.phoneNo}
//                 onChange={handleChange}
//                 className="form-input"
//               />
//             </div>
//             <div className="form-group">
//               <label className="form-label">Product</label>
//               <select
//                 name="product"
//                 value={formData.product}
//                 onChange={handleChange}
//                 className="form-select"
//               >
//                 <option value="">Select Product</option>
//                 {products.map(product => (
//                   <option key={product} value={product}>{product}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="form-group">
//               <label className="form-label">Quantity</label>
//               <input
//                 type="number"
//                 name="quantity"
//                 value={formData.quantity}
//                 onChange={handleChange}
//                 className="form-input"
//               />
//             </div>
//             <div className="form-group">
//               <label className="form-label">Price</label>
//               <input
//                 type="number"
//                 name="price"
//                 step="0.01"
//                 value={formData.price}
//                 onChange={handleChange}
//                 className="form-input"
//               />
//             </div>
//             <div className="form-group">
//               <label className="form-label">Status</label>
//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="form-select"
//               >
//                 <option value="Pending">Pending</option>
//                 <option value="Completed">Completed</option>
//                 <option value="Cancelled">Cancelled</option>
//               </select>
//             </div>
//           </div>
//           <div className="form-actions">
//             <button
//               type="button"
//               onClick={() => setShowForm(false)}
//               className="btn btn-secondary"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="btn btn-primary"
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Product Selection and Price Chart */}
//       <div className="buyer-chart-container">
//         <div className="product-selector" style={{ marginBottom: '20px' }}>
//           <label className="form-label" style={{ marginRight: '10px', fontSize: '16px', fontWeight: 'bold' }}>
//             Select Product:
//           </label>
//           <select
//             value={selectedProduct}
//             onChange={(e) => setSelectedProduct(e.target.value)}
//             className="form-select"
//             style={{ width: '200px', display: 'inline-block' }}
//           >
//             {products.map(product => (
//               <option key={product} value={product}>{product}</option>
//             ))}
//           </select>
//         </div>

//         <div style={{ marginBottom: '30px' }}>
//           <HighchartsReact
//             highcharts={Highcharts}
//             options={priceChartOptions}
//           />
//         </div>

//         {!loading && buyers.length > 0 && (
//           <HighchartsReact
//             highcharts={Highcharts}
//             options={quantityChartOptions}
//           />
//         )}
//       </div>

//       <div className="buyer-table-container">
//         {loading ? (
//           <div className="loading-state">
//             <div className="loading-spinner"></div>
//             <p className="loading-text">Loading buyers...</p>
//           </div>
//         ) : buyers.length === 0 ? (
//           <div className="empty-state">
//             <p className="empty-text">No buyers found. Add a new buyer to get started.</p>
//           </div>
//         ) : (
//           <div className="table-wrapper">
//             <table className="buyer-table">
//               <thead className="table-header">
//                 <tr>
//                   <th className="table-cell">ID</th>
//                   <th className="table-cell">Name</th>
//                   <th className="table-cell">Phone</th>
//                   <th className="table-cell">Product</th>
//                   <th className="table-cell">Quantity</th>
//                   <th className="table-cell">Price</th>
//                   <th className="table-cell">Status</th>
//                   <th ClassName ="table-cell">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="table-body">
//                 {buyers.map((buyer) => (
//                   <tr key={buyer.id} className="table-row">
//                     <td className="table-cell">{buyer.id}</td>
//                     <td className="table-cell table-cell-name">{buyer.name}</td>
//                     <td className="table-cell">{buyer.phoneNo}</td>
//                     <td className="table-cell">{buyer.product}</td>
//                     <td className="table-cell">{buyer.quantity}</td>
//                     <td className="table-cell">
//                       ₹ {buyer.price}   
//                     </td>
//                     <td className="table-cell">
//                       <span className={getStatusBadge(buyer.status)}>
//                         {buyer.status || "Pending"}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState, useMemo } from "react";
import { RefreshCcw, Plus } from "lucide-react";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './Buyer.css';

export default function Buyer() {
  const initialBuyers = [
    { id: 1, name: "Rajesh Kumar", phoneNo: "9876543210", product: "Steel Rods", quantity: 500, price: 45000, status: "Completed" },
    { id: 2, name: "Priya Sharma", phoneNo: "9876543211", product: "Iron Sheets", quantity: 250, price: 38000, status: "Pending" },
    { id: 3, name: "Amit Patel", phoneNo: "9876543212", product: "Aluminum Pipes", quantity: 300, price: 52000, status: "Completed" },
    { id: 4, name: "Sunita Verma", phoneNo: "9876543213", product: "Copper Wires", quantity: 150, price: 68000, status: "Cancelled" },
    { id: 5, name: "Rohit Singh", phoneNo: "9876543214", product: "Brass Fittings", quantity: 400, price: 42000, status: "Pending" },
    { id: 6, name: "Neha Gupta", phoneNo: "9876543215", product: "Stainless Steel", quantity: 200, price: 75000, status: "Completed" },
    { id: 7, name: "Vikram Joshi", phoneNo: "9876543216", product: "Galvanized Steel", quantity: 350, price: 48000, status: "Pending" },
    { id: 8, name: "Kavita Rao", phoneNo: "9876543217", product: "Carbon Steel", quantity: 450, price: 41000, status: "Completed" },
    { id: 9, name: "Deepak Mehta", phoneNo: "9876543218", product: "Steel Rods", quantity: 600, price: 45000, status: "Pending" },
    { id: 10, name: "Anita Jain", phoneNo: "9876543219", product: "Iron Sheets", quantity: 280, price: 38000, status: "Completed" },
    { id: 11, name: "Suresh Reddy", phoneNo: "9876543220", product: "Aluminum Pipes", quantity: 320, price: 52000, status: "Cancelled" },
    { id: 12, name: "Pooja Agarwal", phoneNo: "9876543221", product: "Copper Wires", quantity: 180, price: 68000, status: "Pending" }
  ];

  const products = [
    "Steel Rods", "Iron Sheets", "Aluminum Pipes", "Copper Wires",
    "Brass Fittings", "Stainless Steel", "Galvanized Steel", "Carbon Steel"
  ];

  const [buyers, setBuyers] = useState(initialBuyers);
  const [selectedProduct, setSelectedProduct] = useState("Steel Rods");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const initialNewBuyerState = {
    name: "",
    phoneNo: "",
    product: products[0],
    quantity: "",
    price: "",
    status: "Pending"
  };

  const [newBuyer, setNewBuyer] = useState(initialNewBuyerState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBuyer({ ...newBuyer, [name]: value });
  };

  const handleAddBuyer = (e) => {
    e.preventDefault();
    if (!newBuyer.name || !newBuyer.phoneNo || !newBuyer.quantity || !newBuyer.price) {
      alert("Please fill in all fields.");
      return;
    }
    const buyerToAdd = {
      ...newBuyer,
      id: Date.now(),
      quantity: parseInt(newBuyer.quantity, 10),
      price: parseInt(newBuyer.price, 10)
    };
    setBuyers([...buyers, buyerToAdd]);
    setNewBuyer(initialNewBuyerState);
    setIsModalOpen(false);
  };

  const generatePriceData = (product) => {
    const basePrice = {
      "Steel Rods": 45000,
      "Iron Sheets": 38000,
      "Aluminum Pipes": 52000,
      "Copper Wires": 68000,
      "Brass Fittings": 42000,
      "Stainless Steel": 75000,
      "Galvanized Steel": 48000,
      "Carbon Steel": 41000
    };
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    for (let i = 0; i < 15; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (i * 2));
      const variation = (Math.random() - 0.5) * 0.2;
      const price = basePrice[product] * (1 + variation);
      data.push([date.getTime(), Math.round(price)]);
    }
    return data.sort((a, b) => a[0] - b[0]);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "badge badge-success";
      case "pending": return "badge badge-warning";
      case "cancelled": return "badge badge-error";
      default: return "badge badge-neutral";
    }
  };

  const priceChartOptions = useMemo(() => {
    const priceData = generatePriceData(selectedProduct);
    return {
      chart: { type: 'line', height: 400, backgroundColor: '#f8f9fa', borderRadius: 10, marginTop: 60 },
      title: { text: `${selectedProduct} - Price Trend`, style: { fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' } },
      subtitle: { text: 'Price per ton over the last 30 days', style: { color: '#7f8c8d' } },
      xAxis: {
        type: 'datetime',
        title: { text: 'Date', style: { color: '#2c3e50', fontWeight: 'bold' } },
        labels: { style: { color: '#2c3e50' } },
        gridLineColor: '#e9ecef',
        lineColor: '#dee2e6'
      },
      yAxis: {
        title: { text: 'Price (₹ per ton)', style: { color: '#2c3e50', fontWeight: 'bold' } },
        labels: {
          style: { color: '#2c3e50' },
          formatter: function() { return '₹' + (this.value / 1000).toFixed(0) + 'k'; }
        },
        gridLineColor: '#e9ecef'
      },
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#dee2e6',
        borderRadius: 8,
        shadow: true,
        formatter: function() {
          return `<b>${selectedProduct}</b><br/>Date: ${Highcharts.dateFormat('%e %b %Y', this.x)}<br/>Price: ₹${this.y.toLocaleString()} per ton`;
        }
      },
      plotOptions: {
        line: {
          dataLabels: { enabled: false },
          enableMouseTracking: true,
          marker: {
            fillColor: '#3498db',
            lineColor: '#2980b9',
            lineWidth: 2,
            radius: 4,
            states: { hover: { fillColor: '#e74c3c', lineColor: '#c0392b', radius: 6 } }
          }
        }
      },
      legend: { enabled: false },
      series: [{
        name: selectedProduct,
        data: priceData,
        color: '#3498db',
        lineWidth: 3,
        states: { hover: { lineWidth: 4 } }
      }],
      credits: { enabled: false }
    };
  }, [selectedProduct]);

  const quantityChartOptions = useMemo(() => {
    const categories = buyers.map(buyer => buyer.name);
    const quantityData = buyers.map(buyer => buyer.quantity);
    return {
      chart: { type: 'line', height: 400, backgroundColor: '#f8f9fa', borderRadius: 10, marginTop: 60 },
      title: { text: 'Order Quantity by Buyer', style: { fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' } },
      subtitle: { text: 'Quantity trends across buyers', style: { color: '#7f8c8d' } },
      xAxis: {
        categories: categories,
        title: { text: 'Buyer', style: { color: '#2c3e50', fontWeight: 'bold' } },
        labels: { style: { fontSize: '11px', color: '#2c3e50' }, rotation: -45 },
        gridLineColor: '#e9ecef',
        lineColor: '#dee2e6'
      },
      yAxis: {
        min: 0,
        title: { text: 'Quantity (units)', style: { color: '#2c3e50', fontWeight: 'bold' } },
        labels: { style: { color: '#2c3e50' } },
        gridLineColor: '#e9ecef'
      },
      tooltip: {
        backgroundColor: '#ffffff',
        borderColor: '#dee2e6',
        borderRadius: 8,
        shadow: true,
        formatter: function() { return `<b>${this.point.category}</b><br/>Quantity: <b>${this.y}</b> units`; }
      },
      plotOptions: {
        line: {
          dataLabels: { enabled: true, style: { color: '#2c3e50', fontWeight: 'bold' } },
          enableMouseTracking: true,
          marker: {
            fillColor: '#2a9d8f',
            lineColor: '#229B8D',
            lineWidth: 2,
            radius: 6,
            states: { hover: { fillColor: '#e74c3c', lineColor: '#c0392b', radius: 8 } }
          }
        }
      },
      legend: { enabled: false },
      series: [{
        name: 'Quantity',
        data: quantityData,
        color: '#2a9d8f',
        lineWidth: 3,
        states: { hover: { lineWidth: 4 } }
      }],
      credits: { enabled: false }
    };
  }, [buyers]);

  return (
    <div className="buyer-container">
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 className="modal-title">Add New Buyer</h2>
            <form onSubmit={handleAddBuyer} className="modal-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={newBuyer.name} onChange={handleInputChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phoneNo" value={newBuyer.phoneNo} onChange={handleInputChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label>Product</label>
                <select name="product" value={newBuyer.product} onChange={handleInputChange} className="form-select">
                  {products.map(product => <option key={product} value={product}>{product}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" name="quantity" value={newBuyer.quantity} onChange={handleInputChange} className="form-input" required />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" name="price" value={newBuyer.price} onChange={handleInputChange} className="form-input" required />
              </div>
               <div className="form-group">
                <label>Status</label>
                <select name="status" value={newBuyer.status} onChange={handleInputChange} className="form-select">
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-neutral">Cancel</button>
                <button type="submit" className="btn btn-primary">Add Buyer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="buyer-header">
        <h1 className="buyer-title">Raipur Metaliks Buyers</h1>
        <div className="buyer-actions">
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add Buyer</span>
          </button>
          <button onClick={() => window.location.reload()} className="btn btn-secondary btn-sm">
            <RefreshCcw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

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
          >
            {products.map(product => <option key={product} value={product}>{product}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '30px' }}>
          <HighchartsReact highcharts={Highcharts} options={priceChartOptions} />
        </div>
        <HighchartsReact highcharts={Highcharts} options={quantityChartOptions} />
      </div>

      <div className="buyer-table-container">
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
                  <td className="table-cell">₹ {buyer.price.toLocaleString()}</td>
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
      </div>
    </div>
  );
}
