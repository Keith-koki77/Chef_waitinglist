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
    const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    // Style Variants
    const variants = {
        primary: "bg-black text-white hover:bg-[#DD3131] shadow-lg",
        secondary: "bg-[#DD3131] text-white hover:bg-black shadow-lg",
        outline: "border-2 border-black text-black hover:bg-black hover:text-white",
        ghost: "text-gray-400 hover:text-black",
        danger: "bg-white border-2 border-red-100 text-[#DD3131] hover:bg-red-50"
    };

    // Size Variants
    const sizes = {
        sm: "px-4 py-2 text-[8px] rounded-xl",
        md: "px-8 py-4 text-[10px] rounded-2xl",
        lg: "px-10 py-6 text-xs rounded-3xl",
        full: "w-full py-6 text-xs rounded-3xl"
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
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;