export default function Hero() {
  // Smooth scroll function
  const scrollToWaitlist = () => {
    const element = document.getElementById('join-waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-off-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="z-10">
            <p className="text-primary font-bold tracking-widest text-sm mb-4 uppercase">
              Automate your meals. Maximize your budget.
            </p>
            <h1 className="text-5xl lg:text-7xl font-black text-q-dark leading-[1.1] mb-6">
              Effortless Meal <br />
              <span className="text-primary">Planning.</span>
              <br />
              Smart Financial Living
            </h1>
            <p className="text-lg text-gray-600 max-w-lg mb-8 leading-relaxed">
              Connect with vetted chefs, subscribe to plans, and enjoy
              stress-free meals. No more last-minute decisions or overspending.
            </p>

            {/* Icon Features */}
            <div className="flex flex-wrap gap-6 mb-10 text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-primary">📅</span> Pre-Planned Meals
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">💵</span> Budget Optimization
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">➕</span> Curated Local Chefs
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToWaitlist}
                className="bg-primary hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-primary/30 cursor-pointer"
              >
                Start Your Meal Plan
              </button>
              <button
                onClick={scrollToWaitlist}
                className="bg-white border-2 border-gray-100 hover:border-accent text-q-dark font-bold py-4 px-8 rounded-full transition-all cursor-pointer"
              >
                Join as Partner Chef
              </button>
            </div>
          </div>

          {/* Right Content: Mobile Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[320px] lg:max-w-[400px]">
              {/* Device Frame */}
              <div className="rounded-[2.8rem] bg-q-dark p-[6px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]">
                <div className="rounded-[2.4rem] bg-[#0E1013] overflow-hidden aspect-[9/19] border border-gray-800">
                  {/* Status Bar */}
                  <div className="h-6 px-4 flex items-center justify-between text-[10px] text-gray-400">
                    <span>9:41</span>
                    <div className="flex gap-1">
                      <span>●●●</span>
                      <span>▮▮▮</span>
                    </div>
                  </div>

                  {/* App Screen */}
                  <div className="h-full w-full px-4 pb-6 pt-3 flex flex-col gap-4 bg-[#121417]">
                    {/* App Header */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-xs font-extrabold text-white">
                        Q
                      </div>
                      <div className="leading-tight">
                        <p className="text-white text-sm font-semibold">
                          QAVAEAT
                        </p>
                        <p className="text-gray-500 text-[10px]">
                          Smart Meal Planning
                        </p>
                      </div>
                    </div>

                    {/* Budget Card */}
                    <div className="bg-[#1E2126] p-4 rounded-2xl border border-gray-800">
                      <p className="text-gray-400 text-[10px] uppercase font-semibold tracking-wider">
                        Weekly Budget
                      </p>
                      <div className="flex items-end justify-between mt-2">
                        <p className="text-white text-2xl font-extrabold">
                          KES 3,000
                        </p>
                        <p className="text-xs text-green-400 font-medium">
                          On track
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full w-[60%] bg-primary rounded-full" />
                      </div>
                    </div>

                    {/* Visual Placeholder / Journey */}
                    <div className="flex-1 bg-[#181B20] rounded-2xl border border-dashed border-gray-700 flex flex-col items-center justify-center gap-2 text-center px-6">
                      <p className="text-gray-400 text-xs font-medium">
                        Visualizing your
                      </p>
                      <p className="text-white text-sm font-semibold">
                        Culinary Journey
                      </p>
                      <p className="text-gray-500 text-[11px] leading-relaxed">
                        Track meals, budgets, and progress effortlessly in one
                        place.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}