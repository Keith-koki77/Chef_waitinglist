import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const AdminPanel = () => {
    const [pendingChefs, setPendingChefs] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalRevenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Chefs awaiting approval
            const { data: chefs, error: chefError } = await supabase
                .from('chefs')
                .select('*')
                .eq('is_approved', false)
                .order('created_at', { ascending: false });

            if (chefError) throw chefError;

            // 2. Fetch Total User Count
            const { count: userCount, error: userError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            if (userError) throw userError;

            // 3. Fetch System Revenue (Sum of amount_paid from orders)
            const { data: orders, error: orderError } = await supabase
                .from('orders')
                .select('amount_paid');

            if (orderError) throw orderError;

            const revenue = orders?.reduce((acc, curr) => acc + Number(curr.amount_paid || 0), 0) || 0;

            setPendingChefs(chefs || []);
            setStats({ totalUsers: userCount || 0, totalRevenue: revenue });
        } catch (error) {
            console.error("Admin Data Fetch Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const approveChef = async (chefId) => {
        const { error } = await supabase
            .from('chefs')
            .update({ is_approved: true })
            .eq('id', chefId);
        
        if (error) {
            alert("Error approving chef: " + error.message);
        } else {
            alert("KITCHEN AUTHORIZED: Chef is now live in the ecosystem.");
            // Filter out the approved chef from local state immediately for snappy UI
            setPendingChefs(prev => prev.filter(c => c.id !== chefId));
            // Refresh stats to reflect any changes if necessary
            fetchAdminData();
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-8 border-gray-100 border-t-black rounded-full animate-spin"></div>
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Accessing Command Center...</p>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen">
            <header className="mb-12 border-b-8 border-black pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none">COMMAND <span className="text-[#DD3131]">CENTER</span></h1>
                    <p className="text-gray-400 font-black uppercase text-xs tracking-[0.5em] mt-4">Qavaeat Ecosystem Authority</p>
                </div>
                <div className="text-right bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Total System Volume</p>
                    <h2 className="text-5xl font-black tracking-tighter text-black">
                        ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h2>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <div className="bg-black text-white p-10 rounded-[3rem] shadow-xl">
                    <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Total Profiles</p>
                    <h3 className="text-6xl font-black mt-2 tracking-tighter">{stats.totalUsers}</h3>
                </div>
                <div className="bg-white border-4 border-black p-10 rounded-[3rem]">
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Pending Approvals</p>
                    <h3 className="text-6xl font-black mt-2 tracking-tighter text-[#DD3131]">{pendingChefs.length}</h3>
                </div>
                {/* Visual Filler for Admin aesthetic */}
                <div className="lg:col-span-2 bg-[#DD3131] p-10 rounded-[3rem] flex items-center justify-center text-white italic font-black text-2xl uppercase text-center leading-tight">
                    "Decentralizing the Kitchen, One Verification at a Time."
                </div>
            </div>

            <section>
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Pending <span className="text-[#DD3131]">Applications</span></h2>
                    <button onClick={fetchAdminData} className="text-[10px] font-black uppercase border-b-2 border-black pb-1 hover:text-[#DD3131] transition-colors">Refresh Feed</button>
                </div>

                {pendingChefs.length === 0 ? (
                    <div className="p-24 bg-gray-50 rounded-[4rem] text-center border-4 border-dashed border-gray-200">
                        <p className="font-black uppercase text-gray-300 tracking-[0.3em] text-xl">All Kitchens Operational</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {pendingChefs.map(chef => (
                            <div key={chef.id} className="group flex flex-col md:flex-row justify-between items-center p-10 bg-white border-2 border-gray-100 rounded-[3rem] hover:border-black transition-all duration-500 shadow-sm hover:shadow-2xl">
                                <div className="max-w-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-3xl font-black uppercase italic tracking-tight">{chef.business_name}</h4>
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Awaiting Review</span>
                                    </div>
                                    <p className="text-[#DD3131] font-black text-[10px] uppercase tracking-widest flex items-center gap-1 mb-4">
                                        📍 {chef.location}
                                    </p>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed italic border-l-4 border-gray-100 pl-4">
                                        "{chef.bio || "No bio submitted."}"
                                    </p>
                                </div>
                                <div className="mt-8 md:mt-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                    <button 
                                        onClick={() => approveChef(chef.id)}
                                        className="bg-black text-white px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-green-600 transition-all hover:scale-105"
                                    >
                                        Approve Kitchen
                                    </button>
                                    <button className="border-2 border-gray-100 text-gray-400 px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:border-red-500 hover:text-red-500 transition-all">
                                        Deny
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminPanel;