export default function Footer() {
    return (
      <footer className="bg-q-dark text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1">
              <div className="text-3xl font-black text-primary tracking-tighter mb-4">
                QAVAEAT
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Automating your meals, maximizing your budget. The future of personal culinary experiences and smart financial living.
              </p>
            </div>
  
            {/* Platform Links */}
            <div>
              <h4 className="font-bold text-accent mb-6 uppercase text-xs tracking-widest">Platform</h4>
              <ul className="space-y-4 text-sm text-gray-300">
                <li><a href="#" className="hover:text-primary transition-colors">For Foodies</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">For Chefs</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Meal Planning</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              </ul>
            </div>
  
            {/* Company Links */}
            <div>
              <h4 className="font-bold text-accent mb-6 uppercase text-xs tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm text-gray-300">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
  
            {/* Social & Contact */}
            <div>
              <h4 className="font-bold text-accent mb-6 uppercase text-xs tracking-widest">Connect</h4>
              <div className="flex gap-4 mb-6">
                {/* Simple Icon Placeholders */}
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-all">𝕏</a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-all">IG</a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-all">LN</a>
              </div>
              <p className="text-sm text-gray-400">Contact: hello@qavaeat.com</p>
            </div>
          </div>
  
          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs text-center md:text-left">
              © {new Date().getFullYear()} Qavaeat Technologies. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-gray-500 text-xs font-medium uppercase tracking-tighter">System Status: Optimal</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }