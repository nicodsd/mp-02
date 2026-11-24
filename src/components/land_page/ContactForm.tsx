"use client";
import React, { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";

interface ContactFormProps {
  messagePlaceholder: string;
}

export default function ContactForm({ messagePlaceholder }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    setTimeout(() => {
      if (formData.name && formData.email) {
        emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          formData,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        );
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 md:p-8 rounded-2xl border border-gray-300">
      <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:flex-1">
            <label htmlFor="name" className="block text-sm font-bold text-stone-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base text-stone-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Pizzería La Esquina"
            />
          </div>
          <div className="md:flex-1">
            <label htmlFor="email" className="block text-sm font-bold text-stone-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base text-stone-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="email@ejemplo.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-bold text-stone-700 mb-2">
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base text-stone-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder={messagePlaceholder}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-primary hover:bg-primary-500 hover:shadow-md text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 cursor-pointer"
        >
          {status === "loading" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Contactar
              <Send className="h-5 w-5" />
            </>
          )}
        </button>
        {status === "success" && (
          <p className="text-green-600 text-sm text-center font-medium mt-2 transition-all">
            ¡Mensaje enviado con éxito!
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600 text-sm text-center font-medium mt-2 transition-all">
            Error al enviar el mensaje. Intenta de nuevo.
          </p>
        )}
      </form>
    </div>
  );
}
