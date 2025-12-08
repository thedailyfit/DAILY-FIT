"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

const profileFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }).optional(),
    age: z.coerce.number().min(18).optional(),
    phone_number: z.string().min(10, {
        message: "Phone number must be at least 10 digits.",
    }).optional(),
    city: z.string().min(2).optional(),
    profile_picture_url: z.string().url().optional().or(z.literal("")),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function SettingsProfilePage() {
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: "",
            email: "",
            age: undefined,
            phone_number: "",
            city: "",
            profile_picture_url: "",
        },
    })

    useEffect(() => {
        async function loadProfile() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data: trainer } = await supabase
                    .from('trainers')
                    .select('*')
                    .eq('trainer_id', user.id)
                    .single()

                if (trainer) {
                    form.reset({
                        name: trainer.name || "",
                        email: user.email || "", // Email usually comes from auth user
                        age: trainer.age,
                        phone_number: trainer.phone_number || "",
                        city: trainer.city || "",
                        profile_picture_url: trainer.profile_picture_url || "",
                    })
                }
            } catch (error) {
                console.error("Error loading profile:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadProfile()
    }, [supabase, form])

    async function onSubmit(data: ProfileFormValues) {
        setIsSaving(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("No user found")

            const { error } = await supabase
                .from('trainers')
                .update({
                    name: data.name,
                    age: data.age,
                    phone_number: data.phone_number,
                    city: data.city,
                    profile_picture_url: data.profile_picture_url || null,
                })
                .eq('trainer_id', user.id)

            if (error) throw error

            alert("Profile updated successfully!")

        } catch (error) {
            console.error("Error updating profile:", error)
            alert("Failed to update profile. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto py-10">
            <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">
                    This is how others will see you on the site.
                </p>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Age</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="30" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="New York" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+1234567890" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="profile_picture_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Profile Picture URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Public URL to your profile picture.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Profile
                    </Button>
                </form>
            </Form>
        </div>
    )
}
