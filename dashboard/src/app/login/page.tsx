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

                setMessage("Registration successful! Check your email to confirm.")
                setIsSignUp(false) // Return to login screen

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
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
            <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] pointer-events-none" />

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
                </CardContent>
            </Card>
        </div>
    )
}
