import React, { useState } from 'react';
import ChefMenuManager from './ChefMenuManager';
import ChefLogistics from './ChefLogistics';
import ProfileSettings from './ProfileSettings';

const ChefSettings = () => {
    const [activeTab, setActiveTab] = useState('menu'); // default tab

    const tabs = [
        { id: 'profile', label: 'Profile & Bio' },
        { id: 'menu', label: 'Menu & Add-ons' },
        { id: 'logistics', label: 'Delivery & Location' }
    ];

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* STICKY TAB NAVIGATION */}
            <div className="border-b border-gray-100 bg-white sticky top-[72px] z-30">
                <div className="max-w-5xl mx-auto px-6 flex gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
                                activeTab === tab.id 
                                ? 'border-[#DD3131] text-black' 
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-12">
                {activeTab === 'profile' && <ProfileSettings />}
                {activeTab === 'menu' && <ChefMenuManager />}
                {activeTab === 'logistics' && <ChefLogistics />}
            </div>
        </div>
    );
};

export default ChefSettings;