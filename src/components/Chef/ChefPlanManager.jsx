import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { CalendarDaysIcon, TrashIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

const ChefPlanManager = () => {
    const [plans, setPlans] = useState([]);
    const [chefId, setChefId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('Weekly');
    const [mealsPerWeek, setMealsPerWeek] = useState('5');

    useEffect(() => {
        const getChef = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const { data } = await supabase.from('chefs').select('id').eq('user_id', user.id).single();
            if (data) {
                setChefId(data.id);
                fetchPlans(data.id);
            }
        };
        getChef();
    }, []);

    const fetchPlans = async (id) => {
        const { data } = await supabase.from('menu_plans').select('*').eq('chef_id', id);
        setPlans(data || []);
    };

    const handleCreatePlan = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('menu_plans').insert([{
                chef_id: chefId,
                title,
                description,
                price: parseFloat(price),
                duration,
                meals_per_week: parseInt(mealsPerWeek),
                is_active: true
            }]);

            if (error) throw error;
            setTitle(''); setDescription(''); setPrice('');
            fetchPlans(chefId);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 animate-in fade-in duration-700">
            <h2 className="text-5xl font-black uppercase italic mb-12 tracking-tighter">
                Subscription <span className="text-[#DD3131]">Models</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                {/* CONFIGURATOR */}
                <form onSubmit={handleCreatePlan} className="lg:col-span-2 bg-black text-white p-10 rounded-[3rem] shadow-2xl border-b-[10px] border-[#DD3131]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Plan Name</label>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-4 rounded-xl bg-white text-black font-bold outline-none" placeholder="e.g. Lean & Mean Weekly" />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Price (KSH)</label>
                                    <input value={price} onChange={(e) => setPrice(e.target.value)} required type="number" className="w-full p-4 rounded-xl bg-white text-black font-bold outline-none" placeholder="4500" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Cycle</label>
                                    <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-4 rounded-xl bg-white text-black font-bold outline-none">
                                        <option>Weekly</option>
                                        <option>Monthly</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Meals per Week</label>
                            <input value={mealsPerWeek} onChange={(e) => setMealsPerWeek(e.target.value)} type="number" className="w-full p-4 rounded-xl bg-white text-black font-bold outline-none" />
                            
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Internal Memo / Details</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-4 rounded-xl bg-white text-black font-bold outline-none h-24 resize-none" placeholder="What exactly do they get?" />
                        </div>
                    </div>
                    <button disabled={loading} className="w-full mt-8 py-5 bg-[#DD3131] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                        {loading ? 'Activating...' : 'Launch Plan →'}
                    </button>
                </form>

                {/* PREVIEW CARD */}
                <div className="hidden lg:block">
                    <label className="text-[10px] font-black uppercase text-gray-400 mb-4 block">Live Preview</label>
                    <div className="bg-white border-4 border-black p-8 rounded-[3rem] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-black text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest">
                            {duration || 'Weekly'}
                        </div>
                        <h4 className="text-3xl font-black uppercase italic leading-none mb-4">{title || 'Plan Title'}</h4>
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-500">
                                <CheckBadgeIcon className="w-4 h-4 text-[#DD3131]" />
                                {mealsPerWeek || '0'} meals every week
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-500">
                                <CheckBadgeIcon className="w-4 h-4 text-[#DD3131]" />
                                Contactless Delivery Included
                            </div>
                        </div>
                        <p className="text-xs font-medium text-gray-400 mb-8 h-12 line-clamp-3">{description || 'No description provided yet...'}</p>
                        <div className="pt-6 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
                            <span className="text-3xl font-black italic text-[#DD3131]">KSH {price || '0'}</span>
                            <div className="w-10 h-10 bg-black rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LISTING SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map(plan => (
                    <div key={plan.id} className="group p-8 bg-gray-50 rounded-[2.5rem] border-2 border-transparent hover:border-black transition-all">
                        <h5 className="text-xl font-black uppercase italic mb-1">{plan.title}</h5>
                        <p className="text-[10px] font-black text-[#DD3131] uppercase mb-4 tracking-widest">{plan.duration} • {plan.meals_per_week} Meals/Week</p>
                        <p className="text-xs font-bold text-gray-500 mb-6">{plan.description}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-black">KSH {plan.price}</span>
                            <button onClick={() => deletePlan(plan.id)} className="p-2 hover:bg-red-100 rounded-full text-red-500 transition-colors">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChefPlanManager;