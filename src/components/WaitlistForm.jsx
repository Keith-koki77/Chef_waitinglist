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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-lg bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <h3 className="text-2xl font-black text-q-dark">
        {type === 'chef' ? 'Chef Registration' : 'Foodie Early Access'}
      </h3>

      <div className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none transition-all text-black"
          required
          onChange={handleChange}
        />

        {type === 'chef' && (
          <input
            name="business_name"
            placeholder="Business Name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black outline-none"
            required
            onChange={handleChange}
          />
        )}

        <input
          name="location"
          placeholder="Location (e.g. Kilimani, Nairobi)"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black outline-none"
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
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  formData.food_type.includes(option)
                    ? 'bg-primary border-primary text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-primary'
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
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    formData.meal_times.includes(meal)
                      ? 'bg-accent border-accent text-q-dark'
                      : 'bg-gray-50 border-gray-200 text-gray-500'
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
        className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
      >
        {loading ? "Registering..." : "Join the Waitlist"}
      </button>
    </form>
  );
}