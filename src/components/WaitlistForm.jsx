import { useState } from "react";
import Success from "./Success.jsx";

export default function WaitlistForm({ type }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const formName = `waitlist-${type}`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const response = await fetch("/", {
        method: "POST",
        body: new URLSearchParams(formData).toString(),
      });

      if (!response.ok) {
        throw new Error("Netlify form submission failed");
      }

      setSubmitted(true);
      setEmail("");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return <Success onBack={() => setSubmitted(false)} />;
  }

  return (
    <form
      name={formName}
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
    >
      {/* Netlify required hidden input */}
      <input type="hidden" name="form-name" value={formName} />

      {/* Honeypot */}
      <input type="hidden" name="bot-field" />

      <input
        type="email"
        name="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={
          type === "chef"
            ? "Enter chef email address"
            : "Enter your email address"
        }
        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900
                   focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
      />

      <button
        type="submit"
        className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white
                   transition-colors hover:bg-red-700"
      >
        Join Waitlist
      </button>
    </form>
  );
}