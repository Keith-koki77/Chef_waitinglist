import { useEffect } from "react";
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import JoinWaitlist from './components/JoinWaitlist';
import Footer from './components/Footer';

function App() {

  useEffect(() => {
    document.title = "Qavaeat | Effortless Meal Planning";
  }, []);

  return (
    <div className="antialiased">
      <nav className="flex items-center justify-between px-10 py-6 bg-off-white border-b border-gray-200">
        <div className="text-[1.6rem] font-extrabold text-primary tracking-tight">
          QAVAEAT
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
          Coming Soon on iOS & Android
        </div>
      </nav>

      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <JoinWaitlist />
        <Footer />
      </main>

      <footer className="py-10 bg-q-dark text-white text-center">
        <p>© 2026 Qavaeat. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;