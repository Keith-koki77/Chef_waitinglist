import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

const ChefCard = ({ chef }) => {
    return (
        <div className="group relative bg-white border-2 border-gray-100 p-4 rounded-[3.5rem] hover:border-black transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
            
            {/* 1. TOP IMAGE SECTION */}
            <div className="relative h-64 w-full overflow-hidden rounded-[2.8rem] mb-6">
                {chef.profile_photo_url ? (
                    <img 
                        src={chef.profile_photo_url} 
                        alt={chef.business_name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-5xl">
                        👨‍🍳
                    </div>
                )}
                
                {/* Status Overlay */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-tighter text-black">Open</span>
                </div>

                {/* Rating Badge */}
                <div className="absolute bottom-4 left-4 bg-black text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <StarIcon className="w-3 h-3 text-yellow-400" />
                    <span className="text-[10px] font-black italic">4.9</span>
                </div>
            </div>

            {/* 2. TEXT CONTENT */}
            <div className="px-4 pb-4">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                        {chef.business_name}
                    </h3>
                    {chef.is_verified && <CheckBadgeIcon className="w-5 h-5 text-[#DD3131]" />}
                </div>
                
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 mb-4">
                    <MapPinIcon className="w-3 h-3 text-[#DD3131]" /> {chef.location}
                </p>

                <p className="text-gray-500 text-xs font-medium line-clamp-2 mb-8 italic leading-relaxed">
                    "{chef.bio || "Crafting signature artisanal dishes with fresh local ingredients."}"
                </p>

                {/* 3. CALL TO ACTION */}
                <Link 
                    to={`/chef/${chef.id}`} 
                    className="flex items-center justify-center w-full bg-black text-white py-5 rounded-[1.8rem] font-black uppercase text-[10px] tracking-[0.2em] group-hover:bg-[#DD3131] transition-all transform active:scale-95"
                >
                    Enter Kitchen
                </Link>
            </div>
        </div>
    );
};

export default ChefCard;