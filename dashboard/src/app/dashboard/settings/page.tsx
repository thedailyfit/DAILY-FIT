'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Save, User, MapPin, Phone, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone_number: z.string().optional(),
    age: z.coerce.number().min(18, "Must be at least 18").optional(),
    city: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function SettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)
    const supabase = createClient()

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: '',
            email: '',
            phone_number: '',
            age: undefined,
            city: ''
        }
    })

    useEffect(() => {
        getProfile()
    }, [])

    async function getProfile() {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data, error } = await supabase
                    .from('trainers')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (error && error.code !== 'PGRST116') {
                    throw error
                }

                if (data) {
                    form.reset({
                        name: data.name || '',
                        email: data.email || user.email || '',
                        phone_number: data.phone_number || '',
                        age: data.age || undefined,
                        city: data.city || ''
                    })
                }
            }
        } catch (error) {
            console.error('Error loading user:', error)
        } finally {
            setLoading(false)
        }
    }

    async function onSubmit(data: ProfileFormValues) {
        setSaving(true)
        setFeedback(null)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user found')

            const { error } = await supabase
                .from('trainers')
                .upsert({
                    id: user.id,
                    name: data.name,
                    email: data.email,
                    phone_number: data.phone_number,
                    age: data.age,
                    city: data.city,
                    updated_at: new Date().toISOString(),
                })

            if (error) throw error

            setFeedback({ type: 'success', message: 'Profile updated successfully.' })
            setTimeout(() => setFeedback(null), 3000)
        } catch (error) {
            setFeedback({ type: 'error', message: 'Failed to update profile. Please try again.' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return <div className="flex justify-center p-8 bg-[#0a0a0a] min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-[#cbfe00]" /></div>
    }

    return (
        <div className="p-4 md:p-8 space-y-8 bg-[#0a0a0a] min-h-screen text-white">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                        Settings
                    </h1>
                    <p className="text-zinc-400 mt-2 font-medium">
                        Manage your profile and account preferences.
                    </p>
                </div>
                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={saving}
                    className="bg-[#cbfe00] hover:bg-[#b0dc00] text-black font-bold h-12 px-6 rounded-xl shadow-[0_0_20px_rgba(203,254,0,0.2)]"
                >
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>

            {feedback && (
                <div className={`p-4 rounded-xl border ${feedback.type === 'success' ? 'bg-green-900/20 border-green-900 text-green-400' : 'bg-red-900/20 border-red-900 text-red-400'}`}>
                    {feedback.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Form */}
                <Card className="col-span-2 bg-[#141414] border-zinc-800 shadow-xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="p-8 pb-4 border-b border-zinc-800">
                        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                            <User className="h-5 w-5 text-[#cbfe00]" />
                            Profile Information
                        </CardTitle>
                        <CardDescription className="text-zinc-500">
                            Updates here will be reflected across your trainer dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Full Name</Label>
                                    <Input
                                        {...form.register('name')}
                                        className="bg-[#222] border-zinc-700 text-white h-12 focus:border-[#cbfe00]"
                                    />
                                    {form.formState.errors.name && <p className="text-xs text-red-400">{form.formState.errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
                                        <Input
                                            {...form.register('email')}
                                            className="pl-10 bg-[#222] border-zinc-700 text-white h-12 focus:border-[#cbfe00]"
                                            disabled
                                        />
                                    </div>
                                    <p className="text-[10px] text-zinc-600">Email cannot be changed.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
                                        <Input
                                            {...form.register('phone_number')}
                                            placeholder="+1 234 567 890"
                                            className="pl-10 bg-[#222] border-zinc-700 text-white h-12 focus:border-[#cbfe00]"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">City / Location</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
                                        <Input
                                            {...form.register('city')}
                                            placeholder="New York, NY"
                                            className="pl-10 bg-[#222] border-zinc-700 text-white h-12 focus:border-[#cbfe00]"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Age</Label>
                                    <Input
                                        type="number"
                                        {...form.register('age')}
                                        className="bg-[#222] border-zinc-700 text-white h-12 focus:border-[#cbfe00]"
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
