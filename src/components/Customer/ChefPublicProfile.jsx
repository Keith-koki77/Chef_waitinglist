import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { ShoppingBagIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

const ChefPublicProfile = () => {
  const { chefId } = useParams();
  const navigate = useNavigate();
  const [chef, setChef] = useState(null);
  const [meals, setMeals] = useState([]);
  const [plans, setPlans] = useState([]); // NEW: State for subscription plans
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' or 'subscriptions'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChefData = async () => {
      try {
        // Fetch Chef Bio
        const { data: chefData } = await supabase
          .from('chefs')
          .select('*')
          .eq('id', chefId)
          .single();

        // Fetch Individual Meals
        const { data: mealsData } = await supabase
          .from('meals')
          .select('*')
          .eq('chef_id', chefId);

        // Fetch Subscription Plans
        const { data: plansData } = await supabase
          .from('menu_plans')
          .select('*')
          .eq('chef_id', chefId)
          .eq('is_active', true);

        setChef(chefData);
        setMeals(mealsData || []);
        setPlans(plansData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChefData();
  }, [chefId]);

  const handleAddToTable = async (meal) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/login"); return; }

    const { error } = await supabase.from("planned_meals").insert([
      { user_id: user.id, meal_id: meal.id, chef_id: chefId, payment_status: "pending" },
    ]);

    if (!error) alert(`🔥 ${meal.name} added to your table!`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-16 h-16 border-8 border-gray-100 border-t-[#DD3131] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 1. CINEMATIC HERO */}
      <div className="bg-black text-white relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 h-[500px] md:h-[700px] relative">
            <img 
              src={chef?.profile_photo_url || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=1954&auto=format&fit=crop'} 
              className="w-full h-full object-cover opacity-60"
              alt="Chef Profile"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          <div className="w-full md:w-1/2 p-10 md:p-20 z-10 -mt-20 md:mt-0">
            <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.8] mb-8">
              {chef?.business_name}
            </h1>
            <p className="text-gray-400 text-lg italic max-w-md mb-10 leading-relaxed">
              "{chef?.bio || "Crafting culinary experiences that linger on the palate and the soul."}"
            </p>
            <div className="flex gap-4">
              <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-[10px] font-black uppercase text-[#DD3131] tracking-widest">Location</p>
                <p className="font-bold uppercase tracking-tighter">{chef?.location}</p>
              </div>
              <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-[10px] font-black uppercase text-[#DD3131] tracking-widest">Vibe</p>
                <p className="font-bold uppercase tracking-tighter">{chef?.food_types?.[0] || 'Gourmet'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TAB SWITCHER */}
      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-30">
        <div className="bg-black p-2 rounded-[2.5rem] flex shadow-2xl border border-white/20">
          <button 
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'daily' ? 'bg-[#DD3131] text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}
          >
            <ShoppingBagIcon className="w-5 h-5" /> Daily Menu
          </button>
          <button 
            onClick={() => setActiveTab('subscriptions')}
            className={`flex-1 py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'subscriptions' ? 'bg-[#DD3131] text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}
          >
            <CalendarIcon className="w-5 h-5" /> Meal Plans
          </button>
        </div>
      </div>

      {/* 3. DYNAMIC CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-6 mt-20">
        {activeTab === 'daily' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {meals.map((meal) => (
              <div key={meal.id} className="group flex bg-gray-50 rounded-[3rem] p-6 border-2 border-transparent hover:border-black transition-all">
                <img src={meal.image_url} className="w-32 h-32 rounded-[2rem] object-cover shadow-lg" alt={meal.name} />
                <div className="ml-8 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-[#DD3131]">{meal.name}</h4>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase">KSH {meal.price}</p>
                  </div>
                  <button onClick={() => handleAddToTable(meal)} className="mt-4 text-[10px] font-black uppercase tracking-widest bg-black text-white py-3 rounded-xl hover:bg-[#DD3131] transition-colors">
                    Add to Table +
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-black text-white rounded-[3.5rem] p-10 flex flex-col justify-between hover:scale-[1.02] transition-transform">
                <div>
                  <div className="bg-[#DD3131] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block mb-6">
                    {plan.duration}
                  </div>
                  <h4 className="text-3xl font-black uppercase italic tracking-tighter mb-4">{plan.title}</h4>
                  <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">{plan.description}</p>
                  <ul className="space-y-3 mb-10">
                    <li className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-300">
                      <CheckCircleIcon className="w-5 h-5 text-[#DD3131]" /> {plan.meals_per_week} Meals Per Week
                    </li>
                    <li className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-300">
                      <CheckCircleIcon className="w-5 h-5 text-[#DD3131]" /> Delivery Included
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-4xl font-black italic">KSH {plan.price}</span>
                  </div>
                  <button className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#DD3131] hover:text-white transition-all">
                    Subscribe Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefPublicProfile;