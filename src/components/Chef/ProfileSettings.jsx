import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const ProfileSettings = () => {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({ business_name: '', bio: '', location: '', phone: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const { data } = await supabase.from('chefs').select('*').eq('user_id', user.id).single();
        if (data) setProfile(data);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        // Update both tables to keep admin panel and dashboard in sync
        await supabase.from('profiles').update({ location: profile.location, phone: profile.phone }).eq('id', user.id);
        const { error } = await supabase.from('chefs').update(profile).eq('user_id', user.id);

        setLoading(false);
        if (!error) alert("Identity Authenticated & Updated.");
    };

    return (
        <form onSubmit={handleUpdate} className="max-w-2xl space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Business Bio</label>
                    <textarea 
                        value={profile.bio} 
                        onChange={e => setProfile({...profile, bio: e.target.value})}
                        className="w-full p-6 bg-gray-50 rounded-[2rem] border-2 border-transparent focus:border-black outline-none font-bold h-40 resize-none"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input 
                        placeholder="Location" 
                        value={profile.location}
                        onChange={e => setProfile({...profile, location: e.target.value})}
                        className="p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-black outline-none font-bold"
                    />
                    <input 
                        placeholder="Phone" 
                        value={profile.phone}
                        onChange={e => setProfile({...profile, phone: e.target.value})}
                        className="p-5 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-black outline-none font-bold"
                    />
                </div>
            </div>
            <button className="w-full py-6 bg-black text-white rounded-3xl font-black uppercase tracking-widest hover:bg-[#DD3131] transition-all">
                {loading ? 'Syncing...' : 'Update Identity Dossier'}
            </button>
        </form>
    );
};

export default ProfileSettings;