'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lock, UserPlus, LogIn, Building2, User } from 'lucide-react'

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    // Form State
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [role, setRole] = useState<'trainer' | 'gym_owner'>('trainer')
    const [gymName, setGymName] = useState('')

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            if (isSignUp) {
                // --- SIGN UP LOGIC ---

                // 1. Sign Up with Supabase Auth
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                            phone: phone,
                        }
                    }
                })

                if (authError) throw authError
                if (!authData.user) throw new Error("No user created")

                const userId = authData.user.id
                let newGymId = null;

                // 2. If Gym Owner, Create Gym First
                if (role === 'gym_owner') {
                    if (!gymName) throw new Error("Gym Name is required for Gym Owners")

                    const { data: gymData, error: gymError } = await supabase
                        .from('gyms')
                        .insert([{
                            name: gymName,
                            owner_id: userId,
                            subscription_status: 'active'
                        }])
                        .select()
                        .single()

                    if (gymError) throw new Error("Failed to create Gym: " + gymError.message)
                    newGymId = gymData.id
                }

                // 3. Create Trainer Profile (Linked to User & Optional Gym)
                const { error: dbError } = await supabase
                    .from('trainers')
                    .insert([
                        {
                            id: userId, // Link to Auth ID
                            // trainer_id: userId, // Assuming legacy column might exist, map both for safety if migration transitional
                            name: name,
                            full_name: name, // New column
                            email: email,
                            phone_number: phone, // New column
                            role: role, // 'trainer' or 'gym_owner'
                            gym_id: newGymId, // Null if independent trainer
                            specialization: 'General Fitness',
                        }
                    ])

                if (dbError) {
                    console.error("DB Error:", dbError)
                    throw new Error("Account created but profile failed: " + dbError.message)
                }

                setMessage("Registration successful! Redirecting to setup billing...")
                // Redirect to Payment Mandate for new users
                setTimeout(() => {
                    router.push('/dashboard/billing/mandate')
                }, 1500)
                // setIsSignUp(false) // No need to return to login, go forward

            } else {
                // --- LOGIN LOGIC ---
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (error) throw error

                // Redirect based on role
                // Fetch role first? 
                const { data: userData } = await supabase.from('trainers').select('role').eq('email', email).single()

                if (userData?.role === 'super_admin') router.push('/admin')
                else if (userData?.role === 'gym_owner') router.push('/gym')
                else router.push('/dashboard')
            }
        } catch (err: any) {
            setError(err.message || "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 transition-colors duration-500" data-theme="minimalist">
            <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />

            <Card className="w-full max-w-md relative z-10 shadow-xl border-slate-200">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 bg-violet-100 rounded-full flex items-center justify-center text-violet-600">
                            {isSignUp ? <UserPlus className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        {isSignUp ? 'Create your DailyFit Account' : 'Welcome back'}
                    </CardTitle>
                    <CardDescription>
                        {isSignUp ? 'Join as a Trainer or Gym Owner' : 'Enter your credentials to access your dashboard'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full border-slate-300 bg-white text-black hover:bg-gray-50 flex items-center gap-2 h-11 font-medium text-md shadow-sm"
                            onClick={() => {
                                setLoading(true);
                                setTimeout(() => router.push('/dashboard'), 1500);
                            }}
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Sign in with Google
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500">Or continue with</span>
                            </div>
                        </div>
                        <form onSubmit={handleAuth} className="space-y-4">

                            {isSignUp && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">WhatsApp</Label>
                                            <Input id="phone" placeholder="+91 98765..." value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>I am registering as:</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div
                                                className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${role === 'trainer' ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-slate-200 hover:border-slate-300'}`}
                                                onClick={() => setRole('trainer')}
                                            >
                                                <User className="h-5 w-5" />
                                                <span className="text-sm font-medium">Trainer</span>
                                            </div>
                                            <div
                                                className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${role === 'gym_owner' ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-slate-200 hover:border-slate-300'}`}
                                                onClick={() => setRole('gym_owner')}
                                            >
                                                <Building2 className="h-5 w-5" />
                                                <span className="text-sm font-medium">Gym Owner</span>
                                            </div>
                                        </div>
                                    </div>

                                    {role === 'gym_owner' && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <Label htmlFor="gymName">Gym / Studio Name</Label>
                                            <Input id="gymName" placeholder="e.g. Iron Pump Fitness" value={gymName} onChange={(e) => setGymName(e.target.value)} required />
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>

                            {error && <div className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">{error}</div>}
                            {message && <div className="text-sm text-green-600 text-center bg-green-50 p-2 rounded">{message}</div>}

                            <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={loading}>
                                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-500">
                                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                                <button
                                    type="button"
                                    onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
                                    className="ml-1 text-violet-600 hover:underline font-medium"
                                >
                                    {isSignUp ? 'Sign In' : 'Sign Up Now'}
                                </button>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
