/* eslint-disable react/no-unescaped-entities */
"use client";


import { useEffect } from "react";
import { X } from "lucide-react";

interface VerificationNoticeProps {
    email: string;
    onClose: () => void;
}

export default function VerificationNotice({ email, onClose }: VerificationNoticeProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 10000); // Auto close after 10 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="w-full max-w-md bg-gradient-to-b from-[#15192b] to-[#0f1117] rounded-xl border border-white/10 shadow-xl p-6">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-white">Verify your email</h2>
                    <button 
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <p className="text-white/70 mb-4">
                    We've sent a verification link to <span className="text-white font-medium">{email}</span>. 
                    Please check your inbox and click the link to verify your account.
                </p>
                <div className="text-sm text-white/50">
                    <p>Can't find the email? Check your spam folder or</p>
                    <button className="text-[#3f4da8] hover:text-[#28368f] transition-colors">
                        click here to resend
                    </button>
                </div>
            </div>
        </div>
    );
}