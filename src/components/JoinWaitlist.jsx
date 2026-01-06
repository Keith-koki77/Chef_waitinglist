import WaitlistForm from './WaitlistForm.jsx';

export default function JoinWaitlist() {
  return (
    <section id="join-waitlist" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-black text-q-dark mb-4">
          Ready to transform how you <span className="text-primary">Eat?</span>
        </h2>
        <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
          Whether you're looking for a personal chef or you're a culinary pro looking to grow your brand, Qavaeat is for you. Join the waitlist for early access.
        </p>

        <div className="grid md:grid-cols-2 gap-12 text-left">
          {/* Foodie Signup */}
          <div className="p-8 rounded-3xl bg-off-white border border-gray-200">
            <h3 className="text-xl font-bold mb-2">For Foodies</h3>
            <p className="text-sm text-gray-500 mb-6">Get notified when we launch in your city.</p>
            <WaitlistForm type="user" />
          </div>

          {/* Chef Signup */}
          <div className="p-8 rounded-3xl bg-accent/10 border border-accent/30">
            <h3 className="text-xl font-bold mb-2">For Chefs</h3>
            <p className="text-sm text-gray-500 mb-6">Apply to become a verified Qavaeat partner.</p>
            <WaitlistForm type="chef" />
          </div>
        </div>
      </div>
    </section>
  );
}