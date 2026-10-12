import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate({
            targets: entry.target.querySelectorAll('.footer-column'),
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 600,
            easing: 'easeOutExpo',
            delay: stagger(100),
          });

          animate({
            targets: entry.target.querySelectorAll('.social-link'),
            scale: [0, 1],
            rotate: [-90, 0],
            duration: 500,
            easing: 'easeOutElastic(1, .5)',
            delay: stagger(100, { start: 400 }),
          });

          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="bg-q-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="footer-column col-span-1 md:col-span-1" style={{ opacity: 0 }}>
            <div className="text-3xl font-black text-primary tracking-tighter mb-4">
              QAVAEAT
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Automating your meals, maximizing your budget. The future of personal culinary experiences and smart financial living.
            </p>
          </div>
   
          {/* Platform Links */}
          <div className="footer-column" style={{ opacity: 0 }}>
            <h4 className="font-bold text-accent mb-6 uppercase text-xs tracking-widest">Platform</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-primary transition-colors clay-button p-2 rounded-xl w-full text-left bg-gray-800/50">For Foodies</a></li>
              <li><a href="#" className="hover:text-primary transition-colors clay-button p-2 rounded-xl w-full text-left bg-gray-800/50">For Chefs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors clay-button p-2 rounded-xl w-full text-left bg-gray-800/50">Meal Planning</a></li>
              <li><a href="#" className="hover:text-primary transition-colors clay-button p-2 rounded-xl w-full text-left bg-gray-800/50">Pricing</a></li>
            </ul>
          </div>
   
          {/* Company Links */}
          <div className="footer-column" style={{ opacity: 0 }}>
            <h4 className="font-bold text-accent mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><a href="#" className="hover:text-primary transition-colors clay-button p-2 rounded-xl w-full text-left bg-gray-800/50">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors clay-button p-2 rounded-xl w-full text-left bg-gray-800/50">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors clay-button p-2 rounded-xl w-full text-left bg-gray-800/50">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors clay-button p-2 rounded-xl w-full text-left bg-gray-800/50">Terms of Service</a></li>
            </ul>
          </div>
   
          {/* Social & Contact */}
          <div className="footer-column" style={{ opacity: 0 }}>
            <h4 className="font-bold text-accent mb-6 uppercase text-xs tracking-widest">Connect</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="social-link w-12 h-12 clay rounded-full flex items-center justify-center text-sm font-bold" style={{ transform: 'scale(0)' }}>𝕏</a>
              <a href="#" className="social-link w-12 h-12 clay rounded-full flex items-center justify-center text-sm font-bold" style={{ transform: 'scale(0)' }}>IG</a>
              <a href="#" className="social-link w-12 h-12 clay rounded-full flex items-center justify-center text-sm font-bold" style={{ transform: 'scale(0)' }}>LN</a>
            </div>
            <p className="text-sm text-gray-400">Contact: hello@qavaeat.com</p>
          </div>
        </div>
   
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} Qavaeat Technologies. All rights reserved.
          </p>
          <div className="clay-card px-4 py-2 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-gray-500 text-xs font-medium uppercase tracking-tighter">System Status: Optimal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}