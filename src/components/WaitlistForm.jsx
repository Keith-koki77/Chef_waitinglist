import { useState } from 'react';
import Success from './Success.jsx'; // Import the new component

export default function WaitlistForm({ type }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => setSubmitted(true))
      .catch((error) => alert("Submission failed: " + error));
  };

  if (submitted) {
    return <Success onBack={() => setSubmitted(false)} />;
  }

  return (
    <form 
      name={`waitlist-${type}`} 
      method="POST" 
      data-netlify="true"
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 w-full max-w-md"
    >
      <input type="hidden" name="form-name" value={`waitlist-${type}`} />
      <input
        type="email"
        name="email"
        placeholder={type === 'chef' ? "Enter chef email..." : "Enter your email..."}
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary bg-white text-black"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="submit"
        className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors cursor-pointer"
      >
        Join Waitlist
      </button>
    </form>
  );
}