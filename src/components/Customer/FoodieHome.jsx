import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import ChefCard from "./ChefCard"; 
import { 
  MagnifyingGlassIcon, 
  AdjustmentsHorizontalIcon, 
  FireIcon, 
  CalendarDaysIcon 
} from "@heroicons/react/24/outline";

const FoodieHome = () => {
  const [chefs, setChefs] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("kitchens"); // 'kitchens' or 'plans'
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Swahili", "Vegan", "Keto", "Grill", "Pastry", "Healthy"];

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    try {
      setLoading(true);
      // Fetching is_approved chefs (matching your Dashboard logic)
      const { data, error } = await supabase
        .from("chefs")
        .select("*")
        .eq("is_approved", true); 

      if (error) throw error;
      setChefs(data || []);
    } catch (err) {
      console.error("Error loading kitchens:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // FIX: Added safety checks to prevent 'toLowerCase' on null values
  const filteredChefs = chefs.filter((chef) => {
    const chefName = (chef.business_name || "").toLowerCase();
    const chefLocation = (chef.location || "").toLowerCase();
    const searchTerm = search.toLowerCase();

    const matchesSearch = 
      chefLocation.includes(searchTerm) || 
      chefName.includes(searchTerm);
    
    // Safety check for food_types array
    const matchesCategory = activeCategory === "All" || 
      chef.food_types?.some(t => t?.toLowerCase() === activeCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SEARCH SECTION */}
      <section className="bg-black pt-20 pb-32 px-8 rounded-b-[5rem] mb-[-4rem] relative z-10 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] text-white">
                Find Your <br />
                <span className="text-[#DD3131]">Private Chef</span>
              </h1>
              <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.4em] mt-6 ml-2">
                Curated Kitchens • Verified Professionals
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex bg-white/10 p-2 rounded-3xl backdrop-blur-md border border-white/10">
              <button 
                onClick={() => setViewMode('kitchens')}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[10px] transition-all ${viewMode === 'kitchens' ? 'bg-white text-black shadow-xl' : 'text-white hover:bg-white/5'}`}
              >
                <FireIcon className="w-4 h-4" /> Daily Meals
              </button>
              <button 
                onClick={() => setViewMode('plans')}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[10px] transition-all ${viewMode === 'plans' ? 'bg-white text-black shadow-xl' : 'text-white hover:bg-white/5'}`}
              >
                <CalendarDaysIcon className="w-4 h-4" /> Weekly Plans
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group max-w-2xl">
            <MagnifyingGlassIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-[#DD3131] transition-colors" />
            <input
              type="text"
              placeholder="Search by neighborhood, chef name, or cuisine..."
              className="w-full pl-16 pr-8 py-8 bg-white rounded-[2.5rem] outline-none font-bold text-xl placeholder:text-gray-300 shadow-2xl focus:ring-4 focus:ring-[#DD3131]/20 transition-all text-black"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 2. CATEGORY QUICK FILTERS */}
      <section className="relative z-20 max-w-7xl mx-auto px-8 mb-16">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <div className="bg-black text-white p-4 rounded-2xl shrink-0">
            <AdjustmentsHorizontalIcon className="w-6 h-6" />
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest whitespace-nowrap transition-all border-2 ${
                activeCategory === cat 
                  ? "bg-[#DD3131] border-[#DD3131] text-white shadow-lg shadow-[#DD3131]/30 translate-y-[-2px]" 
                  : "bg-white border-gray-100 text-gray-400 hover:border-black hover:text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. GRID SECTION */}
      <main className="max-w-7xl mx-auto px-8 pb-32">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/5] bg-gray-50 animate-pulse rounded-[4rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredChefs.length > 0 ? (
              filteredChefs.map((chef) => (
                <ChefCard key={chef.id} chef={chef} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-4xl font-black uppercase italic text-gray-200">
                  No kitchens found in this sector
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default FoodieHome;