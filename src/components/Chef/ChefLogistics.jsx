import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const ChefLogistics = () => {
    const [baseLocation, setBaseLocation] = useState('');
    const [zoneInput, setZoneInput] = useState(''); // For the current typing
    const [selectedZones, setSelectedZones] = useState([]); // The array of zones
    const [payoutNum, setPayoutNum] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLogistics = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('chefs')
                .select('base_location, delivery_zones, mpesa_payout_number')
                .eq('id', user.id)
                .single();

            if (data) {
                setBaseLocation(data.base_location || '');
                setSelectedZones(data.delivery_zones || []); // Fetching the array
                setPayoutNum(data.mpesa_payout_number || '');
            }
        };
        fetchLogistics();
    }, []);

    // Handle adding a new zone to the array
    const addZone = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = zoneInput.trim().replace(',', '');
            if (value && !selectedZones.includes(value)) {
                setSelectedZones([...selectedZones, value]);
                setZoneInput('');
            }
        }
    };

    const removeZone = (zoneToRemove) => {
        setSelectedZones(selectedZones.filter(z => z !== zoneToRemove));
    };

    const handleSave = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        const { error } = await supabase.from('chefs').update({ 
            base_location: baseLocation,
            delivery_zones: selectedZones, // Sending the array directly
            mpesa_payout_number: payoutNum 
        }).eq('id', user.id);

        if (error) alert("Error: " + error.message);
        else alert("Logistics Saved!");
        setLoading(false);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">Logistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-gray-50 p-8 rounded-[2.5rem] space-y-8">
                    {/* KITCHEN BASE */}
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#DD3131] mb-4">Kitchen Base</h3>
                        <input 
                            type="text" 
                            value={baseLocation} 
                            onChange={e => setBaseLocation(e.target.value)} 
                            placeholder="e.g. Eldoret, Elgon View" 
                            className="w-full p-4 bg-white border border-gray-100 rounded-xl font-bold text-sm focus:border-black outline-none" 
                        />
                    </div>

                    {/* DYNAMIC ARRAY OF ZONES */}
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#DD3131] mb-4">Delivery Reach</h3>
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 min-h-[120px] focus-within:border-black transition-all">
                            <div className="flex flex-wrap gap-2 mb-3">
                                {selectedZones.map(zone => (
                                    <span key={zone} className="bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-2">
                                        {zone}
                                        <button onClick={() => removeZone(zone)} className="hover:text-red-500 text-xs">✕</button>
                                    </span>
                                ))}
                            </div>
                            <input 
                                type="text"
                                value={zoneInput}
                                onChange={e => setZoneInput(e.target.value)}
                                onKeyDown={addZone}
                                placeholder="Type area and press Enter..."
                                className="w-full bg-transparent text-sm font-bold outline-none"
                            />
                        </div>
                        <p className="text-[9px] text-gray-400 mt-3 font-bold italic tracking-wide">Enter areas like 'Annex' or 'CBD' to build your coverage list.</p>
                    </div>
                </div>

                {/* PAYOUT & SAVE */}
                <div className="space-y-6">
                    <div className="bg-white border-2 border-black p-8 rounded-[2.5rem]">
                        <h3 className="text-[10px] font-black uppercase tracking-widest mb-4">M-Pesa Payout Number</h3>
                        <input 
                            type="text" 
                            value={payoutNum} 
                            onChange={e => setPayoutNum(e.target.value)} 
                            placeholder="254..." 
                            className="w-full p-4 bg-gray-50 rounded-xl mb-4 font-bold text-sm outline-none" 
                        />
                        <p className="text-[9px] text-gray-400 font-bold italic uppercase text-center md:text-left">Payments are remitted to this line.</p>
                    </div>

                    <button 
                        onClick={handleSave} 
                        disabled={loading}
                        className="w-full bg-[#DD3131] text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Save Logistics Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChefLogistics;