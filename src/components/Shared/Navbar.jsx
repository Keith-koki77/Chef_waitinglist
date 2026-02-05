import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [chefId, setChefId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Get initial session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            handleUserChange(session?.user ?? null);
        };

        getSession();

        // 2. Listen for auth changes (Login/Logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            handleUserChange(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleUserChange = async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
            // Fetch profile to get role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', currentUser.id)
                .single();
            
            setRole(profile?.role);

            // If Chef, get their business ID for the dashboard link
            if (profile?.role === 'chef') {
                const { data: chef } = await supabase
                    .from('chefs')
                    .select('id')
                    .eq('user_id', currentUser.id)
                    .maybeSingle();
                setChefId(chef?.id);
            }
        } else {
            setRole(null);
            setChefId(null);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <nav className="px-8 py-6 flex justify-between items-center bg-white sticky top-0 z-50 border-b border-gray-50">
            <Link to="/" className="text-2xl font-black text-black tracking-tighter italic">
                QAVA<span className="text-[#DD3131]">EAT</span>
            </Link>

            <div className="flex items-center gap-8">
                {/* PUBLIC LINKS */}
                {!user && (
                    <>
                        <Link to="/auth" className="text-[10px] font-black uppercase tracking-widest hover:text-[#DD3131]">Join the Revolution</Link>
                        <Link to="/login" className="bg-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#DD3131] transition-all">Login</Link>
                    </>
                )}

                {/* FOODIE LINKS */}
                {user && role === 'foodie' && (
                    <>
                        <Link to="/foodie-home" className="text-[10px] font-black uppercase tracking-widest">Find Food</Link>
                        <Link to="/plan" className="text-[10px] font-black uppercase tracking-widest">My Table</Link>
                        <Link to="/profile" className="text-[10px] font-black uppercase tracking-widest">Profile</Link>
                    </>
                )}

                {/* CHEF LINKS */}
                {user && role === 'chef' && (
                    <>
                        {chefId ? (
                            <Link to={`/chef/dashboard/${chefId}`} className="text-[10px] font-black uppercase tracking-widest">Dashboard</Link>
                        ) : (
                            <Link to="/chef-onboarding" className="text-[10px] font-black uppercase tracking-widest text-[#DD3131]">Complete Setup</Link>
                        )}
                        <Link to="/chef/menu" className="text-[10px] font-black uppercase tracking-widest">Menu</Link>
                        <Link to={chefId ? `/chef/settings/${chefId}` : "#"} className="text-[10px] font-black uppercase tracking-widest">Settings</Link>
                    </>
                )}

                {user && (
                    <button 
                        onClick={handleLogout}
                        className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black"
                    >
                        Sign Out
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;