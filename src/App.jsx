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

// Customer Pages (The Table)
import FoodieHome from './components/Customer/FoodieHome';
import ChefPublicProfile from "./components/Customer/ChefPublicProfile"; 
import MealPlanner from "./components/Customer/MealPlanner";
import CustomerProfile from "./components/Customer/CustomerProfile";
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
    document.title = "Qavaeat | Effortless Meal Planning";
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
          
          {/* Publicly viewable chef profiles for discovery */}
          <Route path="/explore/:chefId" element={<ChefPublicProfile />} /> 
          
          {/* --- 2. Protected Chef Universe --- */}
          <Route element={<ProtectedRoute requiredRole="chef" />}>
             <Route path="/chef-onboarding" element={<ChefOnboarding />} />
             <Route path="/chef/dashboard/:chefId" element={<ChefDashboard />} />
             <Route path="/chef/settings/:chefId" element={<ChefSettings />} />
          </Route>

          {/* --- 3. Protected Foodie Universe --- */}
          <Route element={<ProtectedRoute requiredRole="foodie" />}>
            <Route path="/foodie-home" element={<FoodieHome />} />
            <Route path="/plan" element={<MealPlanner />} />
            <Route path="/profile" element={<CustomerProfile />} />
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
      <footer className="py-16 bg-[#0A0A0A] text-white border-t border-gray-900">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
          <Link to="/" className="text-2xl font-black text-[#DD3131] tracking-tighter italic mb-4">QAVAEAT</Link>
          <p className="text-sm text-gray-500 font-medium">© 2026 Qavaeat. Empowering local kitchens.</p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-[10px] text-gray-400 uppercase tracking-widest font-black">
             <Link to="/foodie-home" className="hover:text-white transition-colors">Find Food</Link>
             <Link to="/auth" className="hover:text-white transition-colors">Become a Chef</Link>
             <Link to="/login" className="text-[#DD3131] hover:text-red-400">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;