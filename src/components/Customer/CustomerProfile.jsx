import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { 
  UserCircleIcon, 
  HeartIcon, 
  MapPinIcon, 
  CreditCardIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

const CustomerProfile = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    preferences: []
  });
  const [loading, setLoading] = useState(true);

  const dietTags = ["Vegan", "Halal", "Keto", "High Protein", "No Seafood", "Gluten Free"];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // In your final sync, this will pull from a 'profiles' table
      setProfile(prev => ({ ...prev, email: user.email }));
    }
    setLoading(false);
  };

  const togglePreference = (tag) => {
    setProfile(prev => ({
      ...prev,
      preferences: prev.preferences.includes(tag)
        ? prev.preferences.filter(t => t !== tag)
        : [...prev.preferences, tag]
    }));
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-20">
        
        <header className="mb-16">
          <h1 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4">
            The <span className="text-[#DD3131]">Foodie</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em] ml-2">
            Manage your palate and preferences
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT: PERSONAL INFO */}
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-gray-50 p-10 rounded-[3rem] border-2 border-transparent hover:border-black transition-all">
              <div className="flex items-center gap-4 mb-8">
                <UserCircleIcon className="w-8 h-8 text-[#DD3131]" />
                <h2 className="text-2xl font-black uppercase italic tracking-tight">Identity</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-white rounded-2xl font-bold outline-none border-2 border-transparent focus:border-black"
                    placeholder="E.g. Juma Omar"
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Contact Number</label>
                  <input 
                    type="tel" 
                    className="w-full p-4 bg-white rounded-2xl font-bold outline-none border-2 border-transparent focus:border-black"
                    placeholder="+254..."
                    value={profile.phone}
                  />
                </div>
              </div>
            </section>

            {/* PREFERENCES SECTION */}
            <section className="bg-black text-white p-10 rounded-[3rem] shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <SparklesIcon className="w-8 h-8 text-[#DD3131]" />
                <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">Dietary Palate</h2>
              </div>
              <p className="text-gray-500 text-xs font-bold mb-6 italic">We'll use these to suggest the best kitchens for your lifestyle.</p>
              
              <div className="flex flex-wrap gap-3">
                {dietTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => togglePreference(tag)}
                    className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
                      profile.preferences.includes(tag)
                        ? 'bg-[#DD3131] text-white'
                        : 'bg-white/10 text-gray-400 hover:bg-white/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: STATS & QUICK ACTIONS */}
          <div className="space-y-6">
            <div className="bg-[#DD3131] p-8 rounded-[3rem] text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Wallet Balance</p>
              <h3 className="text-4xl font-black italic mt-2">KSH 0.00</h3>
              <button className="w-full mt-6 py-4 bg-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all">
                Top Up
              </button>
            </div>

            <div className="bg-white border-2 border-gray-100 p-8 rounded-[3rem] hover:border-black transition-all">
              <h4 className="text-lg font-black uppercase italic mb-6 flex items-center gap-2">
                <HeartIcon className="w-5 h-5 text-[#DD3131]" /> Saved Kitchens
              </h4>
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 italic">No favorites yet. Start exploring the marketplace!</p>
              </div>
            </div>

            <button 
              onClick={() => supabase.auth.signOut()}
              className="w-full py-6 rounded-[2rem] border-2 border-gray-100 text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
            >
              Sign Out
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;