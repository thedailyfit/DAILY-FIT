'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Copy, Share2, QrCode, TrendingUp, DollarSign, Wallet } from "lucide-react"
import { createClient } from '@/lib/supabase'

export default function ReferralPage() {
    const [referralCode, setReferralCode] = useState('LOADING...')
    const [copied, setCopied] = useState(false)
    const [referralLink, setReferralLink] = useState('')

    // Mock Stats (Reset to 0 for production readiness)
    const stats = {
        totalReferred: 0,
        activeReferred: 0,
        pendingCommission: 0,
        totalEarned: 0,
        commissionRate: '12%'
    }

    useEffect(() => {
        const fetchReferral = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                // Fetch REAL code from DB
                const { data: gym } = await supabase
                    .from('gyms')
                    .select('referral_code')
                    .eq('gym_id', user.id)
                    .single()

                let code = gym?.referral_code

                // Lazy Generation: If no code exists (old user), generate one now
                if (!code) {
                    code = `TR-${user.id.substring(0, 4).toUpperCase()}${Math.floor(Math.random() * 99)}`;
                    // Ideally we save this back to DB here, but for now we just show it.
                    // In a real app we'd trigger an update:
                    // await supabase.from('gyms').update({ referral_code: code }).eq('gym_id', user.id)
                }

                setReferralCode(code || 'ERROR')
                // Point to our new Signup Page
                setReferralLink(`https://dailyfit.app/gym/signup?ref=${code}`)
            }
        }
        fetchReferral()
    }, [])

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShareWhatsapp = () => {
        const text = `Join me on DailyFit! Use my code ${referralCode} to get started and upgrade your fitness business. ${referralLink}`
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    }

    return (
        <div className="p-8 space-y-8 bg-background min-h-screen text-foreground transition-colors duration-300">
            <div>
                <h1 className="text-3xl font-black text-foreground tracking-tight uppercase">Refer & Earn</h1>
                <p className="text-muted-foreground mt-2 font-medium">Get upto {stats.commissionRate} of their subscription fee every month.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Referral Card */}
                <Card className="md:col-span-2 bg-gradient-to-br from-violet-600 to-indigo-700 text-white border-none shadow-xl rounded-[2rem] overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            <TrendingUp className="h-6 w-6 text-yellow-300" /> Recurring Income
                        </CardTitle>
                        <CardDescription className="text-violet-100/80 text-lg">
                            Get upto 12% of their subscription fee every month for 1 Year.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-6">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                            <label className="text-xs uppercase tracking-wider font-bold text-violet-200 mb-2 block">Your Unique Referral Link</label>
                            <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg">
                                <span className="flex-1 font-mono text-sm truncate px-2">{referralLink}</span>
                                <Button size="sm" variant="secondary" onClick={handleCopy} className="bg-white text-violet-700 hover:bg-white/90 font-bold">
                                    {copied ? 'Copied!' : <><Copy className="w-4 h-4 mr-1" /> Copy</>}
                                </Button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button onClick={handleShareWhatsapp} className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-12 rounded-xl shadow-lg border-none">
                                <Share2 className="w-5 h-5 mr-2" /> Share on WhatsApp
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* QR Scanner / Code */}
                <Card className="bg-card border-dashed border-2 border-primary/20 shadow-sm rounded-[2rem] flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-white p-4 rounded-xl mb-4 shadow-sm">
                        <QrCode className="w-32 h-32 text-zinc-900" />
                    </div>
                    <h3 className="font-bold text-foreground">Scan to Join</h3>
                    <p className="text-xs text-muted-foreground mt-1">Ask friends to scan this code directly.</p>
                </Card>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard icon={Users} label="Total Referred" value={stats.totalReferred} color="text-blue-500" bg="bg-blue-500/10" />
                <StatsCard icon={TrendingUp} label="Active Users" value={stats.activeReferred} color="text-green-500" bg="bg-green-500/10" />
                <StatsCard icon={DollarSign} label="Pending Comm." value={`₹${stats.pendingCommission}`} color="text-orange-500" bg="bg-orange-500/10" />
                <StatsCard icon={Wallet} label="Total Earned" value={`₹${stats.totalEarned}`} color="text-primary" bg="bg-primary/10" />
            </div>

            {/* How it works */}
            <Card className="rounded-[2rem] border-border bg-card">
                <CardHeader>
                    <CardTitle>How it Works</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Step number="1" title="Share your Link" desc="Send your unique link to other trainers or gym owners." />
                        <Step number="2" title="They Subscribe" desc="When they upgrade to a paid Plan (Basic or Pro)." />
                        <Step number="3" title="You Earn" desc="Get 12% of their subscription fee every month for 1 Year." />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function StatsCard({ icon: Icon, label, value, color, bg }: any) {
    return (
        <Card className="border-border bg-card shadow-sm rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl ${bg} ${color}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{label}</p>
                    <p className="text-2xl font-black text-foreground">{value}</p>
                </div>
            </CardContent>
        </Card>
    )
}

function Step({ number, title, desc }: any) {
    return (
        <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-black text-lg text-muted-foreground shrink-0 border border-border">
                {number}
            </div>
            <div>
                <h4 className="font-bold text-foreground text-lg">{title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
