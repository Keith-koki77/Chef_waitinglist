import React from 'react';

const PrepSummary = ({ orders }) => {
    // Logic to aggregate ONLY UNCOMPLETED meals
    const getWeeklySummary = (weekNumber) => {
        // Only count orders that haven't been completed yet
        const weekOrders = orders.filter(o => o.week_number === weekNumber && !o.is_completed);
        const summary = {};

        weekOrders.forEach(order => {
            const mealName = order.meal_name;
            if (!summary[mealName]) {
                summary[mealName] = {
                    count: 0,
                    days: new Set(),
                    slots: new Set()
                };
            }
            summary[mealName].count += 1;
            summary[mealName].days.add(order.day_text);
            // Extracts "Lunch" or "Dinner" from "Lunch (1pm)"
            summary[mealName].slots.add(order.time_slot.split(' ')[0]); 
        });

        return Object.entries(summary);
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {[1, 2, 3, 4].map(week => {
                const summaryItems = getWeeklySummary(week);
                const totalActiveItems = orders.filter(o => o.week_number === week && !o.is_completed).length;
                
                if (summaryItems.length === 0) return null;

                return (
                    <div key={week} className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                        {/* HEADER */}
                        <div className="bg-black p-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-white font-black uppercase italic tracking-tighter text-xl">Week 0{week} Production</h3>
                                <p className="text-[#DD3131] text-[9px] font-black uppercase tracking-[0.2em] mt-1">Active Kitchen Orders</p>
                            </div>
                            <div className="text-right">
                                <span className="text-white text-2xl font-black italic">{totalActiveItems}</span>
                                <p className="text-gray-500 text-[8px] font-black uppercase">Pending Items</p>
                            </div>
                        </div>
                        
                        {/* TABLE AREA */}
                        <div className="p-8">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b-2 border-gray-50">
                                        <th className="pb-4">Meal Selection</th>
                                        <th className="pb-4 text-center">Batch Quantity</th>
                                        <th className="pb-4 text-right">Schedule Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {summaryItems.map(([name, data]) => (
                                        <tr key={name} className="group hover:bg-gray-50 transition-colors">
                                            <td className="py-6">
                                                <p className="font-black text-gray-800 uppercase tracking-tight text-base">{name}</p>
                                                <div className="flex gap-2 mt-2">
                                                    {Array.from(data.slots).map(slot => (
                                                        <span key={slot} className="text-[9px] bg-black text-white px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                                                            {slot}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-6 text-center">
                                                <span className="inline-block bg-[#DD3131] text-white text-xl font-black px-5 py-2 rounded-2xl shadow-lg shadow-red-100">
                                                    {data.count}
                                                </span>
                                            </td>
                                            <td className="py-6 text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Required Days:</p>
                                                <p className="text-xs font-bold text-gray-600">
                                                    {Array.from(data.days).join(' • ')}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* FOOTER ACTION */}
                        <div className="bg-gray-50 p-5 border-t border-gray-100 flex justify-center">
                            <button 
                                onClick={() => window.print()} 
                                className="flex items-center gap-2 text-[10px] font-black text-gray-900 uppercase tracking-widest hover:text-[#DD3131] transition-all"
                            >
                                <span>🖨️</span> Export Prep Sheet for Kitchen Staff
                            </button>
                        </div>
                    </div>
                );
            })}
            
            {/* EMPTY STATE */}
            {orders.filter(o => !o.is_completed).length === 0 && (
                <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                    <div className="text-4xl mb-4">🔪</div>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
                        All clear! No pending meals to prep.
                    </p>
                </div>
            )}
        </div>
    );
};

export default PrepSummary;