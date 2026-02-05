import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const ChefMenuManager = () => {
    const [meals, setMeals] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [chefId, setChefId] = useState(null);

    useEffect(() => {
        const getChef = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const { data } = await supabase.from('chefs').select('id').eq('user_id', user.id).single();
            setChefId(data.id);
            fetchMeals(data.id);
        };
        getChef();
    }, []);

    const fetchMeals = async (id) => {
        const { data } = await supabase.from('meals').select('*').eq('chef_id', id);
        setMeals(data || []);
    };

    const addMeal = async (e) => {
        e.preventDefault();
        await supabase.from('meals').insert([{ chef_id: chefId, name, price: parseFloat(price) }]);
        setName(''); setPrice('');
        fetchMeals(chefId);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-4xl font-black uppercase italic mb-8 tracking-tighter">Manage <span className="text-[#DD3131]">Menu</span></h2>
            
            <form onSubmit={addMeal} className="bg-gray-50 p-8 rounded-[2rem] mb-12 flex gap-4 items-end border-2 border-gray-100">
                <div className="flex-grow">
                    <label className="text-[10px] font-black uppercase ml-2 text-gray-400">Meal Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-4 rounded-xl border-none outline-none font-bold mt-1" placeholder="e.g., Spicy Thai Basil Chicken" />
                </div>
                <div className="w-32">
                    <label className="text-[10px] font-black uppercase ml-2 text-gray-400">Price ($)</label>
                    <input value={price} onChange={(e) => setPrice(e.target.value)} required type="number" step="0.01" className="w-full p-4 rounded-xl border-none outline-none font-bold mt-1" placeholder="15.00" />
                </div>
                <button className="bg-black text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest mb-[2px] hover:bg-[#DD3131]">Add</button>
            </form>

            <div className="space-y-4">
                {meals.map(meal => (
                    <div key={meal.id} className="flex justify-between items-center p-6 border-2 border-gray-100 rounded-2xl hover:border-black transition-all">
                        <span className="font-black uppercase tracking-tight text-xl">{meal.name}</span>
                        <span className="font-black text-[#DD3131]">${meal.price}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChefMenuManager;