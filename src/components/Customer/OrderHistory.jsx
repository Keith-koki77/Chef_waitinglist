import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { 
  TicketIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // 1. Fetch individual meals (Planned/Ordered)
    const { data: orderData } = await supabase
      .from('planned_meals')
      .select(`
        *,
        meals (name, image_url, price),
        chefs (business_name, location)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // 2. Fetch active subscription plans (In a real sync, we'd have a user_subscriptions table)
    // For now, we'll mock the filter logic for the UI
    setOrders(orderData || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-20">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4">
              Your <span className="text-[#DD3131]">Table</span>
            </h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em] ml-2">
              Order History & Active Plans
            </p>
          </div>

          {/* FILTER TOGGLE */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 w-full bg-gray-50 animate-pulse rounded-[2rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div 
                  key={order.id} 
                  className="group relative bg-white border-2 border-gray-100 hover:border-black rounded-[2.5rem] p-6 transition-all duration-300 flex flex-col md:flex-row items-center gap-8"
                >
                  {/* MEAL IMAGE */}
                  <div className="w-24 h-24 shrink-0 rounded-[1.5rem] overflow-hidden bg-gray-100">
                    <img 
                      src={order.meals?.image_url} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      alt="Meal"
                    />
                  </div>

                  {/* INFO */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                      <h3 className="text-xl font-black uppercase italic tracking-tight text-black">
                        {order.meals?.name}
                      </h3>
                      <span className="hidden md:block text-gray-300">•</span>
                      <p className="text-[10px] font-black text-[#DD3131] uppercase tracking-widest">
                        {order.chefs?.business_name}
                      </p>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-3 h-3" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter">
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TicketIcon className="w-3 h-3" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter">
                          ID: #{order.id.toString().slice(0, 5)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* STATUS & ACTION */}
                  <div className="flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                    <div className="flex-1 md:flex-none">
                      <p className="text-[8px] font-black uppercase text-gray-400 mb-1 tracking-widest">Status</p>
                      <div className={`flex items-center gap-1.5 ${
                        order.payment_status === 'pending' ? 'text-orange-500' : 'text-green-500'
                      }`}>
                        {order.payment_status === 'pending' ? (
                          <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircleIcon className="w-4 h-4" />
                        )}
                        <span className="text-xs font-black uppercase italic">{order.payment_status}</span>
                      </div>
                    </div>

                    <button className="p-4 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-all">
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center border-4 border-dashed border-gray-100 rounded-[4rem]">
                <p className="text-2xl font-black uppercase italic text-gray-200">Your table is empty</p>
                <button className="mt-4 text-[#DD3131] font-black uppercase text-[10px] tracking-widest hover:underline">
                  Go find a kitchen →
                </button>
              </div>
            )}
          </div>
        )}

        {/* SUBSCRIPTION SECTION PREVIEW */}
        <div className="mt-24">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">
            Active <span className="text-[#DD3131]">Subscriptions</span>
          </h2>
          <div className="bg-black rounded-[3rem] p-12 text-white relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-sm font-bold text-gray-400 mb-2">You have no active monthly plans.</p>
                <p className="text-xs font-medium text-gray-500 max-w-md">
                  Subscribe to a chef to get consistent meals and save up to 20% on daily delivery fees.
                </p>
             </div>
             <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-[#DD3131]/20 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;