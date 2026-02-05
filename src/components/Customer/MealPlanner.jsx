import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const MealPlanner = () => {
    const [orders, setOrders] = useState([]);
    const [totalSpent, setTotalSpent] = useState(0);

    useEffect(() => {
        const fetchUserActivity = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            
            // Assuming an 'orders' table exists with price and meal details
            const { data } = await supabase
                .from('orders')
                .select('*, meals(name, price)')
                .eq('user_id', user.id);

            if (data) {
                setOrders(data);
                const spent = data.reduce((acc, curr) => acc + (curr.meals?.price || 0), 0);
                setTotalSpent(spent);
            }
        };
        fetchUserActivity();
    }, []);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="flex justify-between items-end mb-12 border-b-4 border-black pb-8">
                <div>
                    <h1 className="text-6xl font-black uppercase italic tracking-tighter">MY <span className="text-[#DD3131]">TABLE</span></h1>
                    <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] mt-2">Activity & Expenditure</p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black uppercase text-gray-400">Total Investment</span>
                    <h2 className="text-5xl font-black">${totalSpent.toFixed(2)}</h2>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-black uppercase tracking-widest">Upcoming Meals</h3>
                    {orders.length === 0 ? (
                        <div className="p-12 border-4 border-dashed border-gray-100 rounded-[3rem] text-center text-gray-300 font-bold uppercase">
                            No active orders. Start exploring!
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="flex items-center justify-between p-8 bg-white border-2 border-gray-100 rounded-[2.5rem]">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                                    <h4 className="text-xl font-black uppercase">{order.meals?.name}</h4>
                                </div>
                                <span className="bg-green-100 text-green-600 px-4 py-2 rounded-full font-black text-[10px] uppercase">Active</span>
                            </div>
                        ))
                    )}
                </div>

                <div className="bg-gray-50 p-10 rounded-[3rem] h-fit">
                    <h3 className="text-xl font-black uppercase tracking-widest mb-6">Weekly Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500 font-bold uppercase text-xs">Orders this month</span>
                            <span className="font-black">{orders.length}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500 font-bold uppercase text-xs">Avg per meal</span>
                            <span className="font-black">${orders.length > 0 ? (totalSpent / orders.length).toFixed(2) : '0.00'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealPlanner;