"use client";

import { signUpAction } from "@/app/actions";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import VerificationNotice from "@/components/VerificationNotice";
import { useRouter } from "next/navigation";
import SlackAuthButton from "@/components/auth/SlackAuthButton";

export default function SignUp() {
    const router = useRouter();
    const { pending } = useFormStatus();
    const [isValid, setIsValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        setIsValid(form.checkValidity());
        setUserEmail(form.email.value);
    };

    useEffect(() => {
        if (typeof window !== "undefined" && window.location.search.includes("success")) {
            router.push("/survey/create");
        }
    }, [router]);

    return (
        <div className="w-full max-w-sm mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-white font-instrument-sans">
                    Create account
                </h1>
                <p className="text-base text-white/60">
                    Get started with Survey Forge
                </p>
            </div>

            <div className="space-y-6">
                <SlackAuthButton mode="signup" />
                
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="px-4 text-white/40 bg-[#09090b]">or</span>
                    </div>
                </div>

                <form
                    className="space-y-5"
                    onChange={handleFormChange}
                    action={async (formData) => {
                        const result = await signUpAction(formData);
                        console.log(result);
                    }}
                >
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="flex h-11 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#fff4] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Email address"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    minLength={6}
                                    className="flex h-11 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Create a password (min. 6 characters)"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || pending}
                        formAction={signUpAction}
                        className="inline-flex relative w-full items-center justify-center rounded-md bg-[#3f4da8] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#38459c] focus:outline-none focus:ring-2 focus:ring-[#fff4] focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                        {pending ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                            "Create account"
                        )}
                    </button>
                </form>
            </div>

            <div className="text-center text-sm">
                <span className="text-white/40">Already have an account?</span>{" "}
                <Link href="/login" className="text-white hover:text-white/80 font-medium">
                    Sign in
                </Link>
            </div>

            {showVerification && (
                <VerificationNotice
                    email={userEmail}
                    onClose={() => setShowVerification(false)}
                />
            )}

            {typeof window !== "undefined" && window.location.search.includes("error") && (
                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20">
                    <p className="text-sm text-red-400 text-center">
                        Something went wrong. Please try again.
                    </p>
                </div>
            )}
        </div>
    );
}
