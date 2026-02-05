import React from 'react';
import { Link } from 'react-router-dom';

const ChefCard = ({ chef }) => {
    return (
        <div className="group relative bg-white border-2 border-gray-100 p-8 rounded-[3rem] hover:border-black transition-all duration-500 hover:-translate-y-2">
            {/* Status Badge */}
            <div className="absolute top-8 right-8 bg-green-100 text-green-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter">
                Open
            </div>

            {/* Icon/Avatar Placeholder */}
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:rotate-12 transition-transform">
                👨‍🍳
            </div>

            <h3 className="text-2xl font-black uppercase italic tracking-tight mb-2">
                {chef.business_name}
            </h3>
            
            <p className="text-[#DD3131] font-black text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="text-lg">📍</span> {chef.location}
            </p>

            <p className="text-gray-400 text-sm font-medium line-clamp-2 mb-8">
                {chef.bio || "No bio provided. Fresh local ingredients and artisanal preparation."}
            </p>

            <Link 
                to={`/explore/${chef.id}`} 
                className="block w-full text-center bg-gray-50 group-hover:bg-black group-hover:text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-colors"
            >
                Enter Kitchen →
            </Link>
        </div>
    );
};

export default ChefCard;