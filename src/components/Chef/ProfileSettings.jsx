import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const ChefSettings = () => {
    const { chefId } = useParams();
    const [bizName, setBizName] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        const fetchChef = async () => {
            const { data } = await supabase.from('chefs').select('*').eq('id', chefId).single();
            if (data) {
                setBizName(data.business_name);
                setLocation(data.location);
            }
        };
        fetchChef();
    }, [chefId]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('chefs').update({ business_name: bizName, location }).eq('id', chefId);
        if (!error) alert("Profile Updated!");
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-4xl font-black uppercase italic mb-8 tracking-tighter">Kitchen <span className="text-[#DD3131]">Settings</span></h2>
            <form onSubmit={handleUpdate} className="space-y-6">
                <input value={bizName} onChange={(e) => setBizName(e.target.value)} className="w-full p-5 rounded-2xl bg-gray-50 font-bold border-none outline-none focus:ring-2 focus:ring-black" placeholder="Business Name" />
                <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-5 rounded-2xl bg-gray-50 font-bold border-none outline-none focus:ring-2 focus:ring-black" placeholder="Location" />
                <button className="w-full py-6 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#DD3131] transition-all">Save Changes</button>
            </form>
        </div>
    );
};

export default ChefSettings;