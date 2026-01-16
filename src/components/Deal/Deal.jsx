import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Download, RefreshCcw, ArrowLeft } from 'lucide-react';
import * as XLSX from 'xlsx';
import './Deal.css';
import { API_BASE_URL } from '../../config';

export default function Deal() {
    const navigate = useNavigate();
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        dealDate: new Date().toISOString().split('T')[0],
        sellerName: '',
        buyerName: '',
        material: '',
        price: '',
        dealQuantity: '',
        difference: '',
        actualQuantity: '',
        truckDeliveries: [{ truckNumber: 'Truck 1', deliveryDate: '', quantity: '' }]
    });

    const materials = [
        'Pig Iron',
        'Billet',
        'Pellet',
        'PDRI',
        'Iron Sheets',
        'Steel Rods',
        'Aluminum Pipes',
        'Copper Wires',
        'Brass Fittings',
        'Stainless Steel',
        'Galvanized Steel',
        'Carbon Steel'
    ];

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/sauda`);
            if (response.ok) {
                const data = await response.json();
                setDeals(data);
            }
        } catch (error) {
            console.error('Error fetching deals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTruckChange = (index, field, value) => {
        const newTrucks = [...formData.truckDeliveries];
        newTrucks[index][field] = value;
        setFormData(prev => ({
            ...prev,
            truckDeliveries: newTrucks
        }));
    };

    const addTruck = () => {
        const truckNumber = `Truck ${formData.truckDeliveries.length + 1}`;
        setFormData(prev => ({
            ...prev,
            truckDeliveries: [...prev.truckDeliveries, { truckNumber, deliveryDate: '', quantity: '' }]
        }));
    };

    const removeTruck = (index) => {
        if (formData.truckDeliveries.length > 1) {
            setFormData(prev => ({
                ...prev,
                truckDeliveries: prev.truckDeliveries.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            saudaDate: formData.dealDate,
            sellerName: formData.sellerName,
            buyerName: formData.buyerName,
            material: formData.material,
            price: parseFloat(formData.price),
            saudaQuantity: parseInt(formData.dealQuantity),
            difference: parseInt(formData.difference),
            actualQuantity: parseInt(formData.actualQuantity),
            truckDeliveries: formData.truckDeliveries.map(truck => ({
                truckNumber: truck.truckNumber,
                deliveryDate: truck.deliveryDate,
                quantity: parseInt(truck.quantity)
            }))
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/sauda`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Deal created successfully!');
                setShowForm(false);
                setFormData({
                    dealDate: new Date().toISOString().split('T')[0],
                    sellerName: '',
                    buyerName: '',
                    material: '',
                    price: '',
                    dealQuantity: '',
                    difference: '',
                    actualQuantity: '',
                    truckDeliveries: [{ truckNumber: 'Truck 1', deliveryDate: '', quantity: '' }]
                });
                fetchDeals();
            } else {
                alert('Failed to create deal');
            }
        } catch (error) {
            console.error('Error creating deal:', error);
            alert('Error creating deal');
        }
    };

    const exportToExcel = () => {
        const exportData = deals.map(deal => {
            const row = {
                'Deal Date': new Date(deal.saudaDate).toLocaleDateString(),
                'Seller Name': deal.sellerName,
                'Buyer Name': deal.buyerName,
                'Material': deal.material,
                'Price': deal.price,
                'Deal Quantity': deal.saudaQuantity,
                'Difference': deal.difference,
                'Actual Quantity': deal.actualQuantity
            };

            // Add truck columns
            deal.truckDeliveries?.forEach((truck, index) => {
                row[`${truck.truckNumber}`] = truck.deliveryDate;
                row[`${truck.truckNumber} Qty`] = truck.quantity;
            });

            return row;
        });

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Deal Data');

        // Write file - removed problematic type option
        XLSX.writeFile(wb, `Deal_Data_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="deal-container">
            <div className="deal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-secondary btn-sm"
                    >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                    </button>
                    <h1 className="deal-title">Deal Management</h1>
                </div>
                <div className="deal-actions">
                    <button onClick={fetchDeals} className="btn btn-secondary btn-sm">
                        <RefreshCcw size={16} />
                        <span>Refresh</span>
                    </button>
                    <button onClick={exportToExcel} className="btn btn-success btn-sm">
                        <Download size={16} />
                        <span>Export Excel</span>
                    </button>
                    <button onClick={() => setShowForm(!showForm)} className="btn btn-primary btn-sm">
                        <Plus size={16} />
                        <span>{showForm ? 'Hide Form' : 'Add deal'}</span>
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="deal-form-card">
                    <h2 className="form-title">Add New deal</h2>
                    <form onSubmit={handleSubmit} className="deal-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">deal Date</label>
                                <input
                                    type="date"
                                    name="dealDate"
                                    value={formData.dealDate}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Seller Name</label>
                                <input
                                    type="text"
                                    name="sellerName"
                                    value={formData.sellerName}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="ABC"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Buyer Name</label>
                                <input
                                    type="text"
                                    name="buyerName"
                                    value={formData.buyerName}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="XYZ"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Material</label>
                                <select
                                    name="material"
                                    value={formData.material}
                                    onChange={handleInputChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select Material</option>
                                    {materials.map(material => (
                                        <option key={material} value={material}>{material}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="37000.00"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">deal Quantity</label>
                                <input
                                    type="number"
                                    name="dealQuantity"
                                    value={formData.dealQuantity}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="100"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Difference</label>
                                <input
                                    type="number"
                                    name="difference"
                                    value={formData.difference}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Actual Quantity</label>
                                <input
                                    type="number"
                                    name="actualQuantity"
                                    value={formData.actualQuantity}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="100"
                                    required
                                />
                            </div>
                        </div>

                        <div className="truck-section">
                            <div className="truck-header">
                                <h3>Truck Deliveries</h3>
                                <button type="button" onClick={addTruck} className="btn btn-sm btn-primary">
                                    <Plus size={16} />
                                    <span>Add Truck</span>
                                </button>
                            </div>

                            {formData.truckDeliveries.map((truck, index) => (
                                <div key={index} className="truck-row">
                                    <div className="form-group">
                                        <label className="form-label">Truck Number</label>
                                        <input
                                            type="text"
                                            value={truck.truckNumber}
                                            onChange={(e) => handleTruckChange(index, 'truckNumber', e.target.value)}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Delivery Date</label>
                                        <input
                                            type="date"
                                            value={truck.deliveryDate}
                                            onChange={(e) => handleTruckChange(index, 'deliveryDate', e.target.value)}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Quantity</label>
                                        <input
                                            type="number"
                                            value={truck.quantity}
                                            onChange={(e) => handleTruckChange(index, 'quantity', e.target.value)}
                                            className="form-input"
                                            placeholder="15"
                                            required
                                        />
                                    </div>

                                    {formData.truckDeliveries.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTruck(index)}
                                            className="btn btn-danger btn-icon"
                                            title="Remove Truck"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="form-actions">
                            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Submit deal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="deal-table-container">
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p className="loading-text">Loading deals...</p>
                    </div>
                ) : deals.length === 0 ? (
                    <div className="empty-state">
                        <p className="empty-text">No deals found. Add a new deal to get started.</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="deal-table">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-cell">deal Date</th>
                                    <th className="table-cell">Seller</th>
                                    <th className="table-cell">Buyer</th>
                                    <th className="table-cell">Material</th>
                                    <th className="table-cell">Price</th>
                                    <th className="table-cell">deal Qty</th>
                                    <th className="table-cell">Difference</th>
                                    <th className="table-cell">Actual Qty</th>
                                    <th className="table-cell">Trucks</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {deals.map((deal) => (
                                    <tr key={deal.id} className="table-row">
                                        <td className="table-cell">{new Date(deal.saudaDate).toLocaleDateString()}</td>
                                        <td className="table-cell">{deal.sellerName}</td>
                                        <td className="table-cell">{deal.buyerName}</td>
                                        <td className="table-cell">{deal.material}</td>
                                        <td className="table-cell">₹ {deal.price?.toLocaleString()}</td>
                                        <td className="table-cell">{deal.saudaQuantity}</td>
                                        <td className="table-cell">{deal.difference}</td>
                                        <td className="table-cell">{deal.actualQuantity}</td>
                                        <td className="table-cell">
                                            <div className="truck-info">
                                                {deal.truckDeliveries?.map((truck, idx) => (
                                                    <div key={idx} className="truck-item">
                                                        <strong>{truck.truckNumber}:</strong> {truck.deliveryDate} ({truck.quantity})
                                                    </div>
                                                ))}
                                            </div>
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

