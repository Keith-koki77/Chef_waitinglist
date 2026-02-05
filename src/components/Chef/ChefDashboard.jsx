import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const ChefDashboard = () => {
    const { chefId } = useParams();
    const [chef, setChef] = useState(null);
    const [mealsCount, setMealsCount] = useState(0);

    useEffect(() => {
        const fetchChefData = async () => {
            const { data } = await supabase.from('chefs').select('*').eq('id', chefId).single();
            setChef(data);
            
            const { count } = await supabase.from('meals').select('*', { count: 'exact', head: true }).eq('chef_id', chefId);
            setMealsCount(count || 0);
        };
        fetchChefData();
    }, [chefId]);

    if (!chef) return <div className="p-20 text-center font-black uppercase tracking-widest">Loading Kitchen...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-end mb-12 border-b-4 border-black pb-8">
                <div>
                    <h1 className="text-6xl font-black uppercase italic tracking-tighter">{chef.business_name}</h1>
                    <p className="text-[#DD3131] font-black uppercase text-sm tracking-widest mt-2">📍 {chef.location}</p>
                </div>
                <div className="flex gap-4">
                    <Link to="/chef/menu" className="bg-black text-white px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-[#DD3131] transition-all">Manage Menu</Link>
                    <Link to={`/chef/settings/${chefId}`} className="border-2 border-black px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest">Settings</Link>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-50 p-10 rounded-[3rem] border-2 border-gray-100">
                    <span className="text-[10px] font-black uppercase text-gray-400">Total Meals</span>
                    <h3 className="text-7xl font-black mt-2">{mealsCount}</h3>
                </div>
                <div className="bg-black text-white p-10 rounded-[3rem]">
                    <span className="text-[10px] font-black uppercase text-gray-500">Active Orders</span>
                    <h3 className="text-7xl font-black mt-2">0</h3>
                </div>
                <div className="bg-[#DD3131] text-white p-10 rounded-[3rem]">
                    <span className="text-[10px] font-black uppercase text-red-200">Revenue</span>
                    <h3 className="text-7xl font-black mt-2">$0</h3>
                </div>
            </div>
        </div>
    );
};

export default ChefDashboard;