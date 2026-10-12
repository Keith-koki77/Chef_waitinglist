import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Success from './Success.jsx';
import ReactGA from "react-ga4";

export default function WaitlistForm({ type }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    business_name: '',
    location: '',
    food_type: [], // Changed to array
    meal_times: [] // Already an array
  });

  const foodOptions = [
    "Swahili", "Nigerian", "Indian", "Italian", "Vegan/Healthy", "Continental", "Fast Food", "Pastries"
  ];

  const mealOptions = ["Breakfast", "Lunch", "Supper"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Toggle function for multi-select arrays
  const handleMultiSelect = (fieldName, value) => {
    const currentArray = formData[fieldName];
    const updatedArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setFormData({ ...formData, [fieldName]: updatedArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('waitlist')
      .insert([{ ...formData, type: type }]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      ReactGA.event({
        category: "Conversion",
        action: "Waitlist Signup",
        label: type,
      });
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) return <Success onBack={() => setSubmitted(false)} />;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-lg clay-card p-8">
      <h3 className="text-2xl font-black text-q-dark">
        {type === 'chef' ? 'Chef Registration' : 'Foodie Early Access'}
      </h3>

      <div className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          className="clay-input w-full text-black placeholder-gray-400"
          required
          onChange={handleChange}
        />

        {type === 'chef' && (
          <input
            name="business_name"
            placeholder="Business Name"
            className="clay-input w-full text-black placeholder-gray-400"
            required
            onChange={handleChange}
          />
        )}

        <input
          name="location"
          placeholder="Location (e.g. Kilimani, Nairobi)"
          className="clay-input w-full text-black placeholder-gray-400"
          required
          onChange={handleChange}
        />

        {/* Multi-Select for Food Type */}
        <div>
          <label className="text-sm font-bold text-gray-700 mb-2 block">
            {type === 'chef' ? 'Specialties (Select all that apply):' : 'Food Preferences:'}
          </label>
          <div className="flex flex-wrap gap-2">
            {foodOptions.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => handleMultiSelect('food_type', option)}
                className={`clay-button px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  formData.food_type.includes(option)
                    ? 'bg-primary text-white shadow-[0_4px_10px_rgba(221,49,49,0.3)]'
                    : 'text-gray-600 hover:bg-accent/50'
                }`}
              >
                {option} {formData.food_type.includes(option) ? '✓' : '+'}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Select for Meal Times (Foodies Only) */}
        {type === 'user' && (
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block">Planned Meal Times:</label>
            <div className="flex flex-wrap gap-2">
              {mealOptions.map(meal => (
                <button
                  key={meal}
                  type="button"
                  onClick={() => handleMultiSelect('meal_times', meal)}
                  className={`clay-button px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    formData.meal_times.includes(meal)
                      ? 'bg-accent text-q-dark shadow-[0_4px_10px_rgba(244,205,46,0.3)]'
                      : 'text-gray-500 hover:bg-primary/10'
                  }`}
                >
                  {meal}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="clay-button bg-primary text-white font-bold py-4 rounded-xl w-full hover:bg-red-700 shadow-[0_4px_15px_rgba(221,49,49,0.4)] disabled:opacity-50"
      >
        {loading ? "Registering..." : "Join the Waitlist"}
      </button>
    </form>
  );
}