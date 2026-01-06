import { useState } from 'react';
import Success from './Success.jsx';

export default function WaitlistForm({ type }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // This tells Netlify which 'Ghost Form' to match this data to
    formData.append("form-name", form.getAttribute("name"));
  
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then((response) => {
        if (response.ok) {
          setSubmitted(true);
        } else {
          // This is likely what triggered your "Oops" alert
          throw new Error("Form submission failed at server");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Oops! Something went wrong. Please try again.");
      });
  };
  
  if (submitted) {
    return <Success onBack={() => setSubmitted(false)} />;
  }

  return (
    <form 
      name={`waitlist-${type}`} 
      method="POST" 
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2 w-full max-w-md"
    >
      {/* Required for Netlify + React integration */}
      <input type="hidden" name="form-name" value={`waitlist-${type}`} />
      
      {/* Hidden honeypot field for bot protection */}
      <p className="hidden">
        <label>Don’t fill this out if you’re human: <input name="bot-field" /></label>
      </p>

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
        className="bg-primary hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all cursor-pointer"
      >
        Join Waitlist
      </button>
    </form>
  );
}