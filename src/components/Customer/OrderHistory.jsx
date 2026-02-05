import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('meal_plans')
                .select(`
                    id, 
                    scheduled_date, 
                    slot,
                    status,
                    meals (name, price),
                    chefs (business_name)
                `)
                .eq('foodie_id', user.id)
                .order('scheduled_date', { ascending: false });

            if (!error) setOrders(data);
            setLoading(false);
        };
        fetchOrders();
    }, []);

    // Quick stats calculation
    const totalSpent = orders.reduce((sum, order) => sum + (order.meals?.price || 0), 0);
    const mealsEaten = orders.filter(o => o.status === 'completed').length;

    if (loading) return <div className="p-20 text-center font-black animate-pulse text-gray-400">LOADING JOURNAL...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 md:p-12 min-h-screen">
            {/* STATS HEADER */}
            <header className="mb-16 border-b-8 border-black pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-[0.8]">Food<br/>Journal</h2>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-4">Archive of your culinary journey</p>
                </div>
                <div className="flex gap-8">
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase text-gray-400">Total Spent</p>
                        <p className="text-2xl font-black italic">KES {totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase text-[#DD3131]">Completed</p>
                        <p className="text-2xl font-black italic">{mealsEaten} Meals</p>
                    </div>
                </div>
            </header>

            {/* JOURNAL ENTRIES */}
            {orders.length === 0 ? (
                <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
                    <span className="text-6xl block mb-4">📭</span>
                    <p className="font-black uppercase text-gray-300 italic">No history yet. Start your plan today.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div 
                            key={order.id} 
                            className="group relative bg-white border-2 border-gray-100 p-6 rounded-3xl hover:border-black transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-6">
                                <div className="text-center bg-gray-50 p-3 rounded-2xl min-w-[80px] group-hover:bg-black group-hover:text-white transition-colors">
                                    <p className="text-[8px] font-black uppercase tracking-tighter mb-1">
                                        {new Date(order.scheduled_date).toLocaleDateString('en-US', { month: 'short' })}
                                    </p>
                                    <p className="text-2xl font-black leading-none">
                                        {new Date(order.scheduled_date).getDate()}
                                    </p>
                                </div>
                                
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black uppercase text-[#DD3131] tracking-widest">{order.slot}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.chefs?.business_name}</span>
                                    </div>
                                    <h3 className="text-xl font-black uppercase tracking-tight italic leading-tight">
                                        {order.meals?.name}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0">
                                <div className="text-left md:text-right">
                                    <p className="text-[9px] font-black text-gray-400 uppercase">Amount Paid</p>
                                    <p className="font-black">KES {order.meals?.price}</p>
                                </div>
                                <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                    order.status === 'completed' 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-yellow-100 text-yellow-600'
                                }`}>
                                    {order.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* FOOTER ACTION */}
            <div className="mt-20 text-center">
                <button 
                    onClick={() => window.print()} 
                    className="text-[10px] font-black uppercase tracking-[0.2em] border-2 border-black px-8 py-4 rounded-full hover:bg-black hover:text-white transition-all"
                >
                    Download Receipt PDF
                </button>
            </div>
        </div>
    );
};

export default OrderHistory;