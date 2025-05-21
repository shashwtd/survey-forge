"use client";

import { signUpAction } from "@/app/actions";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import VerificationNotice from "@/components/VerificationNotice";

export default function SignUp() {
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

    return (
        <>
            <div className="space-y-1.5 mb-6">
                <h1 className="text-2xl font-semibold tracking-tight text-white font-instrument-sans">
                    Create an account
                </h1>
                <p className="text-white/60">
                    Enter your details below to get started
                </p>
            </div>
            <hr className="mb-5 opacity-10" />
            <form
                className="space-y-4"
                onChange={handleFormChange}
                action={async (formData) => {
                    const result = await signUpAction(formData);
                    // Handle the result of the sign-up action
                    console.log(result);
                }}
            >
                <div className="flex flex-col space-y-1">
                    <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none text-white/75 tracking-wide"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="flex h-10 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#fff4] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="name@example.com"
                    />
                </div>

                <div className="flex flex-col space-y-1">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium leading-none text-white/75 tracking-wide"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            required
                            minLength={6}
                            className="flex h-10 w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#3f4da8] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Create a password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!isValid || pending}
                    formAction={signUpAction}
                    className="inline-flex relative w-full items-center justify-center rounded-md bg-[#3f4da8] px-4 py-2 text-sm font-medium text-white hover:bg-[#38459c] focus:outline-none focus:ring-2 focus:ring-[#fff4] focus:ring-offset-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                    {pending ? "Creating account..." : "Create account"}
                    {pending && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-[#3f4da8]/95">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        </div>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-white/60">
                Already have an account?{" "}
                <Link href="/login" className="text-white hover:text-white/80">
                    Sign in
                </Link>
            </div>

            {showVerification && (
                <VerificationNotice
                    email={userEmail}
                    onClose={() => setShowVerification(false)}
                />
            )}

            {typeof window !== "undefined" &&
                window.location.search.includes("error") && (
                    <p className="mt-4 text-sm text-red-400 text-center">
                        Something went wrong. Please try again.
                    </p>
                )}
        </>
    );
}
