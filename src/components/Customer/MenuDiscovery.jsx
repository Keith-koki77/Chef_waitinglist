import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

const MenuDiscovery = () => {
    const [chefs, setChefs] = useState([]);
    const [filteredChefs, setFilteredChefs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApprovedChefs = async () => {
            setLoading(true);
            // Fetching logistics data + meals
            const { data, error } = await supabase
                .from('chefs')
                .select('*, meals(*)')
                .eq('is_approved', true);
            
            if (!error && data) {
                // Ensure delivery_zones is always treated as an array for the state
                const formattedData = data.map(chef => ({
                    ...chef,
                    delivery_zones: Array.isArray(chef.delivery_zones) 
                        ? chef.delivery_zones 
                        : (typeof chef.delivery_zones === 'string' ? chef.delivery_zones.split(',').map(s => s.trim()) : [])
                }));
                setChefs(formattedData);
                setFilteredChefs(formattedData);
            }
            setLoading(false);
        };
        fetchApprovedChefs();
    }, []);

    // Filter logic with safety checks for non-array types
    useEffect(() => {
        const results = chefs.filter(chef => {
            const matchesName = chef.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLocation = chef.base_location?.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Safe check for delivery zones array
            const matchesZones = Array.isArray(chef.delivery_zones) && 
                chef.delivery_zones.some(zone => zone.toLowerCase().includes(searchTerm.toLowerCase()));

            return matchesName || matchesLocation || matchesZones;
        });
        setFilteredChefs(results);
    }, [searchTerm, chefs]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-[#DD3131] border-gray-100 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="font-black uppercase italic tracking-tighter text-2xl">Scanning Kitchens...</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-12 min-h-screen">
            {/* HEADER & SEARCH */}
            <header className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="max-w-2xl">
                    <span className="text-[#DD3131] font-black uppercase text-[10px] tracking-[0.3em]">Marketplace</span>
                    <h1 className="text-6xl font-black italic tracking-tighter uppercase mt-2 leading-[0.9]">Local Artisans</h1>
                </div>

                <div className="relative w-full lg:w-96">
                    <input 
                        type="text" 
                        placeholder="Search Area or Chef Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border-2 border-black p-5 rounded-2xl font-bold text-sm outline-none focus:shadow-[8px_8px_0px_0px_rgba(221,49,49,1)] transition-all"
                    />
                    <span className="absolute right-5 top-5 opacity-30">🔍</span>
                </div>
            </header>

            {/* RESULTS GRID */}
            {filteredChefs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredChefs.map(chef => (
                        <div key={chef.id} className="group bg-white rounded-[3rem] border border-gray-100 p-8 hover:border-black transition-all duration-500 relative flex flex-col justify-between">
                            
                            <div>
                                <div className="flex justify-between items-start mb-8">
                                    <div className="h-16 w-16 bg-black text-white rounded-2xl flex items-center justify-center text-2xl font-black italic">
                                        {chef.business_name?.charAt(0)}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Base</p>
                                        <p className="text-sm font-black text-black uppercase italic">{chef.base_location || 'Eldoret'}</p>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black uppercase tracking-tight mb-1">{chef.business_name}</h3>
                                
                                {/* Delivery Zones Badges with Array Safety */}
                                <div className="flex flex-wrap gap-1 mb-6">
                                    {Array.isArray(chef.delivery_zones) && chef.delivery_zones.length > 0 ? (
                                        chef.delivery_zones.slice(0, 3).map((zone, idx) => (
                                            <span key={idx} className="bg-gray-100 text-[8px] font-black px-2 py-1 rounded-md uppercase">
                                                {zone}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="bg-gray-50 text-[8px] font-black px-2 py-1 rounded-md uppercase text-gray-400 italic">
                                            Local Pickup Only
                                        </span>
                                    )}
                                    {chef.delivery_zones?.length > 3 && <span className="text-[8px] font-bold text-gray-400">+{chef.delivery_zones.length - 3}</span>}
                                </div>

                                <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-8 h-10">
                                    {chef.bio || `Specializing in ${chef.specialty || 'homemade'} delicacies for delivery.`}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Menu</span>
                                    <span className="text-xs font-black uppercase">{chef.meals?.length || 0} Options</span>
                                </div>
                                <Link 
                                    to={`/chef/${chef.id}`} 
                                    className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#DD3131] transition-all transform hover:-rotate-2"
                                >
                                    View Kitchen
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center border-4 border-dashed border-gray-100 rounded-[4rem]">
                    <p className="text-2xl font-black uppercase text-gray-300 italic">No chefs found in this zone</p>
                </div>
            )}
        </div>
    );
};

export default MenuDiscovery;