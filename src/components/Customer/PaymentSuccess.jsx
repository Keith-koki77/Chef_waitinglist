import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
            <div className="max-w-md">
                <div className="text-8xl mb-8 animate-bounce">🎉</div>
                <h1 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-4">
                    ORDER <span className="text-[#DD3131]">SECURED</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest leading-relaxed mb-10">
                    Your subscription is active. Your chef has been notified and is preparing your culinary experience.
                </p>
                
                <div className="flex flex-col gap-4">
                    <Link to="/plan" className="bg-black text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                        View My Meal Plan
                    </Link>
                    <Link to="/foodie-home" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">
                        Back to Discovery
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;