"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToast = void 0;
const useToast = () => {
    const toast = ({ title, description }) => {
        console.log("Toast:", title, description);
        // In a real app, this would trigger a UI notification
        // For now, we'll just use browser alert as a fallback if needed, or rely on the console
    };
    return { toast };
};
exports.useToast = useToast;
