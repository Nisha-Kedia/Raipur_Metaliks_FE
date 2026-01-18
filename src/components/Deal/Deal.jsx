import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Download, RefreshCcw, ArrowLeft, Edit, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import './Deal.css';
import { API_BASE_URL } from '../../config';

export default function Deal() {
    const navigate = useNavigate();
    const [deals, setDeals] = useState([]);
    const [filteredDeals, setFilteredDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDeal, setEditingDeal] = useState(null);
    const [sellers, setSellers] = useState([]);
    const [filters, setFilters] = useState({
        seller: '',
        month: '',
        year: new Date().getFullYear().toString()
    });
    const [formData, setFormData] = useState({
        dealDate: new Date().toISOString().split('T')[0],
        sellerName: '',
        buyerName: '',
        material: '',
        price: '',
        dealQuantity: '',
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
        fetchSellers();
    }, []);

    const fetchDeals = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/sauda`);
            if (response.ok) {
                const data = await response.json();
                setDeals(data);
                setFilteredDeals(data);
            }
        } catch (error) {
            console.error('Error fetching deals:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSellers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/sauda/sellers`);
            if (response.ok) {
                const data = await response.json();
                setSellers(data);
            }
        } catch (error) {
            console.error('Error fetching sellers:', error);
        }
    };

    const applyFilters = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.seller) params.append('seller', filters.seller);
            if (filters.year && filters.month) {
                params.append('year', filters.year);
                params.append('month', filters.month);
            }

            const url = `${API_BASE_URL}/api/sauda/filter${params.toString() ? '?' + params.toString() : ''}`;
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setFilteredDeals(data);
            }
        } catch (error) {
            console.error('Error applying filters:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setFilters({ seller: '', month: '', year: new Date().getFullYear().toString() });
        setFilteredDeals(deals);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (filters.seller || (filters.year && filters.month)) {
            applyFilters();
        } else {
            setFilteredDeals(deals);
        }
    }, [filters]);

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

        // Validate quantity in real-time
        if (field === 'quantity' && formData.dealQuantity) {
            const totalDelivered = newTrucks.reduce((sum, truck, idx) => {
                return sum + (idx === index ? parseInt(value) || 0 : parseInt(truck.quantity) || 0);
            }, 0);

            if (totalDelivered > parseInt(formData.dealQuantity)) {
                alert(`Total truck quantity (${totalDelivered}) cannot exceed deal quantity (${formData.dealQuantity}). Remaining: ${formData.dealQuantity - (totalDelivered - (parseInt(value) || 0))}`);
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            truckDeliveries: newTrucks
        }));
    };

    const handleEditTruckChange = (index, field, value) => {
        if (!editingDeal) return;

        const newTrucks = [...editingDeal.truckDeliveries];
        newTrucks[index][field] = value;

        // Validate quantity
        if (field === 'quantity') {
            const totalDelivered = newTrucks.reduce((sum, truck, idx) => {
                return sum + (idx === index ? parseInt(value) || 0 : truck.quantity || 0);
            }, 0);

            if (totalDelivered > editingDeal.saudaQuantity) {
                alert(`Total quantity cannot exceed deal quantity (${editingDeal.saudaQuantity}). Remaining: ${editingDeal.saudaQuantity - (totalDelivered - (parseInt(value) || 0))}`);
                return;
            }

            // Update difference automatically (always positive: dealQty - truckQty)
            editingDeal.difference = editingDeal.saudaQuantity - totalDelivered;
        }

        setEditingDeal(prev => ({
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

    const addEditTruck = () => {
        if (!editingDeal) return;
        const truckNumber = `Truck ${editingDeal.truckDeliveries.length + 1}`;
        setEditingDeal(prev => ({
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

    const removeEditTruck = (index) => {
        if (!editingDeal || editingDeal.truckDeliveries.length <= 1) return;

        const newTrucks = editingDeal.truckDeliveries.filter((_, i) => i !== index);
        const totalDelivered = newTrucks.reduce((sum, truck) => sum + (truck.quantity || 0), 0);

        setEditingDeal(prev => ({
            ...prev,
            truckDeliveries: newTrucks,
            difference: prev.saudaQuantity - totalDelivered
        }));
    };

    const openEditModal = (deal) => {
        setEditingDeal(JSON.parse(JSON.stringify(deal))); // Deep copy
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingDeal(null);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            saudaDate: editingDeal.saudaDate,
            sellerName: editingDeal.sellerName,
            buyerName: editingDeal.buyerName,
            material: editingDeal.material,
            price: editingDeal.price,
            saudaQuantity: editingDeal.saudaQuantity,
            difference: editingDeal.difference,
            actualQuantity: editingDeal.actualQuantity,
            truckDeliveries: editingDeal.truckDeliveries.map(truck => ({
                truckNumber: truck.truckNumber,
                deliveryDate: truck.deliveryDate,
                quantity: parseInt(truck.quantity) || 0
            }))
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/sauda/${editingDeal.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Deal updated successfully!');
                closeEditModal();
                fetchDeals();
            } else {
                alert('Failed to update deal');
            }
        } catch (error) {
            console.error('Error updating deal:', error);
            alert('Error updating deal');
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
        const exportData = filteredDeals.map(deal => {
            const row = {
                'Deal Date': new Date(deal.saudaDate).toLocaleDateString(),
                'Seller Name': deal.sellerName,
                'Buyer Name': deal.buyerName,
                'Material': deal.material,
                'Price': deal.price,
                'Deal Quantity': deal.saudaQuantity,
                'Difference': deal.difference
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

            {/* Filters Section */}
            <div className="deal-filters" style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                gap: '15px',
                alignItems: 'flex-end',
                flexWrap: 'wrap'
            }}>
                <div className="form-group" style={{ marginBottom: 0, minWidth: '200px' }}>
                    <label className="form-label">Filter by Seller</label>
                    <select
                        name="seller"
                        value={filters.seller}
                        onChange={handleFilterChange}
                        className="form-select"
                    >
                        <option value="">All Sellers</option>
                        {sellers.map(seller => (
                            <option key={seller} value={seller}>{seller}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0, minWidth: '150px' }}>
                    <label className="form-label">Filter by Month</label>
                    <select
                        name="month"
                        value={filters.month}
                        onChange={handleFilterChange}
                        className="form-select"
                    >
                        <option value="">All Months</option>
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0, minWidth: '120px' }}>
                    <label className="form-label">Year</label>
                    <select
                        name="year"
                        value={filters.year}
                        onChange={handleFilterChange}
                        className="form-select"
                    >
                        {[2024, 2025, 2026, 2027].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {(filters.seller || filters.month) && (
                    <button
                        onClick={clearFilters}
                        className="btn btn-secondary btn-sm"
                        style={{ marginBottom: 0 }}
                    >
                        <X size={16} />
                        <span>Clear Filters</span>
                    </button>
                )}

                <div style={{ marginLeft: 'auto', color: '#666', fontSize: '14px', alignSelf: 'center' }}>
                    Showing {filteredDeals.length} of {deals.length} deals
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
                                    <th className="table-cell">Trucks</th>
                                    <th className="table-cell">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {filteredDeals.map((deal) => (
                                    <tr key={deal.id} className="table-row">
                                        <td className="table-cell">{new Date(deal.saudaDate).toLocaleDateString()}</td>
                                        <td className="table-cell">{deal.sellerName}</td>
                                        <td className="table-cell">{deal.buyerName}</td>
                                        <td className="table-cell">{deal.material}</td>
                                        <td className="table-cell">₹ {deal.price?.toLocaleString()}</td>
                                        <td className="table-cell">{deal.saudaQuantity}</td>
                                        <td className="table-cell">{deal.difference}</td>
                                        <td className="table-cell">
                                            <div className="truck-info">
                                                {deal.truckDeliveries?.map((truck, idx) => (
                                                    <div key={idx} className="truck-item">
                                                        <strong>{truck.truckNumber}:</strong> {truck.deliveryDate} ({truck.quantity})
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <button
                                                onClick={() => openEditModal(deal)}
                                                className="btn btn-primary btn-sm"
                                                style={{ padding: '5px 10px' }}
                                            >
                                                <Edit size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && editingDeal && (
                <div className="modal-overlay" onClick={closeEditModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflow: 'auto' }}>
                        <div className="modal-header">
                            <h2>Edit Deal - Manage Trucks</h2>
                            <button onClick={closeEditModal} className="btn btn-icon">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-grid" style={{ marginBottom: '20px' }}>
                                <div className="form-group">
                                    <label className="form-label">Deal Date</label>
                                    <input type="text" value={new Date(editingDeal.saudaDate).toLocaleDateString()} className="form-input" disabled />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Seller Name</label>
                                    <input type="text" value={editingDeal.sellerName} className="form-input" disabled />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Buyer Name</label>
                                    <input type="text" value={editingDeal.buyerName} className="form-input" disabled />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Material</label>
                                    <input type="text" value={editingDeal.material} className="form-input" disabled />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price (₹)</label>
                                    <input type="text" value={editingDeal.price?.toLocaleString()} className="form-input" disabled />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Deal Quantity</label>
                                    <input type="text" value={editingDeal.saudaQuantity} className="form-input" disabled />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Difference (Auto-calculated)</label>
                                    <input type="text" value={editingDeal.difference} className="form-input" disabled />
                                </div>
                            </div>

                            <div className="truck-section">
                                <div className="truck-header">
                                    <h3>Truck Deliveries</h3>
                                    <button type="button" onClick={addEditTruck} className="btn btn-sm btn-primary">
                                        <Plus size={16} />
                                        <span>Add Truck</span>
                                    </button>
                                </div>
                                {/* <div style={{ marginBottom: '15px', padding: '10px', background: '#f0f9ff', border: '1px solid #0284c7', borderRadius: '4px' }}>
                                    <strong>Remaining Quantity:</strong> {editingDeal.saudaQuantity - editingDeal.truckDeliveries.reduce((sum, t) => sum + (t.quantity || 0), 0)}
                                </div> */}

                                {editingDeal.truckDeliveries.map((truck, index) => (
                                    <div key={index} className="truck-row">
                                        <div className="form-group">
                                            <label className="form-label">Truck Number</label>
                                            <input
                                                type="text"
                                                value={truck.truckNumber}
                                                onChange={(e) => handleEditTruckChange(index, 'truckNumber', e.target.value)}
                                                className="form-input"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Delivery Date</label>
                                            <input
                                                type="date"
                                                value={truck.deliveryDate}
                                                onChange={(e) => handleEditTruckChange(index, 'deliveryDate', e.target.value)}
                                                className="form-input"
                                                required
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Quantity</label>
                                            <input
                                                type="number"
                                                value={truck.quantity}
                                                onChange={(e) => handleEditTruckChange(index, 'quantity', e.target.value)}
                                                className="form-input"
                                                placeholder="15"
                                                required
                                            />
                                        </div>

                                        {editingDeal.truckDeliveries.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeEditTruck(index)}
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
                                <button type="button" onClick={closeEditModal} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

