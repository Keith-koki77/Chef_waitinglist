import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { TrashIcon, ShoppingBagIcon, SparklesIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const MealPlanner = () => {
  const [orders, setOrders] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserActivity = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // We explicitly map the relationships using the column names: meal_id and chef_id
      const { data, error } = await supabase
        .from('planned_meals')
        .select(`
          id,
          created_at,
          meals:meal_id (
            name, 
            price, 
            image_url
          ),
          chefs:chef_id (
            business_name
          )
        `)
        .eq('user_id', user.id)
        .eq('payment_status', 'pending') // Matches the fixed typo in ChefPublicProfile
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setOrders(data);
        const spent = data.reduce((acc, curr) => acc + (curr.meals?.price || 0), 0);
        setTotalSpent(spent);
      }
    } catch (error) {
      console.error("Error fetching table:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserActivity();
  }, []);

  const removeFromTable = async (planId) => {
    const { error } = await supabase
      .from('planned_meals')
      .delete()
      .eq('id', planId);

    if (!error) {
      const updatedOrders = orders.filter((o) => o.id !== planId);
      setOrders(updatedOrders);
      setTotalSpent(updatedOrders.reduce((acc, curr) => acc + (curr.meals?.price || 0), 0));
    } else {
      alert("Could not remove item. Please try again.");
    }
  };

  const proceedToScheduling = () => {
    if (orders.length === 0) {
      alert("Add some meals to your table first!");
      return;
    }
    navigate('/checkout/schedule');
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-gray-100 border-t-[#DD3131] rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-xl">🍽️</div>
        </div>
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Setting Your Table</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <SparklesIcon className="w-5 h-5 text-[#F4CD2E]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Curated Selection</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
              My <span className="text-[#DD3131]">Table</span>
            </h1>
          </div>

          <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-2xl min-w-[280px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#DD3131]/20 to-transparent" />
            <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Total Investment</p>
            <h2 className="relative z-10 text-5xl font-black italic tracking-tighter">
              <span className="text-lg font-bold mr-1">KSH</span>
              {totalSpent.toLocaleString()}
            </h2>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* MEALS LISTING */}
          <div className="lg:col-span-8 space-y-8">
            {orders.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-100 rounded-[3rem] p-20 text-center shadow-sm">
                <div className="text-5xl mb-6">🥘</div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Your table is quiet</h3>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-8 leading-loose">
                  Browse kitchens to add signature meals to your plan
                </p>
                <button 
                   onClick={() => navigate('/explore')}
                   className="bg-black text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#DD3131] transition-colors"
                >
                  Explore Now
                </button>
              </div>
            ) : (
              orders.map((order) => (
                <div 
                  key={order.id} 
                  className="group relative bg-white rounded-[2.5rem] p-6 flex flex-col md:flex-row items-center gap-8 border-2 border-transparent hover:border-black transition-all duration-500 shadow-sm"
                >
                  <div className="w-full md:w-32 h-32 rounded-[1.5rem] overflow-hidden bg-gray-50 shrink-0">
                    <img 
                      src={order.meals?.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={order.meals?.name}
                    />
                  </div>

                  <div className="flex-grow text-center md:text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#DD3131] mb-1">
                      {order.chefs?.business_name || 'Signature Kitchen'}
                    </p>
                    <h4 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-2 group-hover:text-[#DD3131] transition-colors">
                      {order.meals?.name}
                    </h4>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                       <span className="bg-gray-50 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest text-gray-500">
                         KSH {order.meals?.price}
                       </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromTable(order.id)}
                    className="p-4 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-[#DD3131] transition-all group/trash"
                  >
                    <TrashIcon className="w-6 h-6 group-hover/trash:scale-110 transition-transform" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* CHECKOUT SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border-2 border-gray-50 sticky top-32">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-10 pb-6 border-b border-gray-50">
                Plan <span className="text-[#DD3131]">Summary</span>
              </h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dishes Reserved</span>
                  <span className="text-xl font-black italic">{orders.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600 bg-yellow-50 px-2 py-1 rounded">Needs Schedule</span>
                </div>

                <div className="pt-6 border-t border-gray-50">
                  <div className="flex justify-between items-center mb-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Grand Total</span>
                    <span className="text-xl font-black italic">
                      KSH {totalSpent.toLocaleString()}
                    </span>
                  </div>

                  <button 
                    onClick={proceedToScheduling}
                    className="w-full bg-black text-white py-6 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-[#DD3131] transition-all shadow-2xl shadow-black/10 active:scale-95 group"
                  >
                    <ShoppingBagIcon className="w-5 h-5" />
                    Complete Booking
                    <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MealPlanner;