import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { CartSidebar } from './components/CartSidebar';
import { AIChatBot } from './components/AIChatBot';
import { HomePage } from './pages/HomePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { Product, CartItem, User } from './types';
import { logout, checkSession } from './services/auth';

// Layout component to wrap common elements like Navbar and Sidebar
const Layout: React.FC<{
  cartCount: number;
  cartItems: CartItem[];
  savedItems: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onRemoveFromCart: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onSaveForLater: (id: number) => void;
  onMoveToCart: (id: number) => void;
  onRemoveSavedItem: (id: number) => void;
  user?: User;
  onLogout: () => void;
  setUser: (user: User | undefined) => void;
}> = ({ 
  cartCount, 
  cartItems, 
  savedItems,
  isCartOpen, 
  setIsCartOpen, 
  onAddToCart,
  onRemoveFromCart, 
  onUpdateQuantity,
  onSaveForLater,
  onMoveToCart,
  onRemoveSavedItem,
  user,
  onLogout,
  setUser
}) => {
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const initSession = async () => {
      const sessionUser = await checkSession();
      if (sessionUser) {
        setUser(sessionUser);
      }
    };
    initSession();
  }, [setUser]);

  const handleLogout = async () => {
    await logout();
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        onLogoClick={() => navigate('/')}
        user={user}
        onLogout={handleLogout}
        onNavigate={navigate}
      />
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage onAddToCart={onAddToCart} />} />
          <Route path="/product/:id" element={<ProductDetailsPage onAddToCart={onAddToCart} />} />
          <Route path="/login" element={<LoginPage onLogin={setUser} />} />
          <Route path="/register" element={<RegisterPage onLogin={setUser} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Protected Routes */}
          {user && (
            <>
              <Route 
                path="/profile" 
                element={
                  <UserProfilePage 
                    user={user} 
                    onLogout={handleLogout} 
                    savedItems={savedItems}
                    onMoveToCart={onMoveToCart}
                  />
                } 
              />
              {user.role === 'admin' && (
                <Route path="/admin" element={<AdminDashboardPage user={user} />} />
              )}
            </>
          )}
        </Routes>
      </main>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        savedItems={savedItems}
        onRemoveItem={onRemoveFromCart}
        onUpdateQuantity={onUpdateQuantity}
        onSaveForLater={onSaveForLater}
        onMoveToCart={onMoveToCart}
        onRemoveSavedItem={onRemoveSavedItem}
      />
      
      <AIChatBot />
    </div>
  );
};

const App: React.FC = () => {
  // Global State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  // Cart Actions
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity: quantity }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleSaveForLater = (id: number) => {
    const itemToSave = cartItems.find(item => item.id === id);
    if (itemToSave) {
      setCartItems(prev => prev.filter(item => item.id !== id));
      setSavedItems(prev => {
        const existing = prev.find(item => item.id === id);
        if (existing) return prev;
        return [...prev, itemToSave];
      });
    }
  };

  const handleMoveToCart = (id: number) => {
    const itemToMove = savedItems.find(item => item.id === id);
    if (itemToMove) {
      setSavedItems(prev => prev.filter(item => item.id !== id));
      handleAddToCart(itemToMove);
    }
  };

  const handleRemoveSavedItem = (id: number) => {
    setSavedItems(prev => prev.filter(item => item.id !== id));
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <HashRouter>
      <Layout 
        cartCount={cartCount}
        cartItems={cartItems}
        savedItems={savedItems}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onSaveForLater={handleSaveForLater}
        onMoveToCart={handleMoveToCart}
        onRemoveSavedItem={handleRemoveSavedItem}
        user={user}
        setUser={setUser}
        onLogout={() => setUser(undefined)}
      />
    </HashRouter>
  );
};

export default App;