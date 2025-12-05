'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, UserPlus, LogIn } from 'lucide-react'

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            if (isSignUp) {
                // Sign Up Flow
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                })

                if (authError) throw authError

                if (authData.user) {
                    // Create Trainer Record
                    const { error: dbError } = await supabase
                        .from('trainers')
                        .insert([
                            {
                                trainer_id: authData.user.id,
                                name: name,
                                email: email, // Assuming there's an email column, or we rely on auth
                                specialization: 'General Fitness', // Default
                                whatsapp_id: '', // To be filled later
                            }
                        ])

                    if (dbError) {
                        console.error("Error creating trainer record:", dbError)
                        // Continue anyway as auth was successful, but warn
                    }

                    setMessage("Registration successful! Please check your email to confirm your account.")
                    setIsSignUp(false) // Switch back to login
                }
            } else {
                // Login Flow
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (error) throw error
                router.push('/dashboard')
            }
        } catch (err: any) {
            setError(err.message || "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            {isSignUp ? <UserPlus className="w-6 h-6 text-primary" /> : <Lock className="w-6 h-6 text-primary" />}
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">
                        {isSignUp ? 'Trainer Registration' : 'Trainer Login'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isSignUp ? 'Create a new account to manage clients' : 'Enter your credentials to access the dashboard'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        {isSignUp && (
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={isSignUp}
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="trainer@dailyfit.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="text-sm text-green-600 text-center bg-green-50 p-2 rounded">
                                {message}
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                        </Button>
                    </form>

                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp)
                                setError(null)
                                setMessage(null)
                            }}
                            className="text-sm text-primary hover:underline"
                        >
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </CardContent>
                <CardFooter className="text-center text-sm text-gray-500 justify-center">
                    Protected Area. Authorized Personnel Only.
                </CardFooter>
            </Card>
        </div>
    )
}
