"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "Will this replace my reception staff?",
        answer: "It won't replace them, but it will give them superpowers. Your staff can focus on building relationships in the gym floor, while DailyFit handles the repetitive WhatsApp replies, payments, and scheduling in the background."
    },
    {
        question: "I have 200+ members. Is migration hard?",
        answer: "No. We have a 'White-Glove' import feature. You send us your Excel sheet or current software export, and we set everything up for you. You can be live in under 24 hours."
    },
    {
        question: "Does it work with my personal WhatsApp Number?",
        answer: "Yes, you can connect any WhatsApp number (Personal or Business). The AI acts as a 'Virtual Assistant' on that number. You can take over the chat manually at any time."
    },
    {
        question: "Can I create custom diet plans, or is it only AI?",
        answer: "You have full control. You can use our AI to generate a baseline plan in seconds, and then tweak it perfectly to your style. It saves you 90% of the typing time."
    },
    {
        question: "Do you take a commission on payments?",
        answer: "Zero. We are a software provider, not a bank. You keep 100% of your membership fees. We just help you collect them faster with automated reminders."
    },
    {
        question: "What if I get stuck?",
        answer: "We are available on WhatsApp 24/7. Since we are built for Indian gym owners, we understand your specific needs and respond instantly."
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 container mx-auto px-4 md:px-6 max-w-4xl">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
                <p className="text-gray-400 text-lg">Real questions from gym owners like you.</p>
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
