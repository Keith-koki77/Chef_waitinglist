import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { animate, stagger } from 'animejs';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [chefData, setChefData] = useState({ id: null, is_approved: false });
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef(null);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    animate({
      targets: navRef.current,
      opacity: [0, 1],
      translateY: [-20, 0],
      duration: 800,
      easing: 'easeOutExpo',
    });

    animate({
      targets: navRef.current?.querySelectorAll('.nav-item'),
      opacity: [0, 1],
      translateY: [-10, 0],
      duration: 600,
      easing: 'easeOutExpo',
      delay: stagger(50, { start: 300 }),
    });
  }, []);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav 
      ref={navRef} 
      className={`px-8 py-4 flex justify-between items-center sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'clay-card bg-off-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/90 backdrop-blur'
      }`}
    >
      
      {/* LOGO */}
      <Link to="/" className="text-2xl font-extrabold tracking-tight italic text-q-dark nav-item">
        QAVA<span className="text-primary">EAT</span>
      </Link>

      {/* NAV LINKS */}
      <div className="flex items-center gap-4">
        
        {/* PUBLIC EXPLORE */}
        {role !== 'chef' && (
          <Link to="/explore" className="nav-item clay-button text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-primary px-4 py-2">
            Explore Kitchens
          </Link>
        )}

        {/* GUEST VIEW */}
        {!user && (
          <>
            <Link to="/auth" className="nav-item clay-button text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-primary px-4 py-2">
              Join as Chef
            </Link>
            <Link to="/login" className="nav-item clay-button bg-primary text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700">
              Login
            </Link>
          </>
        )}

        {/* FOODIE VIEW */}
        {user && role === 'foodie' && (
          <>
            <Link to="/plan" className="nav-item clay-button text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 hover:text-primary px-4 py-2">
              My Table
            </Link>
            <Link to="/profile" className="nav-item clay-button px-6 py-2.5 rounded-2xl text-q-dark text-[10px] font-black uppercase tracking-widest hover:bg-accent/50">
              Settings
            </Link>
          </>
        )}

        {/* CHEF VIEW */}
        {user && role === 'chef' && (
          <div className="flex items-center gap-4">
            {!chefData.is_approved ? (
              <div className="nav-item clay-card bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black text-primary uppercase tracking-tighter ml-2">
                  Pending Admin Approval
                </span>
              </div>
            ) : (
              <>
                <Link to={`/chef/dashboard/${chefData.id}`} className="nav-item clay-button text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 hover:text-primary px-4 py-2">
                  Dashboard
                </Link>

                <Link to="/manage-meals" className="nav-item clay-button text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 hover:text-primary px-4 py-2">
                  Manage Menu
                </Link>

                <Link 
                  to={`/chef/settings/${chefData.id}`} 
                  className="nav-item clay-button bg-q-dark text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary"
                >
                  Kitchen Settings
                </Link>
              </>
            )}
          </div>
        )}

        {/* LOGOUT */}
        {user && (
          <button onClick={handleLogout} className="nav-item clay-button text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary px-4 py-2 border-l border-gray-200 ml-2">
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;