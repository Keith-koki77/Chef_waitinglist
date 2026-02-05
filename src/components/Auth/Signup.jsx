import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const Signup = () => {
    const { role } = useParams(); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const navigate = useNavigate();

    // Force role to be either 'chef' or 'foodie'
    const finalRole = role === 'chef' ? 'chef' : 'foodie';

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: finalRole // CRITICAL: This fuels the DB Trigger
                },
                emailRedirectTo: `${window.location.origin}/login`
            }
        });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        } else {
            setIsSuccess(true);
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center p-6">
                <div className="max-w-md w-full p-12 rounded-[3.5rem] bg-white border-2 border-black text-center shadow-2xl">
                    <div className="text-6xl mb-6">📩</div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Check Your Email</h2>
                    <p className="text-gray-500 font-bold text-sm uppercase leading-relaxed mb-8">
                        Verification link sent to <span className="text-black">{email}</span>. 
                        Verify to activate your <span className="text-[#DD3131]">{finalRole}</span> account.
                    </p>
                    <button 
                        onClick={() => navigate('/login')}
                        className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#DD3131] transition-all"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[90vh] flex items-center justify-center p-6">
            <div className={`max-w-md w-full p-12 rounded-[3.5rem] transition-all duration-500 ${finalRole === 'chef' ? 'bg-black text-white' : 'bg-gray-50 text-black border-2 border-gray-100'}`}>
                <header className="mb-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50">Registration</span>
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter mt-2 leading-none">
                        Join as a <br />
                        <span className="text-[#DD3131]">{finalRole}</span>
                    </h2>
                </header>

                <form onSubmit={handleSignup} className="space-y-4">
                    <input 
                        type="text" placeholder="Full Name" required
                        className="w-full p-5 rounded-2xl bg-white text-black font-bold outline-none focus:ring-4 focus:ring-[#DD3131]/20"
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <input 
                        type="email" placeholder="Email Address" required
                        className="w-full p-5 rounded-2xl bg-white text-black font-bold outline-none focus:ring-4 focus:ring-[#DD3131]/20"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" placeholder="Password (min 6 chars)" required
                        className="w-full p-5 rounded-2xl bg-white text-black font-bold outline-none focus:ring-4 focus:ring-[#DD3131]/20"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {errorMsg && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-[#DD3131] text-[10px] font-black uppercase text-center">
                            {errorMsg}
                        </div>
                    )}

                    <button 
                        disabled={loading}
                        className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest mt-6 transition-all active:scale-95 shadow-xl ${finalRole === 'chef' ? 'bg-[#DD3131] text-white hover:bg-white hover:text-black' : 'bg-black text-white hover:bg-[#DD3131]'}`}
                    >
                        {loading ? 'Processing...' : 'Create Account →'}
                    </button>
                </form>

                <div className="mt-8 text-center opacity-50">
                    <Link to="/login" className="text-[10px] font-black uppercase tracking-widest hover:opacity-100">
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;