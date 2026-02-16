import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { ClockIcon, CalendarIcon, MapPinIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const CheckoutSchedule = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [deliveryType, setDeliveryType] = useState('ASAP'); // 'ASAP' or 'Scheduled'
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [address, setAddress] = useState('');

    // Generate next 7 days for scheduling
    const dates = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            label: i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
            value: d.toISOString().split('T')[0]
        };
    });

    const timeSlots = ["08:00 AM", "12:00 PM", "02:00 PM", "06:00 PM", "08:00 PM"];

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + (item.meals?.price || 0), 0);
    };

    const handleConfirmOrder = async () => {
        if (!address) return alert("Please enter a delivery address");
        if (deliveryType === 'Scheduled' && (!selectedDate || !selectedTime)) {
            return alert("Please select your preferred delivery slot");
        }

        // In the final sync, this will update the 'planned_meals' status to 'confirmed'
        // and trigger the payment gateway API
        alert("Redirecting to Payment Gateway...");
        navigate('/payment-success');
    };

    return (
        <div className="min-h-screen bg-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                
                {/* LEFT: LOGISTICS */}
                <div className="space-y-12">
                    <header>
                        <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-4">
                            Finalize <br/><span className="text-[#DD3131]">Logistics</span>
                        </h2>
                        <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">How & When do you want it?</p>
                    </header>

                    {/* Delivery Address */}
                    <div className="space-y-4">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                            <MapPinIcon className="w-4 h-4" /> Drop-off Point
                        </label>
                        <textarea 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-6 bg-gray-50 rounded-[2rem] border-2 border-transparent focus:border-black outline-none font-bold resize-none h-32 transition-all"
                            placeholder="Apartment name, Street, Floor number..."
                        />
                    </div>

                    {/* Delivery Mode Toggle */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-100 p-2 rounded-[2rem]">
                        <button 
                            onClick={() => setDeliveryType('ASAP')}
                            className={`py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all ${deliveryType === 'ASAP' ? 'bg-black text-white shadow-xl' : 'text-gray-400'}`}
                        >
                            ASAP (Now)
                        </button>
                        <button 
                            onClick={() => setDeliveryType('Scheduled')}
                            className={`py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all ${deliveryType === 'Scheduled' ? 'bg-black text-white shadow-xl' : 'text-gray-400'}`}
                        >
                            Schedule
                        </button>
                    </div>

                    {deliveryType === 'Scheduled' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* Date Picker */}
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {dates.map((d) => (
                                    <button 
                                        key={d.value}
                                        onClick={() => setSelectedDate(d.value)}
                                        className={`px-6 py-4 rounded-2xl whitespace-nowrap border-2 font-black uppercase text-[10px] transition-all ${selectedDate === d.value ? 'bg-[#DD3131] border-[#DD3131] text-white' : 'border-gray-100 text-gray-400'}`}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>

                            {/* Time Picker */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {timeSlots.map((t) => (
                                    <button 
                                        key={t}
                                        onClick={() => setSelectedTime(t)}
                                        className={`p-4 rounded-xl border-2 font-bold text-xs transition-all ${selectedTime === t ? 'bg-black text-white border-black' : 'border-gray-100 text-gray-400'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT: SUMMARY CARD */}
                <div className="relative">
                    <div className="sticky top-12 bg-black text-white rounded-[4rem] p-10 shadow-2xl overflow-hidden">
                        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-[#DD3131] rounded-full blur-[80px] opacity-50" />
                        
                        <h3 className="text-2xl font-black uppercase italic mb-8 relative z-10">Order Summary</h3>
                        
                        <div className="space-y-6 mb-12 relative z-10">
                            {/* In a real scenario, map through cart items here */}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-bold text-xs uppercase">Service Fee</span>
                                <span className="font-black italic">KSH 250</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-bold text-xs uppercase">Delivery</span>
                                <span className="font-black italic text-green-400">FREE</span>
                            </div>
                            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-[#DD3131] tracking-widest">Total to Pay</p>
                                    <p className="text-5xl font-black italic">KSH 4,750</p>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleConfirmOrder}
                            className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-[#DD3131] hover:text-white transition-all flex items-center justify-center gap-3"
                        >
                            Proceed to Payment <ChevronRightIcon className="w-5 h-5" />
                        </button>

                        <p className="text-center text-[9px] font-bold text-gray-500 uppercase mt-8 tracking-widest leading-loose">
                            By confirming, you agree to the <br/> Qavaeat Chef-to-Table Terms
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutSchedule;