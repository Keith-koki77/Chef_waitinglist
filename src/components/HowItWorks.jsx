import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

export default function HowItWorks() {
    const foodiesSteps = [
      {
        id: "1",
        title: "Set Your Food Budget",
        desc: "Decide how much you want to spend on meals for the week or month, then deposit it into your Qavaeat wallet. No daily payments. No surprise spending.",
        icon: "💰"
      },
      {
        id: "2",
        title: "Choose Meals & Chefs",
        desc: "Browse trusted private chefs and eateries, select your meals, and schedule when you want to eat. Everything is planned ahead.",
        icon: "👨‍🍳"
      },
      {
        id: "3",
        title: "Eat on Schedule",
        desc: "When it's time to eat, simply activate your meal. Your chef has your order, your budget is locked, and your food is guaranteed.",
        icon: "🍽️"
      }
    ];
   
    const chefsSteps = [
      {
        id: "1",
        title: "List Your Menu",
        desc: "Upload your meals and meal plans, set your prices, and define when you can serve customers. You stay in control of what you cook.",
        icon: "📜"
      },
      {
        id: "2",
        title: "Get Prepaid Subscribers",
        desc: "Customers subscribe to your meals in advance. That means confirmed orders, predictable demand, and no last-minute cancellations.",
        icon: "📈"
      },
      {
        id: "3",
        title: "Cook & Get Settled",
        desc: "Prepare meals as scheduled while Qavaeat tracks orders and handles payments. You receive payouts based on fulfilled meals.",
        icon: "🏦"
      }
    ];

    const sectionRef = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            animate({
              targets: entry.target.querySelector('.section-header'),
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 800,
              easing: 'easeOutExpo',
            });

            animate({
              targets: entry.target.querySelector('.foodie-card'),
              opacity: [0, 1],
              translateX: [-60, 0],
              duration: 1000,
              easing: 'easeOutExpo',
              delay: 200,
            });

            animate({
              targets: entry.target.querySelector('.chef-card'),
              opacity: [0, 1],
              translateX: [60, 0],
              duration: 1000,
              easing: 'easeOutExpo',
              delay: 300,
            });

            animate({
              targets: entry.target.querySelectorAll('.step-item'),
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 600,
              easing: 'easeOutExpo',
              delay: stagger(150, { start: 500 }),
            });

            animate({
              targets: entry.target.querySelector('.why-works'),
              opacity: [0, 1],
              translateY: [40, 0],
              duration: 800,
              easing: 'easeOutExpo',
              delay: 800,
            });

            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.15 }
      );

      if (sectionRef.current) observer.observe(sectionRef.current);
      return () => observer.disconnect();
    }, []);
   
    return (
      <section ref={sectionRef} className="py-24 bg-off-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Header */}
          <div className="section-header text-center mb-20" style={{ opacity: 0 }}>
            <h2 className="text-4xl md:text-5xl font-black text-q-dark mb-4">
              How <span className="text-primary">Qavaeat</span> Works
            </h2>
            <p className="text-gray-500 font-medium uppercase tracking-widest text-sm">
              Predictable Meals. Predictable Demand.
            </p>
          </div>
   
          <div className="grid lg:grid-cols-2 gap-16">
           
            {/* Foodie Side */}
            <div className="foodie-card clay-card clay-card-hover p-8 md:p-12 rounded-[2.5rem] border border-gray-100" style={{ opacity: 0 }}>
              <div className="inline-block bg-primary/10 text-primary font-bold px-4 py-1 rounded-full text-xs uppercase mb-6">
                For Foodies
              </div>
              <h3 className="text-3xl font-black mb-2">Plan once. Eat well.</h3>
              <p className="text-gray-500 mb-10">Stress less about your daily nutrition and budget.</p>
               
              <div className="space-y-10">
                {foodiesSteps.map((step) => (
                  <div key={step.id} className="step-item flex gap-6" style={{ opacity: 0 }}>
                    <div className="flex-shrink-0 w-14 h-14 clay flex items-center justify-center text-3xl shadow-inner">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{step.id}. {step.title}</h4>
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
   
            {/* Chef Side */}
            <div className="chef-card clay-card clay-card-hover bg-q-dark p-8 md:p-12 rounded-[2.5rem] shadow-xl text-white" style={{ opacity: 0 }}>
              <div className="inline-block bg-accent text-q-dark font-bold px-4 py-1 rounded-full text-xs uppercase mb-6">
                For Chefs
              </div>
              <h3 className="text-3xl font-black mb-2">Cook with confidence.</h3>
              <p className="text-gray-400 mb-10">Get paid predictably and grow your food business.</p>
               
              <div className="space-y-10">
                {chefsSteps.map((step) => (
                  <div key={step.id} className="step-item flex gap-6" style={{ opacity: 0 }}>
                    <div className="flex-shrink-0 w-14 h-14 clay bg-white/10 flex items-center justify-center text-3xl">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 text-accent">{step.id}. {step.title}</h4>
                      <p className="text-gray-400 leading-relaxed text-sm md:text-base">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
   
          </div>
   
          {/* Why This Works Section */}
          <div className="why-works mt-20 clay-card p-8 bg-accent/10 border border-accent/20 rounded-3xl text-center" style={{ opacity: 0 }}>
             <h4 className="text-xl font-black mb-6 uppercase tracking-tight text-q-dark">Why This Works for Everyone</h4>
             <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center clay-card-hover clay-card p-6 rounded-2xl">
                   <span className="text-3xl mb-2">🍽️</span>
                   <p className="text-sm font-medium text-gray-700"><b>Foodies</b> get predictable meals and spending.</p>
                </div>
                <div className="flex flex-col items-center clay-card-hover clay-card p-6 rounded-2xl">
                   <span className="text-3xl mb-2">👩‍🍳</span>
                   <p className="text-sm font-medium text-gray-700"><b>Chefs</b> get steady, prepaid demand.</p>
                </div>
                <div className="flex flex-col items-center clay-card-hover clay-card p-6 rounded-2xl">
                   <span className="text-3xl mb-2">🟢</span>
                   <p className="text-sm font-medium text-gray-700"><b>Qavaeat</b> ensures transparency and trust.</p>
                </div>
             </div>
          </div>
        </div>
      </section>
    );
  }