import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router-dom';

const FoodieHome = () => {
    const [chefs, setChefs] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChefs();
    }, []);

    const fetchChefs = async () => {
        const { data, error } = await supabase
            .from('chefs')
            .select('*')
            .eq('is_approved', true); // Only show verified kitchens
        
        if (!error) setChefs(data);
        setLoading(false);
    };

    const filteredChefs = chefs.filter(chef => 
        chef.location.toLowerCase().includes(search.toLowerCase()) ||
        chef.business_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none">
                    EXPLORE <span className="text-[#DD3131]">KITCHENS</span>
                </h1>
                <div className="mt-8 relative max-w-xl">
                    <input 
                        type="text" 
                        placeholder="Search by city or cuisine..." 
                        className="w-full p-6 bg-gray-100 rounded-3xl outline-none font-bold border-2 border-transparent focus:border-black transition-all"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 font-black">SEARCH</span>
                </div>
            </header>

            {loading ? (
                <div className="animate-pulse space-y-4">
                    {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-[3rem]"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredChefs.map(chef => (
                        <Link to={`/explore/${chef.id}`} key={chef.id} 
                              className="group bg-white border-2 border-gray-100 p-8 rounded-[3rem] hover:border-black transition-all shadow-sm hover:shadow-xl">
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🍳</div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tight">{chef.business_name}</h3>
                            <p className="text-[#DD3131] font-black text-[10px] uppercase tracking-widest mt-2">📍 {chef.location}</p>
                            <p className="text-gray-400 text-sm mt-4 font-medium line-clamp-2">{chef.bio}</p>
                            <div className="mt-6 inline-block font-black uppercase text-[10px] tracking-widest border-b-2 border-black pb-1">View Menu →</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FoodieHome;