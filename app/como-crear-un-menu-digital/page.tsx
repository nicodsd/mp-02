"use client";
import React, { useState } from 'react';
import { Send, Mail, MapPin, Loader2 } from 'lucide-react';
import Navbar from "@/src/components/land_page/Navbar";
import Footer from "@/src/components/land_page/Footer";

export default function ContactoPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        restaurant: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            <div className="flex selection:bg-primary selection:text-white relative bg-background-2 flex-col items-center w-full min-h-auto">
                <Navbar isIndex={false} />
                <div style={{ background: "#fffbf8", padding: "40px 0" }}>

                </div>
            </div>
            <Footer />
        </>
    );
}