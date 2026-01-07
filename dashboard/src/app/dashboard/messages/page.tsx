'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    MessageSquare,
    CheckCircle,
    Smartphone,
    Globe,
    Lock,
    RefreshCw,
    Send,
    AlertCircle,
    Copy
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"

// Mock data for conversations
const MOCK_CONVERSATIONS = [
    {
        id: '1',
        name: 'Rahul Mehta',
        phone: '+91 98765-43210',
        lastMessage: "What's my workout for today?",
        time: '2 min ago',
        unread: 2,
        messages: [
            { sender: 'user', text: "What's my workout for today?", time: '10:30 AM' },
            { sender: 'ai', text: "Good morning Rahul! Today is your Push Day. Here's your workout:\n\n1. Bench Press: 4x8\n2. Incline Dumbbell Press: 3x12\n3. Cable Flyes: 3x15\n4. Shoulder Press: 4x10\n5. Lateral Raises: 3x15", time: '10:30 AM' },
        ]
    },
    {
        id: '2',
        name: 'Priya Sharma',
        phone: '+91 87654-32109',
        lastMessage: 'Thanks for the diet plan!',
        time: '1 hour ago',
        unread: 0,
        messages: [
            { sender: 'user', text: 'Can you send me my diet plan?', time: '9:15 AM' },
            { sender: 'ai', text: "Of course! Here's your 1800 cal cutting plan:\n\nBreakfast: Oats with almonds\nLunch: Grilled chicken + brown rice\nSnack: Protein shake\nDinner: Fish curry + roti (2)", time: '9:15 AM' },
            { sender: 'user', text: 'Thanks for the diet plan!', time: '9:20 AM' },
        ]
    },
    {
        id: '3',
        name: 'Amit Patel',
        phone: '+91 76543-21098',
        lastMessage: 'My weight is 72kg today',
        time: '3 hours ago',
        unread: 0,
        messages: [
            { sender: 'user', text: 'My weight is 72kg today', time: '7:00 AM' },
            { sender: 'ai', text: "Great progress Amit! You've lost 0.5kg this week. Keep it up! 💪", time: '7:00 AM' },
        ]
    },
]

export default function MessagesPage() {
    const [isConnected, setIsConnected] = useState(false)
    const [isWizardOpen, setIsWizardOpen] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedConversation, setSelectedConversation] = useState<typeof MOCK_CONVERSATIONS[0] | null>(null)
    const [newMessage, setNewMessage] = useState('')

    const sandboxCode = 'join daily-fitness'

    const handleConnect = () => {
        setLoading(true)
        setTimeout(() => {
            setIsConnected(true)
            setLoading(false)
            setIsWizardOpen(false)
        }, 1500)
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <div className="p-4 md:p-8 space-y-6 bg-background min-h-screen text-foreground transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight uppercase flex items-center gap-3">
                        <MessageSquare className="h-8 w-8 text-green-500" /> Messages
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium">
                        Manage WhatsApp conversations with your clients.
                    </p>
                </div>
                <Button variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" /> Refresh
                </Button>
            </div>

            {/* Connection Status Banner */}
            {!isConnected ? (
                <Card className="border-orange-500/30 bg-orange-500/5">
                    <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">WhatsApp Not Connected</h3>
                                <p className="text-sm text-muted-foreground">Connect your WhatsApp to start receiving client messages.</p>
                            </div>
                        </div>
                        <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold">
                                    Connect WhatsApp →
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <Smartphone className="h-5 w-5 text-green-500" /> Connect WhatsApp
                                    </DialogTitle>
                                    <DialogDescription>
                                        Follow these simple steps to connect your WhatsApp Business account.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6 py-4">
                                    {/* Step 1 */}
                                    <div className="flex gap-4">
                                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">1</div>
                                        <div className="space-y-2 flex-1">
                                            <h4 className="font-bold">Enter Your Business Phone Number</h4>
                                            <p className="text-sm text-muted-foreground">This is the number your clients will message.</p>
                                            <Input
                                                placeholder="+91 98765-43210"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="flex gap-4">
                                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">2</div>
                                        <div className="space-y-2 flex-1">
                                            <h4 className="font-bold">Send This Message from Your Phone</h4>
                                            <p className="text-sm text-muted-foreground">Open WhatsApp and send this exact message to:</p>
                                            <div className="bg-muted p-3 rounded-lg space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono text-sm">+1 415 523 8886</span>
                                                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard('+1 415 523 8886')}>
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="border-t pt-2">
                                                    <p className="text-xs text-muted-foreground">Message:</p>
                                                    <div className="flex items-center justify-between">
                                                        <code className="text-sm text-green-600 font-bold">{sandboxCode}</code>
                                                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(sandboxCode)}>
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="flex gap-4">
                                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">3</div>
                                        <div className="space-y-2 flex-1">
                                            <h4 className="font-bold">Click Connect</h4>
                                            <p className="text-sm text-muted-foreground">After sending the message, click below to verify.</p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleConnect}
                                        disabled={loading || !phoneNumber}
                                        className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-12"
                                    >
                                        {loading ? 'Verifying Connection...' : 'Connect WhatsApp'}
                                    </Button>

                                    <div className="bg-muted/50 p-3 rounded-lg flex gap-2 text-xs text-muted-foreground">
                                        <Lock className="h-4 w-4 shrink-0" />
                                        <span>Your number is encrypted and only used to route messages.</span>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-green-500/30 bg-green-500/5">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="font-medium text-green-600">WhatsApp Connected</span>
                            <Badge variant="outline" className="text-xs">+91 {phoneNumber || '98765-43210'}</Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setIsConnected(false)}>Disconnect</Button>
                    </CardContent>
                </Card>
            )}

            {/* Conversations Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
                {/* Conversation List */}
                <Card className="lg:col-span-1 overflow-hidden">
                    <CardHeader className="p-4 border-b">
                        <CardTitle className="text-base">Recent Conversations</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-y-auto max-h-[500px]">
                        {MOCK_CONVERSATIONS.map((conv) => (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv)}
                                className={`p-4 border-b cursor-pointer transition-colors hover:bg-muted/50 ${selectedConversation?.id === conv.id ? 'bg-muted' : ''}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                            {conv.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{conv.name}</p>
                                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">{conv.lastMessage}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">{conv.time}</p>
                                        {conv.unread > 0 && (
                                            <Badge className="mt-1 bg-green-500 text-white text-xs">{conv.unread}</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Chat View */}
                <Card className="lg:col-span-2 flex flex-col">
                    {selectedConversation ? (
                        <>
                            <CardHeader className="p-4 border-b flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                        {selectedConversation.name.charAt(0)}
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{selectedConversation.name}</CardTitle>
                                        <CardDescription className="text-xs">{selectedConversation.phone}</CardDescription>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                                    <Globe className="h-3 w-3 mr-1" /> AI Active
                                </Badge>
                            </CardHeader>
                            <CardContent className="flex-1 p-4 overflow-y-auto space-y-4 bg-muted/20 min-h-[300px]">
                                {selectedConversation.messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-xl text-sm ${msg.sender === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                                : 'bg-card border rounded-bl-none'
                                            }`}>
                                            <p className="whitespace-pre-line">{msg.text}</p>
                                            <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                                {msg.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                            <div className="p-4 border-t flex gap-2">
                                <Input
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1"
                                />
                                <Button className="bg-primary">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground min-h-[400px]">
                            <div className="text-center">
                                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Select a conversation to view messages</p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
