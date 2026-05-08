import React from 'react';
import { Router, Route } from 'wouter';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import { AuthPage } from './pages/AuthPage';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { AnalyticsTracker } from './components/AnalyticsTracker';

export default function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background">
        <AnalyticsTracker />
        <Navbar />
        
        <main className="flex-1">
          <Route path="/" component={Home} />
          <Route path="/catalogo" component={Catalog} />
          <Route path="/produto/:id" component={ProductDetail} />
          <Route path="/carrinho" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/confirmacao/:orderId" component={OrderConfirmation} />
          
          {user && (
            <>
              <Route path="/perfil" component={Profile} />
              <Route path="/pedidos" component={OrderHistory} />
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <Route path="/admin" component={AdminDashboard} />
              <Route path="/analytics" component={AnalyticsDashboard} />
            </>
          )}

          {!user && (
            <Route path="/auth" component={AuthPage} />
          )}
        </main>

        <Footer />
      </div>
    </Router>
  );
}
