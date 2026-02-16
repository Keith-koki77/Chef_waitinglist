import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [chefData, setChefData] = useState({ id: null, is_approved: false });
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleUserChange(session?.user ?? null);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      handleUserChange(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserChange = async (currentUser) => {
    setUser(currentUser);

    if (!currentUser) {
      setRole(null);
      setChefData({ id: null, is_approved: false });
      return;
    }

    const userRole = currentUser.user_metadata?.role;
    setRole(userRole);

    if (userRole === 'chef') {
      const { data: chef } = await supabase
        .from('chefs')
        .select('id, is_approved')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (chef) {
        setChefData({ id: chef.id, is_approved: chef.is_approved });
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="px-8 py-5 flex justify-between items-center bg-white/90 backdrop-blur sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      
      {/* LOGO */}
      <Link to="/" className="text-2xl font-extrabold tracking-tight italic text-gray-800">
        QAVA<span className="text-[#DD3131]">EAT</span>
      </Link>

      {/* NAV LINKS */}
      <div className="flex items-center gap-6">
        
        {/* PUBLIC EXPLORE */}
        {role !== 'chef' && (
          <Link to="/explore" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-[#DD3131] transition">
            Explore Kitchens
          </Link>
        )}

        {/* GUEST VIEW */}
        {!user && (
          <>
            <Link to="/auth" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-[#DD3131]">
              Join as Chef
            </Link>
            <Link to="/login" className="bg-black text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#DD3131] transition shadow-md">
              Login
            </Link>
          </>
        )}

        {/* FOODIE VIEW */}
        {user && role === 'foodie' && (
          <>
            <Link to="/plan" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 hover:text-[#DD3131]">
              My Table
            </Link>
            <Link to="/profile" className="px-6 py-3 rounded-2xl bg-gray-100 text-black text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition">
              Settings
            </Link>
          </>
        )}

        {/* CHEF VIEW */}
        {user && role === 'chef' && (
          <div className="flex items-center gap-6">
            {!chefData.is_approved ? (
              <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                <span className="w-2 h-2 bg-[#DD3131] rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black text-[#DD3131] uppercase tracking-tighter">
                  Pending Admin Approval
                </span>
              </div>
            ) : (
              <>
                <Link to={`/chef/dashboard/${chefData.id}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 hover:text-[#DD3131]">
                  Dashboard
                </Link>

                <Link to="/manage-meals" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 hover:text-[#DD3131]">
                  Manage Menu
                </Link>

                {/* UPDATED: Direct link to the dedicated Settings page */}
                <Link 
                  to={`/chef/settings/${chefData.id}`} 
                  className="bg-black text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#DD3131] transition shadow-lg"
                >
                  Kitchen Settings
                </Link>
              </>
            )}
          </div>
        )}

        {/* LOGOUT */}
        {user && (
          <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#DD3131] transition border-l border-gray-200 pl-6 ml-2">
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;