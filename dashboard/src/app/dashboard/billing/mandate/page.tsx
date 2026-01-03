'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, CreditCard, Lock, Smartphone } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function PaymentMandatePage() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleComplete = () => {
        setLoading(true)
        // Simulate API call to save mandate
        setTimeout(() => {
            router.push('/dashboard')
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-none shadow-2xl rounded-[2rem] overflow-hidden">
                <div className="bg-primary/10 h-2 w-full">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }}></div>
                </div>

                <CardHeader className="text-center pt-8">
                    <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
                        <Lock className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-black">Secure Your Trial</CardTitle>
                    <CardDescription>
                        Set up a payment method to activate your 7-day free trial. You won't be charged today.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {step === 1 ? (
                        <div className="grid gap-4">
                            <Button
                                variant="outline"
                                className="h-20 justify-start px-6 gap-4 border-2 hover:border-primary hover:bg-primary/5 rounded-xl group"
                                onClick={() => setStep(2)}
                            >
                                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white text-slate-600 group-hover:text-primary">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-foreground">UPI AutoPay</p>
                                    <p className="text-xs text-muted-foreground">PhonePe, GPay, Paytm</p>
                                </div>
                            </Button>

                            <Button
                                variant="outline"
                                className="h-20 justify-start px-6 gap-4 border-2 hover:border-primary hover:bg-primary/5 rounded-xl group"
                                onClick={() => setStep(2)}
                            >
                                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white text-slate-600 group-hover:text-primary">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-foreground">Credit / Debit Card</p>
                                    <p className="text-xs text-muted-foreground">Visa, Mastercard, Rupay</p>
                                </div>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2">
                                <Label>UPI ID / VPA</Label>
                                <Input placeholder="username@upi" className="rounded-xl h-12" />
                            </div>
                            <div className="text-xs text-muted-foreground bg-slate-100 p-4 rounded-xl flex gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                                <p>₹1.00 will be deducted and refunded to verify your account.</p>
                            </div>
                            <Button onClick={handleComplete} className="w-full h-12 rounded-xl text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
                                {loading ? 'Verifying...' : 'Verify & Start Trial'}
                            </Button>
                            <Button variant="ghost" className="w-full" onClick={() => setStep(1)} disabled={loading}>Back</Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="bg-slate-50 p-4 text-center">
                    <p className="text-xs text-slate-400 w-full">Encrypted 256-bit Connection</p>
                </CardFooter>
            </Card>
        </div>
    )
}
