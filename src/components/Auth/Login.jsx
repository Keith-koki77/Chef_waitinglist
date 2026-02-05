import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const ADMIN_EMAIL = "bitebankdesk@gmail.com"; 

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;
            const user = authData.user;

            // 1. Check for Admin first
            if (user.email === ADMIN_EMAIL) {
                return navigate('/admin-approval');
            }

            // 2. Fetch the Role from the public.profiles table
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profileError) throw new Error("Could not verify user role.");

            // 3. Diversified Redirection Logic
            if (profile.role === 'chef') {
                // Check if they have finished onboarding
                const { data: chefRecord } = await supabase
                    .from('chefs')
                    .select('id')
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (chefRecord) {
                    navigate(`/chef/dashboard/${chefRecord.id}`);
                } else {
                    navigate('/chef-onboarding');
                }
            } else {
                // It's a Foodie
                navigate('/foodie-home');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex flex-col items-center justify-center p-6 bg-white font-sans">
            <div className="max-w-md w-full">
                <div className="p-10 rounded-[3.5rem] bg-gray-50 border-2 border-gray-100 shadow-2xl">
                    <header className="mb-10 text-center">
                        <h2 className="text-5xl font-black tracking-tighter italic uppercase leading-none">
                            Welcome <span className="text-[#DD3131]">Back</span>
                        </h2>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-4">
                            Secure Access to your Portal
                        </p>
                    </header>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <input 
                            type="email" placeholder="Email Address" required
                            className="w-full p-5 bg-white rounded-2xl outline-none border border-gray-100 font-bold text-sm focus:ring-2 focus:ring-black"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input 
                            type="password" placeholder="Password" required
                            className="w-full p-5 bg-white rounded-2xl outline-none border border-gray-100 font-bold text-sm focus:ring-2 focus:ring-black"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        
                        {error && (
                            <p className="text-[#DD3131] text-[10px] font-black uppercase text-center bg-red-50 p-3 rounded-xl border border-red-100">
                                {error}
                            </p>
                        )}

                        <button 
                            disabled={loading}
                            className="w-full bg-black text-white py-6 rounded-3xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 hover:bg-[#DD3131] disabled:bg-gray-300 mt-6"
                        >
                            {loading ? "Authenticating..." : "Sign In →"}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <Link to="/auth" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                            Need an account? Join the table
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;