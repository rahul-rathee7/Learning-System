import React from "react";

const Button = ({
    children,
    onClick,
    type = "button",
    disabled = false,
    className = "",
    variant = "primary",
    size = "md",
}) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold rounded-sm border-2 border-black transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0 whitespace-nowrap";

    const variantSytles = {
        primary: "bg-[#ffd400] text-black shadow-[4px_4px_0px_#000] hover:bg-[#ffdf3a]",
        secondary: "bg-white text-black shadow-[4px_4px_0px_#000] hover:bg-[#f1f5f9]",
        outline: "bg-transparent text-black shadow-[4px_4px_0px_#000] hover:bg-black hover:text-[#f6f3ea]",
    };

    const sizeStyles = {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-5 text-sm"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={[
                baseStyles,
                variantSytles[variant],
                sizeStyles[size],
                className
            ].join(" ")}
        >
            {children}
        </button>
    );
};

export default Button