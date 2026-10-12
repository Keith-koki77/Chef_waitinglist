import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

const features = [
    { title: "Verified Chefs", desc: "Every chef on Qavaeat undergoes a rigorous vetting process.", icon: "👨‍🍳" },
    { title: "Custom Menus", desc: "Tailor your dining experience to your dietary needs and cravings.", icon: "📜" },
    { title: "Seamless Booking", desc: "Schedule, pay, and chat all within the Qavaeat mobile app.", icon: "📱" }
  ];
  
  export default function Features() {
    const sectionRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.feature-card');
            const icons = entry.target.querySelectorAll('.feature-icon');
            
            // Set initial state
            cards.forEach(el => {
              el.style.opacity = '0';
              el.style.transform = 'translateY(40px) scale(0.95)';
            });
            icons.forEach(el => {
              el.style.opacity = '0';
              el.style.transform = 'scale(0) rotate(-180deg)';
            });

            animate({
              targets: cards,
              opacity: [0, 1],
              translateY: [40, 0],
              scale: [0.95, 1],
              duration: 800,
              easing: 'easeOutExpo',
              delay: stagger(150),
            });
            
            animate({
              targets: icons,
              opacity: [0, 1],
              scale: [0, 1],
              rotate: [-180, 0],
              duration: 600,
              easing: 'easeOutElastic(1, .5)',
              delay: stagger(150, { start: 200 }),
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
      <section ref={sectionRef} className="py-20 bg-white px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 underline decoration-accent underline-offset-8 animate-fade-in-up">
            Why Qavaeat?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="feature-card clay-card clay-card-hover text-center p-8 rounded-2xl transition-all duration-500 cursor-pointer"
              >
                <div className="feature-icon text-6xl mb-4 clay inline-flex items-center justify-center w-20 h-20 mx-auto">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }