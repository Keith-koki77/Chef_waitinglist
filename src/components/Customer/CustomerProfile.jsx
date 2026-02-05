import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const CustomerProfile = () => {
    const [profile, setProfile] = useState({ full_name: '', role: '' });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (data) setProfile(data);
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        const { error } = await supabase
            .from('profiles')
            .update({ full_name: profile.full_name })
            .eq('id', user.id);

        if (!error) alert("Profile updated successfully!");
        setUpdating(false);
    };

    if (loading) return <div className="p-20 text-center font-black uppercase tracking-widest animate-pulse">Loading Identity...</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <header className="mb-12">
                <h1 className="text-6xl font-black uppercase italic tracking-tighter">MY <span className="text-[#DD3131]">PROFILE</span></h1>
                <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mt-2">Member Tier: {profile.role}</p>
            </header>

            <form onSubmit={handleUpdate} className="space-y-6 bg-gray-50 p-10 rounded-[3rem] border-2 border-gray-100">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase ml-4 text-gray-400">Display Name</label>
                    <input 
                        type="text" 
                        value={profile.full_name || ''} 
                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                        className="w-full p-5 bg-white rounded-2xl outline-none font-bold border border-transparent focus:border-black transition-all"
                    />
                </div>

                <div className="space-y-2 opacity-50">
                    <label className="text-[10px] font-black uppercase ml-4 text-gray-400">Account Type (Locked)</label>
                    <input type="text" disabled value={profile.role} className="w-full p-5 bg-gray-200 rounded-2xl font-bold cursor-not-allowed" />
                </div>

                <button 
                    disabled={updating}
                    className="w-full py-6 bg-black text-white rounded-3xl font-black uppercase tracking-widest hover:bg-[#DD3131] transition-all disabled:bg-gray-400"
                >
                    {updating ? 'Updating...' : 'Save Changes →'}
                </button>
            </form>
        </div>
    );
};

export default CustomerProfile;