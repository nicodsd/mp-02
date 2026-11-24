"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { HOME_FAQS } from "@/src/data/faqs";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full pb-18 relative overflow-hidden flex flex-col items-center justify-center bg-background">

      <div className="text-start w-full mx-auto relative z-10">
        <div className="text-center md:text-start mb-10 md:mb-12 md:pl-12">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-base text-zinc-600">
            Resolvemos tus dudas más comunes de forma rápida y sencilla para que empieces a digitalizar tu menú de inmediato.
          </p>
        </div>

        <div className="space-y-2 md:px-12">
          {HOME_FAQS.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-white shadow-lg shadow-gray-200/80 border-gray-300 transform' : 'bg-background border-gray-300 hover:bg-background-2 hover:border-gray-300'}`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center p-5 md:px-12 text-left focus:outline-none"
                >
                  <span className="font-bold text-lg text-stone-700 pr-4">{faq.question}</span>
                  <span
                    className={`shrink-0 flex border border-gray-300 items-center justify-center w-10 h-10 rounded-full transition-transform duration-300 ${isOpen ? 'bg-black text-white rotate-180' : 'border-gray-500 text-gray-600'}`}
                  >
                    <ChevronDown size={22} aria-hidden="true" />
                  </span>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  hidden={!isOpen}
                  className="px-6 pb-5 md:px-12 md:pb-6 text-gray-600 leading-relaxed text-[15px] sm:text-base"
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
