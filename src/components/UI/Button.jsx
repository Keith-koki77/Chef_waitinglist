import React from 'react';

const Button = ({ 
    children, 
    onClick, 
    type = "button", 
    variant = "primary", 
    size = "md", 
    className = "", 
    disabled = false,
    loading = false 
}) => {
    
    // Base styles (The Qavaeat DNA)
    const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed clay-button";

    // Style Variants
    const variants = {
        primary: "bg-primary text-white hover:bg-red-700 shadow-[0_4px_15px_rgba(221,49,49,0.4)]",
        secondary: "bg-accent text-q-dark hover:bg-yellow-400 shadow-[0_4px_15px_rgba(244,205,46,0.4)]",
        outline: "bg-transparent border-2 border-q-dark text-q-dark hover:bg-q-dark hover:text-white",
        ghost: "text-gray-400 hover:text-q-dark bg-transparent",
        danger: "bg-white border-2 border-red-100 text-primary hover:bg-red-50 shadow-[0_4px_10px_rgba(221,49,49,0.2)]"
    };

    // Size Variants
    const sizes = {
        sm: "px-4 py-2 text-[8px] rounded-xl",
        md: "px-8 py-3 text-[10px] rounded-2xl",
        lg: "px-10 py-4 text-xs rounded-3xl",
        full: "w-full py-4 text-xs rounded-3xl"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {loading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;