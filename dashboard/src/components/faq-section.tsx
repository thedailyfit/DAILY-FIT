"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "Do I need to be 'tech-savvy' to use DailyFit?",
        answer: "Not at all! We built DailyFit specifically for gym owners, not software engineers. If you can use WhatsApp, you can use our system. Setup takes less than 10 minutes."
    },
    {
        question: "Does the AI Agent really work on my personal WhatsApp?",
        answer: "Yes! Connecting your WhatsApp takes 30 seconds (just scan a QR code). The AI will then reply to leads, book appointments, and send reminders from YOUR number, automatically."
    },
    {
        question: "Can I import my existing members from Excel?",
        answer: "Absolutely. We have a 'Bulk Import' feature. Just upload your Excel sheet, and all your members will be added instantly with their renewal dates and details."
    },
    {
        question: "What happens if the AI gives a wrong answer?",
        answer: "Our AI is 'Guardrailed' for fitness. It only answers questions based on the gym data you provide. If it gets stuck, it politely hands over the conversation to you."
    },
    {
        question: "Are the diet plans Indian-friendly?",
        answer: "100%. We include 15+ templates specifically for Indian diets (North Indian, South Indian, Vegetarian, Jain, Non-Veg) with local food items."
    },
    {
        question: "Is my member data safe?",
        answer: "Your data is encrypted and stored securely. We do not share your member data with anyone. You own your data completely."
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
                <p className="text-gray-400 text-lg">Everything you need to know about automating your gym.</p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, idx) => (
                    <div
                        key={idx}
                        className={`border rounded-xl overflow-hidden transition-colors duration-200 ${openIndex === idx ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 bg-card/30'}`}
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-6 text-left"
                        >
                            <span className={`font-semibold text-lg ${openIndex === idx ? 'text-blue-200' : 'text-white'}`}>
                                {faq.question}
                            </span>
                            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-blue-400' : 'text-gray-400'}`} />
                        </button>

                        <AnimatePresence>
                            {openIndex === idx && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="px-6 pb-6 text-gray-300 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    );
}
