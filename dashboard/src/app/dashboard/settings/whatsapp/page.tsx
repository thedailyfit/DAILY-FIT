'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, CheckCircle, Smartphone, Globe, Lock } from "lucide-react"

export default function WhatsAppSettingsPage() {
    const [isConnected, setIsConnected] = useState(false)
    const [loading, setLoading] = useState(false)

    // Form
    const [phoneId, setPhoneId] = useState('')
    const [token, setToken] = useState('')

    const handleConnect = () => {
        setLoading(true)
        // Simulate API verification
        setTimeout(() => {
            setIsConnected(true)
            setLoading(false)
        }, 1500)
    }

    return (
        <div className="p-8 space-y-8 bg-background min-h-screen text-foreground transition-colors duration-300">
            <div>
                <h1 className="text-3xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">
                    <MessageSquare className="h-8 w-8 text-green-500" /> WhatsApp Integration
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">Connect your Meta Business Account to enable AI Chat & Broadcasts.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Configuration Card */}
                <Card className="border-border bg-card shadow-sm rounded-[2rem]">
                    <CardHeader>
                        <CardTitle>Connection Settings</CardTitle>
                        <CardDescription>Enter your API credentials from developers.facebook.com</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isConnected ? (
                            <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl flex flex-col items-center text-center space-y-3">
                                <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                                    <CheckCircle className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-green-600">Connected Successfully</h3>
                                <p className="text-sm text-muted-foreground">Your AI agent is now active and listening to messages on <strong>+91 *****-8821</strong>.</p>
                                <Button variant="outline" className="mt-4" onClick={() => setIsConnected(false)}>Disconnect</Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Phone Number ID</Label>
                                    <Input placeholder="e.g. 100582..." value={phoneId} onChange={(e) => setPhoneId(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Permanent Access Token</Label>
                                    <Input type="password" placeholder="EAAB..." value={token} onChange={(e) => setToken(e.target.value)} />
                                </div>
                                <div className="bg-muted/30 p-4 rounded-xl text-xs text-muted-foreground space-y-2">
                                    <p className="font-bold flex items-center gap-2"><Lock className="w-3 h-3" /> Security Note</p>
                                    <p>Your token is encrypted before storage. We use it only to send messages on your behalf.</p>
                                </div>
                                <Button onClick={handleConnect} disabled={loading || !phoneId || !token} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-12">
                                    {loading ? 'Verifying...' : 'Connect WhatsApp'}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Instructions / Benefit */}
                <div className="space-y-6">
                    <Card className="border-border bg-card shadow-sm rounded-[2rem]">
                        <CardHeader>
                            <CardTitle>Why Connect?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Feature icon={Smartphone} title="Direct Client Chat" desc="Clients message your business number, you reply from Dashboard." />
                            <Feature icon={Globe} title="AI Auto-Reply" desc="The AI Agent answers basic queries like 'Price?', 'Timing?' automatically." />
                            <Feature icon={MessageSquare} title="Bulk Broadcasts" desc="Send diet plans and updates to all clients in one click." />
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-primary/20 shadow-sm rounded-[2rem]">
                        <CardContent className="p-6">
                            <h4 className="font-bold text-primary mb-2">Need a Number?</h4>
                            <p className="text-sm text-muted-foreground mb-4">You need a phone number not currently used on WhatsApp consumer app.</p>
                            <Button variant="link" className="text-primary p-0 h-auto font-bold">Read Setup Guide &rarr;</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function Feature({ icon: Icon, title, desc }: any) {
    return (
        <div className="flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-foreground" />
            </div>
            <div>
                <h4 className="font-bold text-foreground text-sm">{title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
        </div>
    )
}
