import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const ChefLogistics = () => {
    const [hours, setHours] = useState("");
    
    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const { data } = await supabase.from('chefs').select('working_hours').eq('user_id', user.id).single();
            setHours(data?.working_hours?.schedule || "");
        };
        load();
    }, []);

    const save = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('chefs').update({ working_hours: { schedule: hours } }).eq('user_id', user.id);
        alert("Logistics updated.");
    };

    return (
        <div className="max-w-2xl bg-gray-50 p-10 rounded-[3rem] border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-black uppercase italic mb-6">Operational Hours</h3>
            <input 
                value={hours} 
                onChange={e => setHours(e.target.value)}
                placeholder="e.g. Mon-Fri: 8am - 10pm" 
                className="w-full p-5 rounded-2xl bg-white border-2 border-black font-bold outline-none mb-6"
            />
            <button onClick={save} className="px-8 py-4 bg-black text-white rounded-xl font-black uppercase text-[10px] tracking-widest">
                Save Schedule
            </button>
        </div>
    );
};

export default ChefLogistics;