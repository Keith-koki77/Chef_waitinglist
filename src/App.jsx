import React, { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

// Layout & Navigation
import Navbar from "./components/Shared/Navbar";
import ProtectedRoute from "./components/Shared/ProtectedRoute";

// Public Pages
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import JoinWaitlist from './components/JoinWaitlist';

// Auth & Gateway
import AuthGateway from "./components/Auth/AuthGateway";
import Login from "./components/Auth/Login";
import Signup from './components/Auth/Signup';

// Chef Pages (The Kitchen)
import ChefOnboarding from './components/Chef/ChefOnboarding';
import ChefDashboard from "./components/Chef/ChefDashboard";
import ChefSettings from "./components/Chef/ChefSettings";
import ChefMenuManager from "./components/Chef/ChefMenuManager"; // ADDED

// Customer Pages (The Table)
import MenuDiscovery from './components/Customer/MenuDiscovery'; 
import FoodieHome from './components/Customer/FoodieHome';      
import ChefPublicProfile from "./components/Customer/ChefPublicProfile"; 
import MealPlanner from "./components/Customer/MealPlanner";
import CustomerProfile from "./components/Customer/CustomerProfile";
import CheckoutSchedule from "./components/Customer/CheckoutSchedule"; 
import OrderHistory from "./components/Customer/OrderHistory"; 
import PaymentSuccess from './components/Customer/PaymentSuccess';

// Admin
import AdminPanel from "./components/Admin/AdminPanel";

// --- ADMIN SECURITY WRAPPER ---
const AdminRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const ADMIN_EMAIL = "bitebankdesk@gmail.com"; 

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };
        checkAdmin();
    }, []);

    if (loading) return null;
    if (!user || user.email !== ADMIN_EMAIL) return <Navigate to="/" replace />;
    return children;
};

const LandingPage = () => (
  <>
    <Hero />
    <div className="text-center py-4 bg-gray-50 border-y border-gray-100">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        Already a partner? <Link to="/login" className="text-black hover:text-[#DD3131] underline decoration-2 underline-offset-4 transition-all">Login here</Link>
      </p>
    </div>
    <HowItWorks />
    <Features />
    <JoinWaitlist />
  </>
);

function App() {
  useEffect(() => {
    document.title = "Qavaeat | The Digital Culinary Market";
  }, []);

  return (
    <div className="antialiased min-h-screen flex flex-col bg-white">
      
      {/* GLOBAL NAVIGATION */}
      <Navbar />

      {/* PAGE CONTENT ROUTER */}
      <main className="flex-grow">
        <Routes>
          {/* --- 1. Public Routes --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthGateway />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/:role" element={<Signup />} />
          
          {/* Marketplace Discovery (Public) */}
          <Route path="/explore" element={<MenuDiscovery />} /> 
          
          {/* Publicly viewable chef profiles */}
          <Route path="/chef/:chefId" element={<ChefPublicProfile />} /> 
          
          {/* --- 2. Protected Chef Universe --- */}
          <Route element={<ProtectedRoute requiredRole="chef" />}>
             <Route path="/chef-onboarding" element={<ChefOnboarding />} />
             <Route path="/chef/dashboard/:chefId" element={<ChefDashboard />} />
             <Route path="/chef/settings/:chefId" element={<ChefSettings />} />
             {/* NEW ROUTE FOR MENU MANAGEMENT */}
             <Route path="/manage-meals" element={<ChefMenuManager />} />
          </Route>

          {/* --- 3. Protected Foodie Universe --- */}
          <Route element={<ProtectedRoute requiredRole="foodie" />}>
            <Route path="/foodie-home" element={<FoodieHome />} />
            <Route path="/plan" element={<MealPlanner />} />
            <Route path="/profile" element={<CustomerProfile />} /> 
            
            <Route path="/checkout/schedule" element={<CheckoutSchedule />} />
            <Route path="/my-table/history" element={<OrderHistory />} />
            
            <Route path="/payment-success" element={<PaymentSuccess />} />
          </Route>

          {/* --- 4. Strict Admin Access --- */}
          <Route 
            path="/admin-approval" 
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* FOOTER SECTION */}
      <footer className="py-24 bg-[#0A0A0A] text-white border-t border-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
            <div>
              <Link to="/" className="text-3xl font-black text-[#DD3131] tracking-tighter italic">QAVAEAT</Link>
              <p className="mt-4 text-xs text-gray-500 font-bold uppercase tracking-widest">Logistics for the Modern Kitchen.</p>
            </div>
            
            <div className="flex justify-center gap-8 text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black">
               <Link to="/explore" className="hover:text-[#DD3131] transition-colors">Market</Link>
               <Link to="/my-table/history" className="hover:text-[#DD3131] transition-colors">History</Link>
               <Link to="/profile" className="hover:text-[#DD3131] transition-colors">Identity</Link>
            </div>

            <div className="md:text-right">
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">© 2026 Qavaeat Platform</p>
              <Link to="/admin-approval" className="text-[9px] text-gray-800 hover:text-[#DD3131] mt-2 block">System Access</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;