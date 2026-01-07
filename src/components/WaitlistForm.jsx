import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Success from './Success.jsx';
import ReactGA from "react-ga4"; // Added GA4 import

export default function WaitlistForm({ type }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Insert data into Supabase
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email: email, type: type }]);

    if (error) {
      console.error(error);
      alert("Error joining waitlist: " + error.message);
    } else {
      // 2. Fire Google Analytics Event on Success
      ReactGA.event({
        category: "Conversion",
        action: "Waitlist Signup",
        label: type, // Tracks whether it was 'chef' or 'user'
      });

      setSubmitted(true);
    }
    
    setLoading(false);
  };

  if (submitted) return <Success onBack={() => setSubmitted(false)} />;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
      <input
        type="email"
        placeholder={type === 'chef' ? "Enter chef email..." : "Enter your email..."}
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white text-black"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all cursor-pointer disabled:opacity-50"
      >
        {loading ? "Joining..." : "Join Waitlist"}
      </button>
    </form>
  );
}