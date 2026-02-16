import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const ChefOnboarding = () => {
    const [formData, setFormData] = useState({ business_name: '', location: '', bio: '', experience: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            navigate('/login');
            return;
        }

        // Update the chef record created by the SQL trigger
        const { error } = await supabase
            .from('chefs')
            .update({
                business_name: formData.business_name,
                location: formData.location,
                bio: formData.bio,
                years_experience: parseInt(formData.experience) || 0,
            })
            .eq('id', user.id);

        if (error) {
            alert(error.message);
            setLoading(false);
        } else {
            setIsSubmitted(true);
            // Sign out the chef so they are locked until admin approval
            await supabase.auth.signOut();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
            {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="max-w-2xl w-full bg-white p-12 rounded-[4rem] shadow-2xl">
                    <header className="mb-10 text-center">
                        <h2 className="text-5xl font-black uppercase italic tracking-tighter italic">Kitchen <span className="text-[#DD3131]">Setup</span></h2>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-4">Profile your culinary business for review</p>
                    </header>
                    <div className="space-y-5">
                        <input type="text" placeholder="Restaurant / Kitchen Name" required className="w-full p-5 bg-gray-50 rounded-2xl font-bold" onChange={(e) => setFormData({...formData, business_name: e.target.value})} />
                        <input type="text" placeholder="Location (e.g., Kilimani, Nairobi)" required className="w-full p-5 bg-gray-50 rounded-2xl font-bold" onChange={(e) => setFormData({...formData, location: e.target.value})} />
                        <input type="number" placeholder="Years of Professional Experience" required className="w-full p-5 bg-gray-50 rounded-2xl font-bold" onChange={(e) => setFormData({...formData, experience: e.target.value})} />
                        <textarea placeholder="Write a short bio for your customers..." required className="w-full p-5 bg-gray-50 rounded-2xl font-bold h-32" onChange={(e) => setFormData({...formData, bio: e.target.value})} />
                        <button disabled={loading} className="w-full bg-black text-white py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-[#DD3131] transition-all">
                            {loading ? "Saving Profile..." : "Submit for Verification →"}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="max-w-md bg-white p-12 rounded-[4rem] text-center shadow-2xl animate-in zoom-in">
                    <div className="text-7xl mb-6">🏁</div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Application Sent</h2>
                    <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest leading-relaxed mb-10">
                        Your kitchen profile is now with our <span className="text-[#DD3131]">Verification Team</span>. 
                        You will be able to log in once your account is approved.
                    </p>
                    <button onClick={() => navigate('/login')} className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#DD3131] transition-all">
                        Got it, thanks!
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChefOnboarding;