import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

const ChefMenuManager = () => {
    const [meals, setMeals] = useState([]);
    const [chefId, setChefId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Lunch');
    const [imageFile, setImageFile] = useState(null);
    const [addons, setAddons] = useState([]);
    const [newAddon, setNewAddon] = useState({ name: '', price: '' });

    useEffect(() => {
        const getChef = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setChefId(user.id);
                fetchMeals(user.id);
            }
        };
        getChef();
    }, []);

    const fetchMeals = async (id) => {
        const { data } = await supabase.from('meals').select('*').eq('chef_id', id).order('created_at', { ascending: false });
        setMeals(data || []);
    };

    const handleAddAddon = () => {
        if (newAddon.name && newAddon.price) {
            setAddons([...addons, newAddon]);
            setNewAddon({ name: '', price: '' });
        }
    };

    const deleteMeal = async (id) => {
        if (!confirm("Are you sure you want to remove this dish from your kitchen?")) return;
        const { error } = await supabase.from('meals').delete().eq('id', id);
        if (!error) fetchMeals(chefId);
    };

    const startEdit = (meal) => {
        setEditingId(meal.id);
        setName(meal.name);
        setPrice(meal.price);
        setCategory(meal.category);
        setAddons(meal.addons || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const uploadImage = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${chefId}/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('meal-images').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('meal-images').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleSaveMeal = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let imgUrl = meals.find(m => m.id === editingId)?.image_url || null;
            if (imageFile) {
                imgUrl = await uploadImage(imageFile);
            }

            const mealData = {
                chef_id: chefId,
                name,
                price: parseFloat(price),
                category,
                image_url: imgUrl,
                addons: addons
            };

            if (editingId) {
                const { error } = await supabase.from('meals').update(mealData).eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('meals').insert([mealData]);
                if (error) throw error;
            }

            // Reset
            setName(''); setPrice(''); setCategory('Lunch'); 
            setAddons([]); setImageFile(null); setEditingId(null);
            fetchMeals(chefId);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 animate-in fade-in duration-700">
            <h2 className="text-5xl font-black uppercase italic mb-12 tracking-tighter">
                Manage <span className="text-[#DD3131]">Menu</span>
            </h2>

            <form onSubmit={handleSaveMeal} className="bg-black text-white p-10 rounded-[3rem] mb-16 shadow-2xl relative border-b-[10px] border-[#DD3131]">
                {editingId && (
                    <button onClick={() => {setEditingId(null); setName(''); setPrice(''); setAddons([]);}} className="absolute top-8 right-8 text-[10px] font-black uppercase bg-white/10 px-4 py-2 rounded-full">Cancel Edit</button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Meal Name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-5 rounded-2xl bg-white text-black font-bold outline-none mt-2" placeholder="e.g. Grilled Tilapia" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Price (KSH)</label>
                                <input value={price} onChange={(e) => setPrice(e.target.value)} required type="number" className="w-full p-5 rounded-2xl bg-white text-black font-bold outline-none mt-2" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Category</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-5 rounded-2xl bg-white text-black font-bold outline-none mt-2">
                                    {['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Drink'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Photo {editingId && '(Leave blank to keep current)'}</label>
                            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-xs font-bold mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-[#DD3131] file:text-white" />
                        </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[#DD3131] mb-4">Add-ons / Extras</h3>
                        <div className="flex gap-2 mb-4">
                            <input value={newAddon.name} onChange={e => setNewAddon({...newAddon, name: e.target.value})} className="flex-grow p-3 rounded-xl bg-white text-black text-sm font-bold" placeholder="Extra Avocado" />
                            <input value={newAddon.price} onChange={e => setNewAddon({...newAddon, price: e.target.value})} type="number" className="w-20 p-3 rounded-xl bg-white text-black text-sm font-bold" placeholder="50" />
                            <button type="button" onClick={handleAddAddon} className="bg-white text-black px-4 rounded-xl font-black text-lg">+</button>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {addons.map((a, i) => (
                                <div key={i} className="flex justify-between text-[11px] font-bold bg-white/10 p-3 rounded-lg border border-white/5 uppercase italic">
                                    <span>{a.name}</span>
                                    <div className="flex items-center gap-3">
                                        <span>+KSH {a.price}</span>
                                        <button type="button" onClick={() => setAddons(addons.filter((_, idx) => idx !== i))} className="text-red-500">×</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <button disabled={loading} className="w-full py-6 bg-[#DD3131] text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
                    {loading ? 'Processing...' : editingId ? 'Update Meal Details →' : 'Save Meal to Kitchen →'}
                </button>
            </form>

            <div className="space-y-12">
                {['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Drink'].map(cat => (
                    <div key={cat}>
                        {meals.some(m => m.category === cat) && (
                            <>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter border-b-4 border-black inline-block mb-6">{cat}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {meals.filter(m => m.category === cat).map(meal => (
                                        <div key={meal.id} className="group relative flex gap-6 p-6 border-2 border-gray-100 rounded-[2.5rem] hover:border-black transition-all bg-white overflow-hidden">
                                            {/* ACTION OVERLAY */}
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <button onClick={() => startEdit(meal)} className="p-2 bg-black text-white rounded-full hover:bg-blue-600 transition-colors">
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => deleteMeal(meal.id)} className="p-2 bg-black text-white rounded-full hover:bg-[#DD3131] transition-colors">
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {meal.image_url && (
                                                <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                                                    <img src={meal.image_url} alt={meal.name} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-xl font-black uppercase tracking-tight leading-none pr-10">{meal.name}</h4>
                                                    <span className="text-[#DD3131] font-black italic">KSH {meal.price}</span>
                                                </div>
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {meal.addons?.map((a, i) => (
                                                        <span key={i} className="text-[8px] font-black uppercase bg-gray-100 px-2 py-1 rounded text-gray-500">+{a.name}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChefMenuManager;