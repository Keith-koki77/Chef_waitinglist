import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import WaitlistForm from './WaitlistForm.jsx';

export default function JoinWaitlist() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate({
            targets: entry.target.querySelector('.waitlist-header'),
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 800,
            easing: 'easeOutExpo',
          });

          animate({
            targets: entry.target.querySelectorAll('.waitlist-card'),
            opacity: [0, 1],
            translateY: [40, 0],
            scale: [0.95, 1],
            duration: 800,
            easing: 'easeOutExpo',
            delay: stagger(200),
          });

          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="join-waitlist" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="waitlist-header">
          <h2 className="text-4xl font-black text-q-dark mb-4">
            Ready to transform how you <span className="text-primary">Eat?</span>
          </h2>
          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            Whether you're looking for a personal chef or you're a culinary pro looking to grow your brand, Qavaeat is for you. Join the waitlist for early access.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 text-left">
          {/* Foodie Signup */}
          <div className="waitlist-card clay-card clay-card-hover p-8 rounded-3xl border border-gray-200" style={{ opacity: 0 }}>
            <h3 className="text-xl font-bold mb-2">For Foodies</h3>
            <p className="text-sm text-gray-500 mb-6">Get notified when we launch in your city.</p>
            <WaitlistForm type="user" />
          </div>

          {/* Chef Signup */}
          <div className="waitlist-card clay-card clay-card-hover p-8 rounded-3xl bg-accent/10 border border-accent/30" style={{ opacity: 0 }}>
            <h3 className="text-xl font-bold mb-2">For Chefs</h3>
            <p className="text-sm text-gray-500 mb-6">Apply to become a verified Qavaeat partner.</p>
            <WaitlistForm type="chef" />
          </div>
        </div>
      </div>
    </section>
  );
}