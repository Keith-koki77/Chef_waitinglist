import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { animate, stagger, createTimeline } from 'animejs';

export default function Hero() {
  const heroRef = useRef(null);
  const mockupRef = useRef(null);

  useEffect(() => {
    const heroContent = heroRef.current?.querySelectorAll('[data-animate]');
    const mockup = mockupRef.current;

    if (heroContent?.length) {
      // Set initial state
      heroContent.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
      });
      if (mockup) {
        mockup.style.opacity = '0';
        mockup.style.transform = 'scale(0.95)';
      }

      // Entrance animation for hero content
      createTimeline({ easing: 'easeOutExpo' })
        .add({
          targets: heroContent,
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 1000,
          delay: stagger(100, { start: 200 }),
        })
        .add({
          targets: mockup,
          opacity: [0, 1],
          scale: [0.95, 1],
          duration: 1200,
        }, '-=600');

      // Floating animation for mockup
      animate({
        targets: mockup,
        translateY: [-10, 10],
        duration: 4000,
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true,
      });
    }
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden bg-off-white py-16 lg:py-24">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute -bottom-40 -left-40 w-60 h-60 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="z-10">
            <p data-animate className="text-[#DD3131] font-bold tracking-widest text-sm mb-4 uppercase">
              Automate your meals. Maximize your budget.
            </p>
            <h1 data-animate className="text-5xl lg:text-7xl font-black text-q-dark leading-[1.1] mb-6">
              Effortless Meal <br />
              <span className="text-[#DD3131]">Planning.</span>
              <br />
              Smart Financial Living
            </h1>
            <p data-animate className="text-lg text-gray-600 max-w-lg mb-8 leading-relaxed">
              Connect with vetted chefs, subscribe to plans, and enjoy
              stress-free meals. No more last-minute decisions or overspending.
            </p>

            {/* Icon Features */}
            <div data-animate className="flex flex-wrap gap-6 mb-10 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2 clay-card px-4 py-2">
                <span className="text-[#DD3131]">📅</span> Pre-Planned Meals
              </div>
              <div className="flex items-center gap-2 clay-card px-4 py-2">
                <span className="text-[#DD3131]">💵</span> Budget Optimization
              </div>
              <div className="flex items-center gap-2 clay-card px-4 py-2">
                <span className="text-[#DD3131]">➕</span> Curated Local Chefs
              </div>
            </div>

            {/* CTA Buttons */}
            <div data-animate className="flex flex-wrap gap-4">
              <Link
                to="/plan"
                className="clay-button bg-primary text-white font-bold py-4 px-10 rounded-full shadow-lg cursor-pointer text-center hover:bg-red-700"
              >
                Start Your Meal Plan
              </Link>
              <Link
                to="/partner"
                className="clay-button bg-white border-2 border-gray-200 text-q-dark font-bold py-4 px-10 rounded-full cursor-pointer text-center hover:border-accent hover:bg-accent/10"
              >
                Join as Partner Chef
              </Link>
            </div>
          </div>

          {/* Right Content: Mobile Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div ref={mockupRef} className="relative w-full max-w-[320px] lg:max-w-[400px]">
              {/* Device Frame with claymorphism */}
              <div className="rounded-[2.8rem] clay p-[6px]">
                <div className="rounded-[2.4rem] bg-[#0E1013] overflow-hidden aspect-[9/19] border border-gray-800">
                  {/* Status Bar */}
                  <div className="h-6 px-4 flex items-center justify-between text-[10px] text-gray-400">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <span>●●●</span>
                      <span>▮▮▮</span>
                    </div>
                  </div>

                  {/* App Screen Content */}
                  <div className="h-full w-full px-4 pb-6 pt-3 flex flex-col gap-4 bg-[#121417]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#DD3131] rounded-full flex items-center justify-center text-xs font-extrabold text-white clay-button">
                        Q
                      </div>
                      <div className="leading-tight">
                        <p className="text-white text-sm font-semibold uppercase tracking-wider">
                          QAVAEAT
                        </p>
                        <p className="text-gray-500 text-[10px]">
                          Smart Meal Planning
                        </p>
                      </div>
                    </div>

                    {/* Budget Card */}
                    <div className="clay-card bg-[#1E2126] p-4 border-gray-800">
                      <p className="text-gray-400 text-[10px] uppercase font-semibold tracking-wider">
                        Weekly Savings
                      </p>
                      <div className="flex items-end justify-between mt-2">
                        <p className="text-white text-2xl font-extrabold">
                          KES 3,000
                        </p>
                        <p className="text-xs text-[#F4CD2E] font-medium">
                          Saved
                        </p>
                      </div>
                      <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full w-[60%] bg-[#F4CD2E] rounded-full" />
                      </div>
                    </div>

                    {/* Meal Item Card */}
                    <div className="clay-card bg-[#1E2126] p-3 border-gray-800 flex items-center gap-3">
                       <div className="w-10 h-10 bg-gray-700 rounded-lg clay-inset"></div>
                       <div>
                         <p className="text-white text-xs font-bold">Chef Amina's Pilau</p>
                         <p className="text-gray-500 text-[10px]">Mon • Wed • Fri</p>
                       </div>
                    </div>

                    <div className="clay-card bg-[#181B20] rounded-2xl border-dashed border-gray-700 flex flex-col items-center justify-center gap-2 text-center px-6 flex-1">
                      <p className="text-[#F4CD2E] text-sm font-bold">
                        Order Confirmed!
                      </p>
                      <p className="text-gray-500 text-[11px] leading-relaxed">
                        Your chef is preparing your menu for the upcoming week.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subtle shadow beneath device */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/10 rounded-full blur-xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}