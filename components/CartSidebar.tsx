import React, { useMemo } from 'react';
import { X, Trash2, ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  savedItems: CartItem[];
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onSaveForLater: (id: number) => void;
  onMoveToCart: (id: number) => void;
  onRemoveSavedItem: (id: number) => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  savedItems,
  onRemoveItem, 
  onUpdateQuantity,
  onSaveForLater,
  onMoveToCart,
  onRemoveSavedItem
}) => {
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cartItems]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Shopping Cart ({cartItems.length})</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 && savedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingBagIcon />
              <p className="mt-4">Your cart is empty.</p>
              <button onClick={onClose} className="mt-4 text-brand-600 font-medium hover:underline">Start Shopping</button>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                        <p className="text-gray-500 text-sm">{item.category}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button 
                        onClick={() => onSaveForLater(item.id)}
                        className="text-gray-300 hover:text-brand-600 transition-colors"
                        title="Save for Later"
                      >
                        <Heart size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Saved Items Section */}
              {savedItems.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Saved for Later ({savedItems.length})</h3>
                  <div className="space-y-6">
                    {savedItems.map((item) => (
                      <div key={item.id} className="flex gap-4 opacity-75 hover:opacity-100 transition-opacity">
                        <div className="w-16 h-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden grayscale hover:grayscale-0 transition-all">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm line-clamp-1">{item.name}</h3>
                            <p className="font-semibold text-sm mt-1">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => onMoveToCart(item.id)}
                              className="text-brand-600 text-xs font-semibold hover:underline flex items-center gap-1"
                            >
                              <ShoppingBag size={12} /> Move to Cart
                            </button>
                            <button 
                              onClick={() => onRemoveSavedItem(item.id)}
                              className="text-gray-400 text-xs hover:text-red-500 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mb-6 text-center">Shipping and taxes calculated at checkout.</p>
            <button className="w-full bg-black text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors active:scale-[0.98] transform">
              Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const ShoppingBagIcon = () => (
  <svg 
    className="w-16 h-16 opacity-20"
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);