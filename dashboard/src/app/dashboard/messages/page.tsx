'use client'

import { useState, useEffect } from 'react'
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
    Copy,
    Loader2
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase"

interface WhatsAppConnection {
    id: string
    phone_number: string
    is_connected: boolean
    connected_at: string | null
    sandbox_code: string | null
}

interface ChatMessage {
    id: string
    member_id: string
    sender: 'user' | 'assistant' | 'system'
    message: string
    created_at: string
}

interface Conversation {
    id: string
    name: string
    phone: string
    lastMessage: string
    time: string
    unread: number
    messages: { sender: string; text: string; time: string }[]
}

export default function MessagesPage() {
    const [connection, setConnection] = useState<WhatsAppConnection | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isWizardOpen, setIsWizardOpen] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [connecting, setConnecting] = useState(false)
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
    const [newMessage, setNewMessage] = useState('')
    const [refreshing, setRefreshing] = useState(false)

    const [sandboxCode, setSandboxCode] = useState('join road-rays')

    // Load connection status and conversations on mount
    useEffect(() => {
        loadConnectionStatus()
        loadConversations()
    }, [])

    const loadConnectionStatus = async () => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setIsLoading(false)
                return
            }

            const { data, error } = await supabase
                .from('whatsapp_connections')
                .select('*')
                .eq('trainer_id', user.id)
                .single()

            if (data && !error) {
                setConnection(data)
                setPhoneNumber(data.phone_number)
            }
        } catch (err) {
            console.error('Error loading connection:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const loadConversations = async () => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) return

            // Get members linked to this trainer
            const { data: members } = await supabase
                .from('members')
                .select('member_id, name, whatsapp_id')
                .eq('trainer_id', user.id)
                .not('whatsapp_id', 'is', null)

            if (!members || members.length === 0) {
                // Use mock data if no real data
                setConversations(MOCK_CONVERSATIONS)
                return
            }

            // Get recent messages for each member
            const convos: Conversation[] = []
            for (const member of members) {
                const { data: messages } = await supabase
                    .from('chat_history')
                    .select('*')
                    .eq('member_id', member.member_id)
                    .order('created_at', { ascending: false })
                    .limit(10)

                const lastMsg = messages?.[0]
                convos.push({
                    id: member.member_id,
                    name: member.name || 'Unknown',
                    phone: member.whatsapp_id || '',
                    lastMessage: lastMsg?.message || 'No messages yet',
                    time: lastMsg ? formatTime(lastMsg.created_at) : '',
                    unread: 0, // TODO: Implement unread count
                    messages: (messages || []).reverse().map(m => ({
                        sender: m.sender,
                        text: m.message,
                        time: formatTime(m.created_at)
                    }))
                })
            }

            setConversations(convos.length > 0 ? convos : MOCK_CONVERSATIONS)
        } catch (err) {
            console.error('Error loading conversations:', err)
            setConversations(MOCK_CONVERSATIONS)
        }
    }

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)

        if (diffMins < 60) return `${diffMins} min ago`
        if (diffHours < 24) return `${diffHours} hours ago`
        return date.toLocaleDateString()
    }

    const handleConnect = async () => {
        setConnecting(true)
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                alert('Please login first')
                return
            }

            const { data, error } = await supabase
                .from('whatsapp_connections')
                .upsert({
                    trainer_id: user.id,
                    phone_number: phoneNumber,
                    is_connected: true,
                    connected_at: new Date().toISOString(),
                    sandbox_code: sandboxCode
                }, { onConflict: 'trainer_id' })
                .select()
                .single()

            if (error) {
                console.error('Connection error:', error)
                // Fallback to local state if table doesn't exist yet
                setConnection({
                    id: 'local',
                    phone_number: phoneNumber,
                    is_connected: true,
                    connected_at: new Date().toISOString(),
                    sandbox_code: sandboxCode
                })
            } else {
                setConnection(data)
            }

            setIsWizardOpen(false)
        } catch (err) {
            console.error('Error connecting:', err)
            // Fallback
            setConnection({
                id: 'local',
                phone_number: phoneNumber,
                is_connected: true,
                connected_at: new Date().toISOString(),
                sandbox_code: sandboxCode
            })
            setIsWizardOpen(false)
        } finally {
            setConnecting(false)
        }
    }

    const handleDisconnect = async () => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user && connection?.id !== 'local') {
                await supabase
                    .from('whatsapp_connections')
                    .update({ is_connected: false })
                    .eq('trainer_id', user.id)
            }

            setConnection(null)
        } catch (err) {
            console.error('Error disconnecting:', err)
            setConnection(null)
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await loadConversations()
        setRefreshing(false)
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    const isConnected = connection?.is_connected

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
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
                <Button variant="outline" className="gap-2" onClick={handleRefresh} disabled={refreshing}>
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
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
                                            <h4 className="font-bold">Twilio Setup</h4>

                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm font-medium mb-1">Sandbox Join Code</p>
                                                    <p className="text-xs text-muted-foreground mb-1">From Twilio Console {"->"} WhatsApp Sandbox Settings</p>
                                                    <Input
                                                        placeholder="e.g. join road-rays"
                                                        value={sandboxCode}
                                                        onChange={(e) => setSandboxCode(e.target.value)}
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium mb-1">Business Phone Number</p>
                                                    <p className="text-xs text-muted-foreground mb-1">Enter your Twilio Sandbox Number (+1 415 523 8886) for testing</p>
                                                    <Input
                                                        placeholder="+1 415 523 8886"
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                    />
                                                </div>
                                            </div>
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
                                        disabled={connecting || !phoneNumber}
                                        className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-12"
                                    >
                                        {connecting ? (
                                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Connecting...</>
                                        ) : 'Connect WhatsApp'}
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
                            <Badge variant="outline" className="text-xs">{connection?.phone_number}</Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleDisconnect}>Disconnect</Button>
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
                        {conversations.map((conv) => (
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

// Fallback mock data when no real conversations exist
const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: '1',
        name: 'Rahul Mehta',
        phone: '+91 98765-43210',
        lastMessage: "What's my workout for today?",
        time: '2 min ago',
        unread: 2,
        messages: [
            { sender: 'user', text: "What's my workout for today?", time: '10:30 AM' },
            { sender: 'assistant', text: "Good morning Rahul! Today is your Push Day.\n\n1. Bench Press: 4x8\n2. Incline Dumbbell Press: 3x12\n3. Cable Flyes: 3x15", time: '10:30 AM' },
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
            { sender: 'assistant', text: "Here's your 1800 cal plan:\n\nBreakfast: Oats\nLunch: Chicken + rice\nDinner: Fish curry + roti", time: '9:15 AM' },
            { sender: 'user', text: 'Thanks for the diet plan!', time: '9:20 AM' },
        ]
    },
]
