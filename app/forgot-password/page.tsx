'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-2xl font-medium tracking-tight text-white">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                        We'll send you a link to reset your password
                    </p>
                </div>

                {submitted ? (
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 text-green-500 mb-2">
                            <CheckCircle2 size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-white">Check your email</h3>
                        <p className="text-sm text-zinc-400">
                            We've sent a password reset link to <span className="text-white">{email}</span>.
                        </p>
                        <Link
                            href="/login"
                            className="block w-full py-3 px-4 bg-white text-zinc-950 font-semibold rounded-lg hover:bg-zinc-200 transition-colors text-sm"
                        >
                            Back to login
                        </Link>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded flex items-center gap-2">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-zinc-400 mb-1">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 sm:text-sm"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-zinc-950 bg-white hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? 'Sending link...' : 'Send reset link'}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft size={14} />
                                Back to login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
