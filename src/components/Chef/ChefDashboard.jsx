import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { 
  PlusIcon, CurrencyDollarIcon, CakeIcon, RocketLaunchIcon,
  PhoneIcon, ChatBubbleLeftRightIcon, MapPinIcon, ClockIcon,
  CalendarDaysIcon, ArrowTopRightOnSquareIcon, ShieldCheckIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const ChefDashboard = () => {
  const { chefId } = useParams();
  const navigate = useNavigate();

  const [chef, setChef] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ meals: 0, revenue: 0, activeOrders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chefId) fetchDashboardData();
  }, [chefId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: chefData, error: chefError } = await supabase
        .from('chefs').select('*').eq('id', chefId).maybeSingle();
      
      if (chefError) throw chefError;
      setChef(chefData);

      if (!chefData?.is_approved) {
        setLoading(false);
        return; 
      }

      const { data: orderData, error: orderError } = await supabase
        .from('planned_meals')
        .select(`
          id, scheduled_day, scheduled_time, payment_status, week_number,
          meals!meal_id (name, price),
          profiles!planned_meals_user_id_fkey (full_name, phone, location)
        `)
        .eq('chef_id', chefId).eq('payment_status', 'paid') 
        .order('created_at', { ascending: false });

      if (orderError) {
        console.error("Manifest Error:", orderError.message);
        setOrders([]);
      } else {
        setOrders(orderData || []);
      }

      const { count: mealsCount } = await supabase
        .from('meals').select('*', { count: 'exact', head: true }).eq('chef_id', chefId);

      const totalRev = orderData?.reduce((acc, curr) => acc + Number(curr.meals?.price || 0), 0) || 0;

      setStats({ 
        meals: mealsCount || 0, 
        revenue: totalRev,
        activeOrders: orderData?.length || 0 
      });

    } catch (err) {
      console.error("Dashboard Load Failure:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#DD3131] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-black italic uppercase tracking-[0.3em] animate-pulse">Establishing Dispatch...</p>
      </div>
    </div>
  );

  if (chef && !chef.is_approved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-2xl w-full p-16 rounded-[4rem] bg-white text-center shadow-2xl border-t-[12px] border-black">
          <ShieldCheckIcon className="w-24 h-24 text-gray-200 mx-auto mb-8" />
          <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4 text-black">Authorization <span className="text-[#DD3131]">Pending</span></h2>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest leading-loose mb-10 px-10 text-black">
            The Qavaeat Authority is reviewing your kitchen dossier. Once authenticated, your command center will activate.
          </p>
          <button onClick={() => navigate('/')} className="px-12 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#DD3131] transition-all">Return to Base</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Manifest Connected
        </div>
        <Link to={`/chef/${chefId}`} className="text-[#DD3131] hover:underline flex items-center gap-1">
          Live Menu <ArrowTopRightOnSquareIcon className="w-3 h-3"/>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="relative bg-black rounded-[3rem] p-10 md:p-16 overflow-hidden mb-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#DD3131]/10 to-transparent" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-32 h-32 rounded-[2.5rem] border-4 border-[#DD3131] overflow-hidden rotate-3 shadow-2xl shrink-0 bg-gray-800">
              <img src={chef?.profile_photo_url || 'https://images.unsplash.com/photo-1577214233011-061007bb468b?auto=format&fit=crop&w=500'} className="w-full h-full object-cover" alt="Chef" />
            </div>
            <div className="text-center md:text-left text-white">
              <p className="text-[#DD3131] font-black uppercase text-[10px] tracking-[0.5em] mb-3">Chef Command</p>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">{chef?.business_name || 'Kitchen Dashboard'}</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <StatCard icon={<CurrencyDollarIcon className="w-32 h-32 rotate-12" />} label="Gross Revenue" value={stats.revenue.toLocaleString()} unit="KSH" color="text-black" />
          <StatCard icon={<CakeIcon className="w-32 h-32 -rotate-12" />} label="Dish Count" value={stats.meals} color="text-[#DD3131]" />
          <div className="bg-[#DD3131] p-8 rounded-[3rem] shadow-xl relative overflow-hidden text-white flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Paid Orders</p>
            <h3 className="text-7xl font-black italic mt-2 tracking-tighter">{stats.activeOrders}</h3>
          </div>
        </div>

        {/* MANIFEST TABLE */}
        <div className="bg-white rounded-[3.5rem] p-8 md:p-12 shadow-sm border-2 border-gray-100 mb-12">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-black">Production <span className="text-[#DD3131]">Manifest</span></h2>
            <button onClick={fetchDashboardData} className="p-3 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all text-black"><RocketLaunchIcon className="w-5 h-5" /></button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100 uppercase text-[10px] font-black text-gray-400 tracking-widest">
                  <th className="pb-6">Customer</th>
                  <th className="pb-6">Item</th>
                  <th className="pb-6">Schedule</th>
                  <th className="pb-6 text-right">Logistics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-black">
                {orders.length === 0 ? (
                  <tr><td colSpan="4" className="py-20 text-center font-black italic text-gray-300">No active orders in manifest</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-gray-50/50">
                      <td className="py-8">
                        <span className="font-black text-xl uppercase italic block">{order.profiles?.full_name || 'Guest User'}</span>
                        <div className="flex gap-2 mt-2">
                          <a href={`tel:${order.profiles?.phone}`} className="p-2 border rounded-lg hover:border-black"><PhoneIcon className="w-4 h-4 text-green-500"/></a>
                          <a href={`https://wa.me/${order.profiles?.phone}`} target="_blank" className="p-2 border rounded-lg hover:border-black"><ChatBubbleLeftRightIcon className="w-4 h-4 text-blue-500"/></a>
                        </div>
                      </td>
                      <td className="py-8">
                        <p className="font-black italic uppercase text-lg">{order.meals?.name || 'Deleted Meal'}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">KSH {order.meals?.price || 0}</p>
                      </td>
                      <td className="py-8">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase"><CalendarDaysIcon className="w-4 h-4 text-[#DD3131]"/> {order.scheduled_day}</div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase mt-1"><ClockIcon className="w-4 h-4"/> {order.scheduled_time}</div>
                      </td>
                      <td className="py-8 text-right">
                        <div className="flex items-start justify-end gap-2">
                          <p className="text-[10px] font-bold uppercase italic text-gray-500 text-right max-w-[150px]">{order.profiles?.location}</p>
                          <MapPinIcon className="w-4 h-4 text-[#DD3131] shrink-0"/>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <Link to="/manage-meals" className="bg-black text-white px-10 py-6 rounded-[2rem] flex items-center gap-4 hover:bg-[#DD3131] transition-all shadow-2xl w-full md:w-auto">
            <PlusIcon className="w-6 h-6" /> <span className="text-[10px] font-black uppercase tracking-[0.2em]">Manage Menu</span>
          </Link>
          <Link to={`/chef/settings/${chefId}`} className="bg-white border-2 border-gray-100 text-black px-10 py-6 rounded-[2rem] flex items-center gap-4 hover:border-black transition-all w-full md:w-auto justify-center">
            <Cog6ToothIcon className="w-6 h-6" /> <span className="text-[10px] font-black uppercase tracking-[0.2em]">Kitchen Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, unit, color }) => (
  <div className="bg-white p-10 rounded-[3rem] shadow-sm border-2 border-gray-100 relative group overflow-hidden">
    <div className="absolute -right-6 -top-6 text-gray-100">{icon}</div>
    <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">{label}</p>
    <h3 className={`relative z-10 text-6xl font-black italic mt-4 tracking-tighter leading-none ${color}`}>{unit && <span className="text-lg align-top mr-1 font-bold">{unit}</span>}{value}</h3>
  </div>
);

export default ChefDashboard;