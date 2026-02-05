import React, { useState } from "react";

import { supabase } from "../../lib/supabaseClient";

import { useNavigate } from "react-router-dom";

const ChefOnboarding = () => {
  const [bizName, setBizName] = useState("");

  const [location, setLocation] = useState("");

  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleOnboarding = async (e) => {
    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase

      .from("chefs")

      .insert([
        {
          user_id: user.id,

          business_name: bizName,

          location: location,

          bio: bio,
        },
      ])

      .select()

      .single();

    if (error) {
      alert(error.message);

      setLoading(false);
    } else {
      navigate(`/chef/dashboard/${data.id}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="max-w-xl w-full p-12 rounded-[3rem] bg-black text-white shadow-2xl">
        <header className="mb-10">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter">
            Setup Your <span className="text-[#DD3131]">Kitchen</span>
          </h2>

          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-4">
            Location & Identity are everything
          </p>
        </header>

        <form onSubmit={handleOnboarding} className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase ml-2 text-gray-500">
              Business Name
            </label>

            <input
              required
              className="w-full p-5 rounded-2xl bg-white text-black font-bold outline-none"
              onChange={(e) => setBizName(e.target.value)}
              placeholder="e.g., Mama's Soul Kitchen"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase ml-2 text-gray-500">
              Location (City/Area)
            </label>

            <input
              required
              className="w-full p-5 rounded-2xl bg-white text-black font-bold outline-none"
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Brooklyn, NY"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase ml-2 text-gray-500">
              Short Bio
            </label>

            <textarea
              className="w-full p-5 rounded-2xl bg-white text-black font-bold outline-none h-32"
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell foodies about your culinary style..."
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-6 bg-[#DD3131] rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            {loading ? "Launching..." : "Open Kitchen →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChefOnboarding;
