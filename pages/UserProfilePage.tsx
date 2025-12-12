import React, { useState, useEffect } from 'react';
import { User, Order, CartItem, Address, PaymentMethod, Product } from '../types';
import { MOCK_ORDERS, MOCK_ADDRESSES, MOCK_PAYMENTS, CATEGORIES } from '../constants';
import { Package, Heart, LogOut, ShoppingBag, Tag, User as UserIcon, MapPin, CreditCard, Plus, Trash2, Edit2, Check, X, Image as ImageIcon, DollarSign } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UserProfilePageProps {
  user: User;
  onLogout: () => void;
  savedItems: CartItem[];
  onMoveToCart: (id: number) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, onLogout, savedItems, onMoveToCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'listings' | 'addresses' | 'payments'>('orders');

  // Local state for Addresses and Payments (mocked persistence)
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [payments, setPayments] = useState<PaymentMethod[]>(MOCK_PAYMENTS);

  // Local state for Listings
  const [listings, setListings] = useState<Product[]>([]);
  const [isCreatingListing, setIsCreatingListing] = useState(false);
  const [newListing, setNewListing] = useState<Partial<Product>>({
    category: 'Electronics',
    image: '',
    name: '',
    description: '',
    price: undefined
  });

  // Form states for Addresses/Payments
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Partial<Address>>({});
  
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Partial<PaymentMethod>>({});

  // Sync active tab with URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['profile', 'orders', 'wishlist', 'listings', 'addresses', 'payments'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [location.search]);

  // --- Address Handlers ---
  const handleEditAddress = (address?: Address) => {
    if (address) {
      setCurrentAddress({ ...address });
    } else {
      setCurrentAddress({ type: 'Home', country: 'USA', isDefault: false });
    }
    setIsEditingAddress(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !currentAddress.id;
    const addressId = currentAddress.id || `addr-${Date.now()}`;
    
    // Construct valid address object
    const addressToSave = {
      ...currentAddress,
      id: addressId,
      street: currentAddress.street || '',
      city: currentAddress.city || '',
      state: currentAddress.state || '',
      zipCode: currentAddress.zipCode || '',
      country: currentAddress.country || 'USA',
      type: currentAddress.type || 'Home',
      isDefault: currentAddress.isDefault || false
    } as Address;

    setAddresses(prev => {
      let updatedList = [...prev];
      
      if (isNew) {
        updatedList.push(addressToSave);
      } else {
        updatedList = updatedList.map(a => a.id === addressId ? addressToSave : a);
      }

      if (addressToSave.isDefault) {
        updatedList = updatedList.map(a => ({
          ...a,
          isDefault: a.id === addressId
        }));
      } else if (updatedList.length === 1) {
        updatedList[0].isDefault = true;
      }

      return updatedList;
    });
    
    setIsEditingAddress(false);
    setCurrentAddress({});
  };

  const handleDeleteAddress = (id: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setAddresses(prev => prev.filter(a => a.id !== id));
    }
  };

  // --- Payment Handlers ---
  const handleEditPayment = (payment?: PaymentMethod) => {
    if (payment) {
      setCurrentPayment({ ...payment });
    } else {
      setCurrentPayment({ type: 'Visa', isDefault: false });
    }
    setIsEditingPayment(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isNew = !currentPayment.id;
    const paymentId = currentPayment.id || `pm-${Date.now()}`;
    
    const paymentToSave = {
      ...currentPayment,
      id: paymentId,
      type: currentPayment.type || 'Visa',
      last4: currentPayment.last4 || '0000',
      expiry: currentPayment.expiry || '',
      cardHolder: currentPayment.cardHolder || '',
      isDefault: currentPayment.isDefault || false
    } as PaymentMethod;

    setPayments(prev => {
      let updatedList = [...prev];
      
      if (isNew) {
        updatedList.push(paymentToSave);
      } else {
        updatedList = updatedList.map(p => p.id === paymentId ? paymentToSave : p);
      }

      if (paymentToSave.isDefault) {
        updatedList = updatedList.map(p => ({
          ...p,
          isDefault: p.id === paymentId
        }));
      } else if (updatedList.length === 1) {
        updatedList[0].isDefault = true;
      }

      return updatedList;
    });

    setIsEditingPayment(false);
    setCurrentPayment({});
  };

  const handleDeletePayment = (id: string) => {
    if (window.confirm("Are you sure you want to remove this payment method?")) {
      setPayments(prev => prev.filter(p => p.id !== id));
    }
  };

  // --- Listing Handlers ---
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListing.name || !newListing.price || !newListing.description) return;

    const listing: Product = {
      id: Date.now(),
      name: newListing.name,
      price: Number(newListing.price),
      category: newListing.category || 'Electronics',
      description: newListing.description,
      image: newListing.image || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80',
      rating: 0,
      stock: 1,
      colors: []
    };

    setListings(prev => [...prev, listing]);
    setIsCreatingListing(false);
    setNewListing({ category: 'Electronics', image: '', name: '', description: '', price: undefined });
  };

  const handleDeleteListing = (id: number) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      setListings(prev => prev.filter(l => l.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 text-center">
             <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full mb-4 overflow-hidden">
               <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
             </div>
             <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
             <p className="text-gray-500 text-sm mb-6">{user.email}</p>
             <button 
               onClick={() => { onLogout(); navigate('/'); }}
               className="w-full border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
             >
               <LogOut size={18} /> Sign Out
             </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <nav className="flex flex-col">
              <TabButton active={activeTab === 'profile'} onClick={() => navigate('/profile?tab=profile')} icon={<UserIcon size={20} />} label="My Profile" />
              <TabButton active={activeTab === 'orders'} onClick={() => navigate('/profile?tab=orders')} icon={<Package size={20} />} label="Order History" />
              <TabButton active={activeTab === 'wishlist'} onClick={() => navigate('/profile?tab=wishlist')} icon={<Heart size={20} />} label="Wishlist" count={savedItems.length} />
              <TabButton active={activeTab === 'addresses'} onClick={() => navigate('/profile?tab=addresses')} icon={<MapPin size={20} />} label="Address Book" />
              <TabButton active={activeTab === 'payments'} onClick={() => navigate('/profile?tab=payments')} icon={<CreditCard size={20} />} label="Payment Methods" />
              <TabButton active={activeTab === 'listings'} onClick={() => navigate('/profile?tab=listings')} icon={<Tag size={20} />} label="My Listings" />
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
            
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Order History</h3>
                <div className="space-y-6">
                  {MOCK_ORDERS.map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-gray-50 p-4 flex flex-wrap gap-4 justify-between items-center text-sm border-b border-gray-200">
                        <div className="flex gap-6">
                          <div>
                             <span className="block text-gray-500 text-xs uppercase tracking-wider">Order Placed</span>
                             <span className="font-medium text-gray-900">{order.date}</span>
                          </div>
                          <div>
                             <span className="block text-gray-500 text-xs uppercase tracking-wider">Total</span>
                             <span className="font-medium text-gray-900">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                             order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                             order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                             order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
                           }`}>
                             {order.status}
                           </span>
                           <span className="text-gray-500">#{order.id}</span>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 hover:text-brand-600 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h4>
                                <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <button className="text-brand-600 text-sm font-medium hover:underline">Write Review</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
               <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Wishlist</h3>
                {savedItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-500 mb-6">Your wishlist is empty.</p>
                    <button onClick={() => navigate('/')} className="text-brand-600 font-bold hover:underline">Start Shopping</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedItems.map(item => (
                      <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-xl hover:border-black transition-colors">
                         <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                           <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex flex-col justify-between flex-1">
                           <div>
                             <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                             <p className="text-gray-500 text-sm">{item.category}</p>
                             <p className="font-semibold mt-1">${item.price.toFixed(2)}</p>
                           </div>
                           <button 
                             onClick={() => onMoveToCart(item.id)}
                             className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-black transition-colors"
                           >
                             <ShoppingBag size={16} /> Move to Cart
                           </button>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
               </div>
            )}

            {/* --- Addresses Tab --- */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Address Book</h3>
                  {!isEditingAddress && (
                    <button 
                      onClick={() => handleEditAddress()}
                      className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <Plus size={16} /> Add New
                    </button>
                  )}
                </div>

                {isEditingAddress ? (
                  <form onSubmit={handleSaveAddress} className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-w-lg">
                    <h4 className="font-bold text-gray-900 mb-4">{currentAddress.id ? 'Edit Address' : 'Add New Address'}</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address Label</label>
                            <select 
                              value={currentAddress.type} 
                              onChange={e => setCurrentAddress({...currentAddress, type: e.target.value})}
                              className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                            >
                              <option value="Home">Home</option>
                              <option value="Work">Work</option>
                              <option value="Other">Other</option>
                            </select>
                         </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street Address</label>
                        <input 
                          type="text" 
                          value={currentAddress.street || ''}
                          onChange={e => setCurrentAddress({...currentAddress, street: e.target.value})}
                          className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                          <input 
                            type="text" 
                            value={currentAddress.city || ''}
                            onChange={e => setCurrentAddress({...currentAddress, city: e.target.value})}
                            className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">State / Province</label>
                          <input 
                            type="text" 
                            value={currentAddress.state || ''}
                            onChange={e => setCurrentAddress({...currentAddress, state: e.target.value})}
                            className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Zip / Postal Code</label>
                            <input 
                              type="text" 
                              value={currentAddress.zipCode || ''}
                              onChange={e => setCurrentAddress({...currentAddress, zipCode: e.target.value})}
                              className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                              required
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Country</label>
                            <input 
                              type="text" 
                              value={currentAddress.country || 'USA'}
                              onChange={e => setCurrentAddress({...currentAddress, country: e.target.value})}
                              className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                              required
                            />
                         </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <input 
                          type="checkbox" 
                          id="defaultAddr"
                          checked={currentAddress.isDefault || false}
                          onChange={e => setCurrentAddress({...currentAddress, isDefault: e.target.checked})}
                          className="rounded text-black focus:ring-black"
                        />
                        <label htmlFor="defaultAddr" className="text-sm text-gray-700">Set as default shipping address</label>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">Save Address</button>
                        <button type="button" onClick={() => setIsEditingAddress(false)} className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map(addr => (
                      <div key={addr.id} className="border border-gray-200 rounded-xl p-5 hover:border-gray-400 transition-colors relative group">
                        {addr.isDefault && (
                          <span className="absolute top-4 right-4 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <Check size={12} /> Default
                          </span>
                        )}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 bg-gray-50 rounded-lg text-gray-600">
                             <MapPin size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{addr.type}</h4>
                            <p className="text-sm text-gray-500">{addr.street}</p>
                            <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.zipCode}</p>
                            <p className="text-sm text-gray-500">{addr.country}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditAddress(addr)} className="text-sm font-medium text-gray-600 hover:text-black flex items-center gap-1">
                            <Edit2 size={14} /> Edit
                          </button>
                          <button onClick={() => handleDeleteAddress(addr.id)} className="text-sm font-medium text-red-500 hover:text-red-700 ml-auto flex items-center gap-1">
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    {addresses.length === 0 && (
                      <div className="col-span-full text-center py-10 text-gray-500 border border-dashed border-gray-200 rounded-xl">
                        No addresses saved.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* --- Payment Methods Tab --- */}
            {activeTab === 'payments' && (
              <div>
                 <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Payment Methods</h3>
                  {!isEditingPayment && (
                    <button 
                      onClick={() => handleEditPayment()}
                      className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <Plus size={16} /> Add New
                    </button>
                  )}
                </div>

                {isEditingPayment ? (
                   <form onSubmit={handleSavePayment} className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-w-lg">
                    <h4 className="font-bold text-gray-900 mb-4">{currentPayment.id ? 'Edit Card' : 'Add New Card'}</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Holder Name</label>
                        <input 
                          type="text" 
                          value={currentPayment.cardHolder || ''}
                          onChange={e => setCurrentPayment({...currentPayment, cardHolder: e.target.value})}
                          className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="e.g. John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number (Last 4 digits for demo)</label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-2.5 text-gray-400" size={18} />
                          <input 
                            type="text" 
                            maxLength={4}
                            value={currentPayment.last4 || ''}
                            onChange={e => setCurrentPayment({...currentPayment, last4: e.target.value.replace(/\D/g,'')})}
                            className="w-full pl-10 p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="**** **** **** 4242"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry</label>
                            <input 
                              type="text" 
                              placeholder="MM/YY"
                              value={currentPayment.expiry || ''}
                              onChange={e => setCurrentPayment({...currentPayment, expiry: e.target.value})}
                              className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                              required
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Type</label>
                            <select 
                              value={currentPayment.type}
                              onChange={e => setCurrentPayment({...currentPayment, type: e.target.value as any})}
                              className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                            >
                              <option value="Visa">Visa</option>
                              <option value="MasterCard">MasterCard</option>
                              <option value="Amex">Amex</option>
                              <option value="PayPal">PayPal</option>
                            </select>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="defaultPay"
                          checked={currentPayment.isDefault || false}
                          onChange={e => setCurrentPayment({...currentPayment, isDefault: e.target.checked})}
                          className="rounded text-black focus:ring-black"
                        />
                        <label htmlFor="defaultPay" className="text-sm text-gray-700">Set as default payment method</label>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">Save Card</button>
                        <button type="button" onClick={() => setIsEditingPayment(false)} className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {payments.map(pm => (
                      <div key={pm.id} className="border border-gray-200 rounded-xl p-5 hover:border-gray-400 transition-colors relative group bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg">
                        {pm.isDefault && (
                          <span className="absolute top-4 right-4 bg-white/20 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <Check size={12} /> Default
                          </span>
                        )}
                        <div className="flex flex-col h-full justify-between min-h-[140px]">
                           <div className="flex justify-between items-start">
                             <div className="opacity-80">
                               {pm.type === 'Visa' && <span className="font-bold italic text-lg">VISA</span>}
                               {pm.type === 'MasterCard' && <span className="font-bold text-lg">MasterCard</span>}
                               {pm.type === 'Amex' && <span className="font-bold text-lg">AMEX</span>}
                               {pm.type === 'PayPal' && <span className="font-bold text-lg">PayPal</span>}
                             </div>
                           </div>
                           <div className="text-lg tracking-widest font-mono my-4">
                             **** **** **** {pm.last4}
                           </div>
                           <div className="flex justify-between items-end opacity-80 text-sm">
                             <div>
                               <p className="text-[10px] uppercase">Card Holder</p>
                               <p className="font-medium">{pm.cardHolder}</p>
                             </div>
                             <div>
                               <p className="text-[10px] uppercase">Expires</p>
                               <p className="font-medium">{pm.expiry}</p>
                             </div>
                           </div>
                        </div>
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-[1px]">
                          <button onClick={() => handleEditPayment(pm)} className="bg-white text-black p-2 rounded-full hover:scale-110 transition-transform">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeletePayment(pm.id)} className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                     {payments.length === 0 && (
                      <div className="col-span-full text-center py-10 text-gray-500 border border-dashed border-gray-200 rounded-xl">
                        No payment methods saved.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* --- My Listings Tab --- */}
            {activeTab === 'listings' && (
              <div>
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">My Listings</h3>
                    {!isCreatingListing && (
                      <button 
                        onClick={() => setIsCreatingListing(true)}
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        <Plus size={16} /> Create Listing
                      </button>
                    )}
                 </div>

                 {isCreatingListing ? (
                    <form onSubmit={handleCreateListing} className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-w-2xl animate-in fade-in slide-in-from-top-2">
                       <h4 className="font-bold text-gray-900 mb-6">New Product Listing</h4>
                       <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Product Title</label>
                            <input 
                              type="text" 
                              value={newListing.name || ''}
                              onChange={e => setNewListing({...newListing, name: e.target.value})}
                              className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="e.g. Vintage Denim Jacket"
                              required
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price ($)</label>
                                <div className="relative">
                                  <DollarSign size={16} className="absolute left-3 top-2.5 text-gray-400" />
                                  <input 
                                    type="number" 
                                    value={newListing.price || ''}
                                    onChange={e => setNewListing({...newListing, price: Number(e.target.value)})}
                                    className="w-full pl-9 p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    required
                                  />
                                </div>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                <select 
                                   value={newListing.category}
                                   onChange={e => setNewListing({...newListing, category: e.target.value})}
                                   className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                                    <option key={c} value={c}>{c}</option>
                                  ))}
                                </select>
                             </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                            <div className="relative">
                               <ImageIcon size={16} className="absolute left-3 top-2.5 text-gray-400" />
                               <input 
                                 type="url" 
                                 value={newListing.image || ''}
                                 onChange={e => setNewListing({...newListing, image: e.target.value})}
                                 className="w-full pl-9 p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                                 placeholder="https://example.com/image.jpg"
                               />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Leave empty for a random placeholder image</p>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                            <textarea 
                              rows={4}
                              value={newListing.description || ''}
                              onChange={e => setNewListing({...newListing, description: e.target.value})}
                              className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="Describe your item..."
                              required
                            />
                          </div>

                          <div className="flex gap-3 pt-4 border-t border-gray-200">
                             <button type="submit" className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800">Publish Listing</button>
                             <button 
                               type="button" 
                               onClick={() => setIsCreatingListing(false)} 
                               className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
                             >
                               Cancel
                             </button>
                          </div>
                       </div>
                    </form>
                 ) : (
                    <>
                       {listings.length === 0 ? (
                          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                             <Tag size={48} className="mx-auto text-gray-300 mb-4" />
                             <h4 className="font-bold text-gray-900">No active listings</h4>
                             <p className="text-gray-500 mb-6 max-w-sm mx-auto">You haven't listed any items for sale yet. Turn your pre-loved items into cash.</p>
                             <button 
                               onClick={() => setIsCreatingListing(true)}
                               className="text-brand-600 font-bold hover:underline"
                             >
                               Create your first listing
                             </button>
                          </div>
                       ) : (
                          <div className="grid grid-cols-1 gap-4">
                             {listings.map(item => (
                                <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow">
                                   <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                   </div>
                                   <div className="flex flex-col justify-between flex-1">
                                      <div className="flex justify-between items-start">
                                         <div>
                                            <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{item.category}</span>
                                         </div>
                                         <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between items-center mt-2">
                                         <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div> Active
                                         </div>
                                         <div className="flex gap-3">
                                            <button className="text-gray-400 hover:text-black transition-colors" title="Edit">
                                               <Edit2 size={18} />
                                            </button>
                                            <button 
                                              onClick={() => handleDeleteListing(item.id)}
                                              className="text-gray-400 hover:text-red-500 transition-colors" 
                                              title="Delete"
                                            >
                                               <Trash2 size={18} />
                                            </button>
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       )}
                    </>
                 )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input type="text" value={user.name} readOnly className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input type="email" value={user.email} readOnly className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Change Password</label>
                    <input type="password" placeholder="New Password" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none mb-2" />
                    <input type="password" placeholder="Confirm New Password" className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none" />
                  </div>
                  <button className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">Save Changes</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label, count }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, count?: number }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-6 py-4 text-sm font-medium transition-colors border-l-4 ${
      active 
        ? 'bg-gray-50 border-black text-black' 
        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {count !== undefined && count > 0 && (
      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{count}</span>
    )}
  </button>
);