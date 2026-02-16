import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { 
  CheckBadgeIcon, 
  ClockIcon, 
  UserCircleIcon, 
  MapPinIcon, 
  ChevronRightIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';

const AdminApproval = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'
  const [selectedChef, setSelectedChef] = useState(null); // For the Review Modal

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('chefs').select('*');
    if (!error) setChefs(data || []);
    setLoading(false);
  };

  const updateChefStatus = async (chefId, status) => {
    const { error } = await supabase
      .from('chefs')
      .update({ is_approved: status, is_verified: status })
      .eq('id', chefId)
      .select();

    if (!error) {
      setChefs(chefs.map(c => c.id === chefId ? { ...c, is_approved: status } : c));
      setSelectedChef(null);
    }
  };

  const filteredChefs = chefs.filter(c => activeTab === 'pending' ? !c.is_approved : c.is_approved);

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 font-sans text-black">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER & TABS */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-6xl font-black uppercase italic tracking-tighter">
              Admin <span className="text-[#DD3131]">Portal</span>
            </h1>
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}
              >
                Pending ({chefs.filter(c => !c.is_approved).length})
              </button>
              <button 
                onClick={() => setActiveTab('approved')}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'approved' ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'}`}
              >
                Approved ({chefs.filter(c => c.is_approved).length})
              </button>
            </div>
          </div>
        </header>

        {/* LISTING */}
        <div className="grid gap-4">
          {loading ? (
             <div className="p-20 text-center font-black uppercase animate-pulse">Scanning Kitchens...</div>
          ) : filteredChefs.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200 text-gray-400 font-bold uppercase italic">
               No {activeTab} chefs found.
            </div>
          ) : (
            filteredChefs.map(chef => (
              <div 
                key={chef.id}
                onClick={() => setSelectedChef(chef)}
                className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 flex items-center justify-between cursor-pointer hover:border-black transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl">
                    {chef.profile_photo_url ? <img src={chef.profile_photo_url} className="w-full h-full object-cover rounded-2xl" /> : "👨‍🍳"}
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase italic tracking-tighter">{chef.business_name}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <MapPinIcon className="w-3 h-3" /> {chef.location || "Location not set"}
                    </p>
                  </div>
                </div>
                <ChevronRightIcon className="w-6 h-6 text-gray-300 group-hover:text-black group-hover:translate-x-2 transition-all" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL: CHEF DETAILS REVIEW */}
      {selectedChef && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl h-full rounded-[4rem] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500">
            <div className="p-12 relative">
              <button 
                onClick={() => setSelectedChef(null)}
                className="absolute top-8 right-8 p-3 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#DD3131]">Reviewing Application</span>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter mt-4 mb-8">
                {selectedChef.business_name}
              </h2>

              <div className="space-y-8">
                {/* BIO */}
                <section>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Chef Biography</label>
                  <p className="text-lg font-medium text-gray-700 leading-relaxed italic">
                    "{selectedChef.bio || "No biography submitted yet."}"
                  </p>
                </section>

                {/* DETAILS GRID */}
                <div className="grid grid-cols-2 gap-6 bg-gray-50 p-8 rounded-[2.5rem]">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Experience</label>
                    <p className="font-bold">{selectedChef.years_experience} Years</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Cuisine Types</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedChef.food_types?.map(type => (
                        <span key={type} className="bg-white px-3 py-1 rounded-lg text-[9px] font-black uppercase border border-gray-100">{type}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="pt-8 flex gap-4">
                  {!selectedChef.is_approved ? (
                    <button 
                      onClick={() => updateChefStatus(selectedChef.id, true)}
                      className="flex-1 bg-black text-white py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-[#DD3131] transition-all"
                    >
                      Approve & Go Live
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateChefStatus(selectedChef.id, false)}
                      className="flex-1 border-2 border-black py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-red-500 hover:border-red-500 hover:text-white transition-all"
                    >
                      Revoke Access
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApproval;