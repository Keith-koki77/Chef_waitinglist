import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="py-20 bg-[#0A0A0A] text-white">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="text-3xl font-black text-[#DD3131] tracking-tighter italic">QAVAEAT</Link>
                        <p className="mt-6 text-gray-500 max-w-sm font-medium leading-relaxed">
                            A decentralized culinary ecosystem empowering local chefs and automating nutrition for modern foodies.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm font-bold uppercase tracking-tight">
                            <li><Link to="/foodie-home" className="hover:text-[#DD3131]">Find Chefs</Link></li>
                            <li><Link to="/auth" className="hover:text-[#DD3131]">Open a Kitchen</Link></li>
                            <li><Link to="/plan" className="hover:text-[#DD3131]">Meal Planner</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Support</h4>
                        <ul className="space-y-4 text-sm font-bold uppercase tracking-tight">
                            <li><Link to="/" className="hover:text-[#DD3131]">Waitlist</Link></li>
                            <li><Link to="/" className="hover:text-[#DD3131]">Privacy</Link></li>
                            <li><Link to="/login" className="text-[#DD3131]">Admin Access</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                        © 2026 Qavaeat Ecosystem. Built for the bold.
                    </p>
                    <div className="flex gap-6">
                        {/* Social Icons Placeholder */}
                        <div className="w-4 h-4 bg-gray-800 rounded-full hover:bg-[#DD3131] cursor-pointer transition-all"></div>
                        <div className="w-4 h-4 bg-gray-800 rounded-full hover:bg-[#DD3131] cursor-pointer transition-all"></div>
                        <div className="w-4 h-4 bg-gray-800 rounded-full hover:bg-[#DD3131] cursor-pointer transition-all"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;