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
    const router = useRouter()
    const supabase = createClient()

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

                // 1. Sign Up with Supabase Auth
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
                if (!authData.user) throw new Error("Registration failed")

                const userId = authData.user.id

                // 2. Create Gym if Gym Owner
                if (formData.role === 'gym_owner') {
                    const { data: gymData, error: gymError } = await supabase
                        .from('gyms')
                        .insert([{
                            gym_name: formData.gymName,
                            owner_id: userId,
                            city: formData.city,
                            plan_type: 'pro',
                            subscription_status: 'pending'
                        }])
                        .select()
                        .single()

                    if (gymError) throw new Error("Failed to create gym: " + gymError.message)

                    // Redirect to Pro Plan billing
                    router.push('/gym/billing?plan=pro&new=true')
                } else {
                    // Solo Trainer - 7-day free trial
                    const { error: gymError } = await supabase
                        .from('gyms')
                        .insert([{
                            gym_name: `${formData.name}'s Training`,
                            owner_id: userId,
                            plan_type: 'basic',
                            subscription_status: 'trial',
                            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                        }])

                    if (gymError) console.error("Gym creation error:", gymError)

                    router.push('/dashboard?welcome=true')
                }

            } else {
                // LOGIN
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                })

                if (error) throw error

                // Middleware will handle redirect based on role
                router.push('/dashboard')
            }
        } catch (err: any) {
            setError(err.message || "An error occurred")
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
            <div className="relative w-full max-w-4xl h-[600px] perspective-1000">
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
                        <div className="flex h-full rounded-3xl overflow-hidden shadow-2xl">
                            {/* Left: Form */}
                            <div className="w-1/2 bg-white p-10 flex flex-col justify-center">
                                <div className="mb-8">
                                    <h1 className="text-3xl font-black text-gray-900 mb-2">Sign In</h1>
                                    <p className="text-gray-500">Welcome back to DailyFit</p>
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

                                <p className="mt-6 text-center text-sm text-gray-500">
                                    <a href="#" className="text-purple-600 hover:underline">Forgot your password?</a>
                                </p>
                            </div>

                            {/* Right: CTA Panel */}
                            <div className="w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 p-10 flex flex-col items-center justify-center text-white text-center">
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
                        <div className="flex h-full rounded-3xl overflow-hidden shadow-2xl">
                            {/* Left: CTA Panel */}
                            <div className="w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 p-10 flex flex-col items-center justify-center text-white text-center">
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
                            <div className="w-1/2 bg-white p-8 flex flex-col justify-center overflow-y-auto">
                                <div className="mb-6">
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
