import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const ChefPublicProfile = () => {
    const { chefId } = useParams();
    const [chef, setChef] = useState(null);
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        const fetchChefInfo = async () => {
            const { data: chefData } = await supabase.from('chefs').select('*').eq('id', chefId).single();
            const { data: mealsData } = await supabase.from('meals').select('*').eq('chef_id', chefId);
            setChef(chefData);
            setMeals(mealsData);
        };
        fetchChefInfo();
    }, [chefId]);

    const handleSubscribe = (mealId) => {
        // Logic for adding to MealPlanner / Cart will go here
        alert("Added to your weekly plan!");
    };

    if (!chef) return null;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="bg-black text-white p-12 rounded-[4rem] mb-12">
                <h1 className="text-5xl font-black uppercase italic tracking-tighter">{chef.business_name}</h1>
                <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-xs">📍 {chef.location}</p>
                <p className="mt-6 text-gray-300 max-w-2xl font-medium">{chef.bio}</p>
            </div>

            <h2 className="text-3xl font-black uppercase italic mb-8">Current <span className="text-[#DD3131]">Menu</span></h2>
            <div className="grid grid-cols-1 gap-4">
                {meals.map(meal => (
                    <div key={meal.id} className="flex justify-between items-center p-8 bg-gray-50 rounded-[2rem] border-2 border-transparent hover:border-black transition-all">
                        <div>
                            <h4 className="text-xl font-black uppercase tracking-tight">{meal.name}</h4>
                            <p className="text-[#DD3131] font-black">${meal.price} / meal</p>
                        </div>
                        <button 
                            onClick={() => handleSubscribe(meal.id)}
                            className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#DD3131]"
                        >
                            Add to Plan +
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChefPublicProfile;