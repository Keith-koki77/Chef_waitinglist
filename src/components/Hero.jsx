import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-off-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="z-10">
            <p className="text-[#DD3131] font-bold tracking-widest text-sm mb-4 uppercase">
              Automate your meals. Maximize your budget.
            </p>
            <h1 className="text-5xl lg:text-7xl font-black text-q-dark leading-[1.1] mb-6">
              Effortless Meal <br />
              <span className="text-[#DD3131]">Planning.</span>
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
                <span className="text-[#DD3131]">📅</span> Pre-Planned Meals
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#DD3131]">💵</span> Budget Optimization
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#DD3131]">➕</span> Curated Local Chefs
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/plan"
                className="bg-[#DD3131] hover:bg-red-700 text-white font-bold py-4 px-10 rounded-full transition-all shadow-lg hover:shadow-red-200 cursor-pointer text-center"
              >
                Start Your Meal Plan
              </Link>
              <Link
                to="/partner"
                className="bg-white border-2 border-gray-100 hover:border-[#F4CD2E] text-q-dark font-bold py-4 px-10 rounded-full transition-all cursor-pointer text-center"
              >
                Join as Partner Chef
              </Link>
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

                  {/* App Screen Content */}
                  <div className="h-full w-full px-4 pb-6 pt-3 flex flex-col gap-4 bg-[#121417]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#DD3131] rounded-full flex items-center justify-center text-xs font-extrabold text-white">
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
                    <div className="bg-[#1E2126] p-4 rounded-2xl border border-gray-800">
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
                    <div className="bg-[#1E2126] p-3 rounded-2xl border border-gray-800 flex items-center gap-3">
                       <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                       <div>
                         <p className="text-white text-xs font-bold">Chef Amina's Pilau</p>
                         <p className="text-gray-500 text-[10px]">Mon • Wed • Fri</p>
                       </div>
                    </div>

                    <div className="flex-1 bg-[#181B20] rounded-2xl border border-dashed border-gray-700 flex flex-col items-center justify-center gap-2 text-center px-6">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}