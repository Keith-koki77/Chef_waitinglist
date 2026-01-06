import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Get current route to determine active menu item
    const currentRoute = route().current();
    
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    // Helper function to determine if a menu item is active
    const isActive = (routeName) => {
        if (routeName === 'welcome') {
            return currentRoute === 'welcome' || currentRoute === null;
        }
        return currentRoute === routeName;
    };

    // Active menu item classes
    const getActiveClasses = (routeName, isMobile = false) => {
        const isActiveItem = isActive(routeName);
        
        if (isMobile) {
            return isActiveItem 
                ? "block px-3 py-2 rounded-md text-base font-medium text-primary bg-orange-50 border-l-4 border-orange-500"
                : "block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-primary hover:bg-gray-50";
        }
        
        return isActiveItem 
            ? "text-primary font-semibold border-b-2 border-primary pb-1"
            : "text-gray-600 hover:text-primary transition duration-150 ease-in-out";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 text-gray-800">
            {/* Header & Navbar */}
            <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        
                        {/* --- RESPONSIVE LOGO --- */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center space-x-2">
                                <img 
                                    className="block h-20 w-auto" 
                                    src="/images/logo.png" 
                                    alt="BiteBank Logo" 
                                />
                                <span className="text-2xl sm:text-3xl font-bold text-gray-800">
                                    BiteBank
                                </span>
                            </Link>
                        </div>

                        {/* --- DESKTOP NAVIGATION --- */}
                        <nav className="hidden md:flex items-center space-x-6 text-lg">
                            <Link 
                                href={route('welcome')} 
                                className={getActiveClasses('welcome')}
                            >
                                Home
                            </Link>
                            <Link 
                                href={route('about')} 
                                className={getActiveClasses('about')}
                            >
                                About Us
                            </Link>
                            <Link 
                                href={route('news.index')} 
                                className={getActiveClasses('news.index')}
                            >
                                News
                            </Link>
                        </nav>

                        {/* --- DESKTOP SECONDARY NAVIGATION --- */}
                        <div className="hidden md:flex items-center space-x-4 text-lg">
                            <Link href={route('login')} className="text-gray-600 hover:text-primary transition duration-150 ease-in-out">
                                Login
                            </Link>
                            <Link href={route('register')} className="text-gray-600 hover:text-primary hover:bg-orange-50 border border-primary px-4 py-2 rounded-lg transition duration-200">
                                Sign Up
                            </Link>
                            <Link href="#" className="bg-accent hover:bg-yellow-500 text-black px-4 py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
                                Get the App
                            </Link>
                        </div>
                        
                        {/* --- MOBILE MENU BUTTON --- */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-gray-800 hover:text-primary focus:outline-none"
                            >
                                {isMobileMenuOpen ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- MOBILE MENU  --- */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white shadow-lg">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link 
                                href={route('welcome')} 
                                onClick={closeMobileMenu} 
                                className={getActiveClasses('welcome', true)}
                            >
                                Home
                            </Link>
                            <Link 
                                href={route('about')} 
                                onClick={closeMobileMenu} 
                                className={getActiveClasses('about', true)}
                            >
                                About Us
                            </Link>
                            <Link 
                                href={route('news.index')} 
                                onClick={closeMobileMenu} 
                                className={getActiveClasses('news.index', true)}
                            >
                                News
                            </Link>
                        </div>
                        <div className="pt-4 pb-3 border-t border-gray-200">
                            <div className="px-2 space-y-2">
                                <Link href={route('login')} onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
                                    Login
                                </Link>
                                <Link href={route('register')} onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-orange-600 border border-orange-500 hover:bg-orange-50">
                                    Sign Up
                                </Link>
                                <Link href="#" onClick={closeMobileMenu} className="block w-full text-center mt-2 px-3 py-2 rounded-md text-base font-medium text-black bg-accent hover:bg-yellow-600">
                                    Get the App
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Page Content */}
            <main>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* Company Info */}
                        <div className="md:col-span-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <img 
                                    className="h-20 w-auto" 
                                    src="/images/logo.png" 
                                    alt="BiteBank Logo" 
                                />
                                <span className="text-xl font-bold">BiteBank</span>
                            </div>
                            <p className="text-gray-300 mb-4 max-w-md">
                                Making professional dining effortless. Connect, discover, and enjoy the best culinary experiences in Kenya.
                            </p>
                            <p className="text-sm text-gray-400">
                                © {new Date().getFullYear()} BiteBank Kenya. All rights reserved.
                            </p>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                            <div className="flex space-x-4">
                                {/* Facebook */}
                                <a 
                                    href="https://facebook.com/bitebankkenya" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-primary transition duration-200"
                                    aria-label="Follow us on Facebook"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>

                                {/* Twitter/X */}
                                <a 
                                    href="https://twitter.com/bitebankkenya" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-primary transition duration-200"
                                    aria-label="Follow us on X"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                    </svg>
                                </a>

                                {/* Instagram */}
                                <a 
                                    href="https://instagram.com/bitebankkenya" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-primary transition duration-200"
                                    aria-label="Follow us on Instagram"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </a>

                                {/* LinkedIn */}
                                <a 
                                    href="https://linkedin.com/company/bitebank-kenya" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-primary transition duration-200"
                                    aria-label="Follow us on LinkedIn"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </a>

                                

                                {/* TikTok */}
                                <a 
                                    href="https://tiktok.com/@bitebankkenya" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-300 hover:text-primary transition duration-200"
                                    aria-label="Follow us on TikTok"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                                    </svg>
                                </a>

                                
                            </div>
                            
                            {/* Contact Info */}
                            <div className="mt-6 space-y-2 text-sm text-gray-300">
                                <p>📧 hello@bitebank.co.ke</p>
                                <p>📱 +254 700 000 000</p>
                                <p>📍 Nairobi, Kenya</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}