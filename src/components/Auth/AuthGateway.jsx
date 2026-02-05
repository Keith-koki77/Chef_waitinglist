import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGateway = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[85vh] flex items-center justify-center p-6">
            <div className="max-w-5xl w-full">
                <header className="text-center mb-16">
                    <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-none">
                        JOIN THE <span className="text-[#DD3131]">REVOLUTION</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-4">
                        Choose your path in the culinary ecosystem
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* FOODIE PATH */}
                    <div 
                        onClick={() => navigate('/signup/foodie')} 
                        className="group cursor-pointer bg-white border-4 border-gray-100 p-12 rounded-[4rem] hover:border-black transition-all hover:-translate-y-2 shadow-sm hover:shadow-2xl"
                    >
                        <div className="text-7xl mb-8 group-hover:scale-110 transition-transform duration-500">🥗</div>
                        <h2 className="text-5xl font-black tracking-tighter mb-4 uppercase italic leading-none">I'm a Foodie</h2>
                        <p className="text-gray-400 font-bold uppercase text-[11px] tracking-widest leading-relaxed">
                            I want to discover local chefs, subscribe to healthy meals, and automate my nutrition.
                        </p>
                        <div className="mt-10 inline-block bg-black text-white px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest">
                            Join as Foodie →
                        </div>
                    </div>

                    {/* CHEF PATH */}
                    <div 
                        onClick={() => navigate('/signup/chef')} 
                        className="group cursor-pointer bg-black p-12 rounded-[4rem] hover:scale-[1.02] transition-all shadow-2xl"
                    >
                        <div className="text-7xl mb-8 group-hover:rotate-12 transition-transform duration-500">👨‍🍳</div>
                        <h2 className="text-5xl font-black tracking-tighter mb-4 text-white uppercase italic leading-none">I'm a Chef</h2>
                        <p className="text-gray-500 font-bold uppercase text-[11px] tracking-widest leading-relaxed">
                            I want to manage my kitchen, scale my business, and reach customers directly.
                        </p>
                        <div className="mt-10 inline-block bg-[#DD3131] text-white px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest">
                            Open My Kitchen →
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthGateway;