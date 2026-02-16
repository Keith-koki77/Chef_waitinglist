import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import ChefMenuManager from './ChefMenuManager';
import ChefLogistics from './ChefLogistics';
import ChefPlanManager from './ChefPlanManager'; 

const ChefSettings = () => {
    const { chefId } = useParams();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ business_name: '', bio: '', location: '', profile_photo_url: '' });

    useEffect(() => {
        const fetchChef = async () => {
            const { data } = await supabase.from('chefs').select('*').eq('id', chefId).single();
            if (data) setFormData(data);
        };
        fetchChef();
    }, [chefId]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${chefId}/profile-${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('meal-images').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('meal-images').getPublicUrl(filePath);
            setFormData({ ...formData, profile_photo_url: data.publicUrl });
        } catch (err) {
            alert("Upload failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from('chefs').update(formData).eq('id', chefId);
        if (!error) alert("Kitchen Identity Updated!");
        setLoading(false);
    };

    const tabs = [
        { id: 'profile', label: 'Identity' },
        { id: 'menu', label: 'Inventory' },
        { id: 'plans', label: 'Subscription' },
        { id: 'logistics', label: 'Logistics' }
    ];

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="border-b-2 border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
                <div className="max-w-5xl mx-auto px-6 flex gap-12">
                    {tabs.map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`py-8 text-[10px] font-black uppercase tracking-[0.3em] transition-all border-b-4 ${
                                activeTab === tab.id ? 'border-[#DD3131] text-black' : 'border-transparent text-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                {activeTab === 'profile' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-5xl font-black uppercase italic mb-10">Kitchen <span className="text-[#DD3131]">Identity</span></h2>
                        <form onSubmit={handleSaveProfile} className="space-y-8 bg-gray-50 p-10 rounded-[3rem]">
                            <div className="flex items-center gap-8 mb-8">
                                <div className="w-24 h-24 rounded-3xl bg-gray-200 overflow-hidden">
                                    <img src={formData.profile_photo_url} className="w-full h-full object-cover" alt="Profile" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">Change Profile Photo</label>
                                    <input type="file" onChange={handleFileUpload} className="text-xs font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-black file:text-white cursor-pointer" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Kitchen Name</label>
                                    <input value={formData.business_name} onChange={e => setFormData({...formData, business_name: e.target.value})} className="w-full p-5 rounded-2xl bg-white font-bold mt-2 outline-none border-2 border-transparent focus:border-black transition-all" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Location / Area</label>
                                    <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-5 rounded-2xl bg-white font-bold mt-2 outline-none border-2 border-transparent focus:border-black transition-all" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Kitchen Bio</label>
                                <textarea rows="4" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full p-5 rounded-2xl bg-white font-bold mt-2 outline-none border-2 border-transparent focus:border-black transition-all" placeholder="Tell foodies about your culinary style..." />
                            </div>

                            <button disabled={loading} className="w-full py-6 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#DD3131] transition-all shadow-xl">
                                {loading ? 'Syncing...' : 'Update Command Center →'}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'menu' && <ChefMenuManager />}
                {activeTab === 'plans' && <ChefPlanManager />}
                {activeTab === 'logistics' && <ChefLogistics />}
            </div>
        </div>
    );
};

export default ChefSettings;