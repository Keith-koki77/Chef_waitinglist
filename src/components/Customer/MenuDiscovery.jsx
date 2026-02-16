import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';

const MenuDiscovery = () => {
  const [chefs, setChefs] = useState([]);
  const [filteredChefs, setFilteredChefs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('chefs')
      .select('*')
      .eq('is_approved', true);

    if (!error) {
      setChefs(data || []);
      setFilteredChefs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const filtered = chefs.filter(
      (chef) =>
        chef.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chef.business_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredChefs(filtered);
  }, [searchQuery, chefs]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-100 border-t-[#DD3131] rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Scouting Kitchens</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      {/* 1. DISCOVERY HEADER */}
      <div className="bg-white border-b border-gray-100 mb-12">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-black mb-6">
            The <span className="text-[#DD3131]">Market</span>
          </h1>
          <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.4em] mb-12">
            Discover elite home chefs in your neighborhood
          </p>

          {/* FLOATING SEARCH BAR */}
          <div className="relative max-w-3xl mx-auto group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 group-focus-within:text-[#DD3131] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by city or kitchen name..."
              className="w-full pl-16 pr-6 py-8 rounded-[2.5rem] bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border-2 border-transparent focus:border-black outline-none text-xl font-bold italic transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* 2. GRID SECTION */}
        {filteredChefs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredChefs.map((chef) => (
              <Link
                to={`/chef/${chef.id}`}
                key={chef.id}
                className="group bg-white rounded-[3rem] p-4 border-2 border-transparent hover:border-black transition-all duration-500 shadow-sm hover:shadow-2xl"
              >
                {/* Visual Anchor: Profile Image */}
                <div className="relative aspect-square overflow-hidden rounded-[2.5rem] mb-6 bg-gray-100">
                  {chef.profile_photo_url ? (
                    <img
                      src={chef.profile_photo_url}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={chef.business_name}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">👨‍🍳</div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-sm">
                    <p className="text-[10px] font-black text-black uppercase tracking-widest">Open</p>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-tight group-hover:text-[#DD3131] transition-colors">
                      {chef.business_name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    <MapPinIcon className="w-3 h-3 text-[#DD3131]" />
                    {chef.location}
                  </div>

                  <p className="text-gray-500 text-sm font-medium italic line-clamp-2 leading-relaxed mb-8">
                    "{chef.bio || "Crafting signature local dishes with a professional touch."}"
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest group-hover:text-black transition-colors">
                      View Menu →
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-[#DD3131] group-hover:text-white transition-all">
                       🔥
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* 3. EMPTY STATE */
          <div className="py-24 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
            <div className="text-5xl mb-6">🍳</div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Kitchens are quiet here</h3>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
              Try searching for "Nairobi" or "Kisumu"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuDiscovery;