'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from 'framer-motion'
import {
    Lock, UserPlus, LogIn, Building2, User, Mail, Phone,
    Eye, EyeOff, ArrowRight, Dumbbell, CheckCircle2, Sparkles,
    Crown, Zap
} from 'lucide-react'

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [forgotMode, setForgotMode] = useState(false)
    const [resetEmail, setResetEmail] = useState('')
    const [resetSent, setResetSent] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleGoogleSignIn = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });
        if (error) setError(error.message);
    };

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        role: 'solo_trainer' as 'solo_trainer' | 'gym_owner',
        gymName: '',
        city: ''
    })

    const updateForm = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isSignUp) {
                // Validation
                if (formData.password !== formData.confirmPassword) {
                    throw new Error("Passwords don't match")
                }
                if (formData.password.length < 6) {
                    throw new Error("Password must be at least 6 characters")
                }

                let userId = 'demo_user_' + Date.now()
                try {
                    const { data: authData, error: authError } = await supabase.auth.signUp({
                        email: formData.email,
                        password: formData.password,
                        options: {
                            data: {
                                full_name: formData.name,
                                phone: formData.phone,
                                role: formData.role
                            }
                        }
                    })

                    if (authError) throw authError
                    if (authData?.user?.id) userId = authData.user.id
                } catch (signUpErr: any) {
                    console.warn("Remote Supabase signup warning (using fallback session):", signUpErr.message);
                }

                document.cookie = `dailyfit_demo_auth=true; path=/; max-age=86400`
                document.cookie = `dailyfit_demo_email=${encodeURIComponent(formData.email)}; path=/; max-age=86400`

                // 2. Create Gym if Gym Owner
                try {
                    if (formData.role === 'gym_owner') {
                        await supabase
                            .from('gyms')
                            .insert([{
                                gym_name: formData.gymName,
                                owner_id: userId,
                                city: formData.city,
                                plan_type: 'pro',
                                subscription_status: 'pending'
                            }]);
                    } else {
                        await supabase
                            .from('gyms')
                            .insert([{
                                gym_name: `${formData.name}'s Training`,
                                owner_id: userId,
                                plan_type: 'basic',
                                subscription_status: 'trial',
                                trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                            }]);
                    }
                } catch (dbErr: any) {
                    console.warn("DB insert notice:", dbErr.message);
                }

                if (formData.role === 'gym_owner') {
                    document.cookie = `dailyfit_role=gym_owner; path=/; max-age=86400`
                    window.location.href = '/gym/billing?plan=pro&new=true'
                } else {
                    document.cookie = `dailyfit_role=solo_trainer; path=/; max-age=86400`
                    window.location.href = '/dashboard?welcome=true'
                }

            } else {
                // LOGIN (Solo Trainer Sign In)
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                })
                
                if (error) {
                    throw error;
                }

                // Set role cookie strictly for Solo / Regular Trainer
                document.cookie = `dailyfit_demo_auth=true; path=/; max-age=86400`
                document.cookie = `dailyfit_demo_email=${encodeURIComponent(formData.email)}; path=/; max-age=86400`
                document.cookie = `dailyfit_role=solo_trainer; path=/; max-age=86400`

                // Hard navigation to Solo Trainer Dashboard so middleware receives cookies
                window.location.href = '/dashboard'
            }
        } catch (err: any) {
            setError(err.message || "Authentication failed. Please check your credentials.");
        } finally {
            setLoading(false)
        }
    }

    const flipToSignUp = () => {
        setIsSignUp(true)
        setError(null)
    }

    const flipToLogin = () => {
        setIsSignUp(false)
        setError(null)
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
            </div>

            {/* Main Flip Card Container */}
            <div className="relative w-full max-w-4xl min-h-[600px] md:h-[600px] perspective-1000">
                <motion.div
                    className="relative w-full h-full"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: isSignUp ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                    {/* FRONT: Login Side */}
                    <div
                        className="absolute inset-0 w-full h-full backface-hidden"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div className="flex flex-col md:flex-row h-full rounded-3xl overflow-hidden shadow-2xl">
                            {/* Left: Form */}
                            <div className="w-full md:w-1/2 bg-white p-6 md:p-10 flex flex-col justify-center">
                                <div className="mb-8">
                                    <h1 className="text-3xl font-black text-gray-900 mb-2">Sign In</h1>
                                    <p className="text-gray-500">Welcome back to DailyFit</p>
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    className="w-full h-12 bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 font-bold rounded-xl flex items-center justify-center gap-3 mb-4 shadow-sm"
                                >
                                    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/></g></svg>
                                    Sign in with Google
                                </Button>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">or</span>
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                </div>

                                <form onSubmit={handleAuth} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label className="text-gray-700">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                type="email"
                                                placeholder="name@example.com"
                                                value={formData.email}
                                                onChange={(e) => updateForm('email', e.target.value)}
                                                className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-700">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={(e) => updateForm('password', e.target.value)}
                                                className="pl-10 pr-10 h-12 border-gray-200 focus:border-purple-500"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && !isSignUp && (
                                        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30"
                                        disabled={loading}
                                    >
                                        {loading ? 'Signing In...' : 'SIGN IN'}
                                    </Button>
                                </form>

                                {!forgotMode ? (
                                    <p className="mt-4 md:mt-6 text-center text-sm text-gray-500">
                                        <button type="button" onClick={() => setForgotMode(true)} className="text-purple-600 hover:underline">Forgot your password?</button>
                                    </p>
                                ) : (
                                    <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
                                        {resetSent ? (
                                            <div className="text-center space-y-2">
                                                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto" />
                                                <p className="text-sm text-green-700 font-medium">Reset link sent to {resetEmail}</p>
                                                <button type="button" onClick={() => { setForgotMode(false); setResetSent(false); setResetEmail(''); }} className="text-xs text-purple-600 hover:underline mt-2">Back to Login</button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <Label className="text-xs text-purple-900 font-bold">Reset Password</Label>
                                                <Input 
                                                    type="email" 
                                                    placeholder="Enter your email" 
                                                    value={resetEmail} 
                                                    onChange={(e) => setResetEmail(e.target.value)} 
                                                    className="h-10 text-sm bg-white"
                                                />
                                                <div className="flex gap-2">
                                                    <Button 
                                                        type="button" 
                                                        onClick={async () => {
                                                            if (!resetEmail) return;
                                                            await supabase.auth.resetPasswordForEmail(resetEmail);
                                                            setResetSent(true);
                                                        }} 
                                                        className="h-9 flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs"
                                                    >
                                                        Send Link
                                                    </Button>
                                                    <Button type="button" variant="ghost" onClick={() => setForgotMode(false)} className="h-9 text-xs text-gray-500">Cancel</Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* Mobile Flip Button */}
                                <div className="md:hidden mt-6 pt-6 border-t border-gray-100 text-center">
                                    <p className="text-sm text-gray-500 mb-3">Don't have an account?</p>
                                    <Button
                                        variant="outline"
                                        onClick={flipToSignUp}
                                        className="w-full font-bold text-purple-600 border-purple-200 hover:bg-purple-50"
                                    >
                                        Create Account
                                    </Button>
                                </div>
                            </div>

                            {/* Right: CTA Panel (Hidden on Mobile) */}
                            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 p-10 flex-col items-center justify-center text-white text-center">
                                <Dumbbell className="h-16 w-16 mb-6 opacity-80" />
                                <h2 className="text-3xl font-black mb-4">Hey There!</h2>
                                <p className="text-white/80 mb-8 max-w-xs">
                                    Begin your amazing journey by creating an account with us today
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={flipToSignUp}
                                    className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-purple-600 font-bold px-8 py-3 rounded-full transition-all"
                                >
                                    SIGN UP <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* BACK: Sign Up Side (Rotated 180) */}
                    <div
                        className="absolute inset-0 w-full h-full backface-hidden"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        <div className="flex flex-col md:flex-row h-full rounded-3xl overflow-hidden shadow-2xl">
                            {/* Left: CTA Panel (Hidden on Mobile) */}
                            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 p-10 flex-col items-center justify-center text-white text-center">
                                <Sparkles className="h-16 w-16 mb-6 opacity-80" />
                                <h2 className="text-3xl font-black mb-4">Welcome Back!</h2>
                                <p className="text-white/80 mb-8 max-w-xs">
                                    Already have an account? Sign in to access your dashboard
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={flipToLogin}
                                    className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-purple-600 font-bold px-8 py-3 rounded-full transition-all"
                                >
                                    SIGN IN <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>

                            {/* Right: Sign Up Form */}
                            <div className="w-full md:w-1/2 bg-white p-6 md:p-8 flex flex-col justify-center overflow-y-auto">
                                <div className="mb-4 md:mb-6">
                                    <h1 className="text-2xl font-black text-gray-900 mb-1">Create Account</h1>
                                    <p className="text-gray-500 text-sm">Join DailyFit today</p>
                                </div>

                                <form onSubmit={handleAuth} className="space-y-4">
                                    {/* Role Selection */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => updateForm('role', 'solo_trainer')}
                                            className={`p-3 border-2 rounded-xl flex flex-col items-center gap-1 transition-all ${formData.role === 'solo_trainer'
                                                ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <User className="h-5 w-5" />
                                            <span className="text-xs font-bold">Solo Trainer</span>
                                            <span className="text-[10px] text-gray-500">7-day free trial</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateForm('role', 'gym_owner')}
                                            className={`p-3 border-2 rounded-xl flex flex-col items-center gap-1 transition-all relative overflow-hidden ${formData.role === 'gym_owner'
                                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Crown className="h-5 w-5" />
                                            <span className="text-xs font-bold">Gym Owner</span>
                                            <span className="text-[10px] text-amber-600 font-medium">PRO PLAN</span>
                                        </button>
                                    </div>

                                    {/* Name & Phone */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-gray-700 text-xs">Full Name</Label>
                                            <Input
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={(e) => updateForm('name', e.target.value)}
                                                className="h-10 text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-gray-700 text-xs">WhatsApp</Label>
                                            <Input
                                                placeholder="+91 98765..."
                                                value={formData.phone}
                                                onChange={(e) => updateForm('phone', e.target.value)}
                                                className="h-10 text-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Gym Owner Extra Fields */}
                                    {formData.role === 'gym_owner' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="grid grid-cols-2 gap-3"
                                        >
                                            <div>
                                                <Label className="text-gray-700 text-xs">Gym Name</Label>
                                                <Input
                                                    placeholder="Iron Pump Fitness"
                                                    value={formData.gymName}
                                                    onChange={(e) => updateForm('gymName', e.target.value)}
                                                    className="h-10 text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-gray-700 text-xs">City</Label>
                                                <Input
                                                    placeholder="Mumbai"
                                                    value={formData.city}
                                                    onChange={(e) => updateForm('city', e.target.value)}
                                                    className="h-10 text-sm"
                                                    required
                                                />
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Email */}
                                    <div>
                                        <Label className="text-gray-700 text-xs">Email</Label>
                                        <Input
                                            type="email"
                                            placeholder="name@example.com"
                                            value={formData.email}
                                            onChange={(e) => updateForm('email', e.target.value)}
                                            className="h-10 text-sm"
                                            required
                                        />
                                    </div>

                                    {/* Passwords */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-gray-700 text-xs">Password</Label>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={(e) => updateForm('password', e.target.value)}
                                                className="h-10 text-sm"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-gray-700 text-xs">Confirm</Label>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                value={formData.confirmPassword}
                                                onChange={(e) => updateForm('confirmPassword', e.target.value)}
                                                className="h-10 text-sm"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {error && isSignUp && (
                                        <div className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{error}</div>
                                    )}

                                    {/* Plan Info */}
                                    <div className={`p-3 rounded-xl text-xs ${formData.role === 'gym_owner'
                                        ? 'bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200'
                                        : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
                                        }`}>
                                        {formData.role === 'gym_owner' ? (
                                            <div className="flex items-center gap-2">
                                                <Crown className="h-4 w-4 text-blue-600" />
                                                <span className="font-medium text-blue-800">
                                                    Pro Gym: $59/month - Up to 20 clients
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Zap className="h-4 w-4 text-green-600" />
                                                <span className="font-medium text-green-800">
                                                    Starter: $29/month after 7-day free trial
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating Account...' : (
                                            formData.role === 'gym_owner' ? 'Continue to Billing →' : 'Start Free Trial'
                                        )}
                                    </Button>

                                    {/* Mobile Flip Button */}
                                    <div className="md:hidden mt-4 pt-4 border-t border-gray-100 text-center pb-8">
                                        <p className="text-xs text-gray-500 mb-2">Already have an account?</p>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={flipToLogin}
                                            className="font-bold text-purple-600 hover:bg-purple-50"
                                        >
                                            Sign In Instead
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* CSS for animations */}
            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    )
}
