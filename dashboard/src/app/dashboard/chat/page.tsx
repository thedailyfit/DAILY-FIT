'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Send, MoreVertical, Bot, Smartphone, User, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Types
type Client = {
    id: string
    first_name: string
    last_name: string
    phone: string
    email: string
}

type Message = {
    id: number
    sender: 'agent' | 'trainer' | 'client_whatsapp'
    content: string
    timestamp: string
}

export default function ChatPage() {
    const supabase = createClient()
    const [clients, setClients] = useState<Client[]>([])
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [loading, setLoading] = useState(true)
    const [input, setInput] = useState('')

    // Simulated Conversation State per client (In real app, fetch from DB)
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        fetchClients()
    }, [])

    useEffect(() => {
        if (selectedClient) {
            // Load initial "Context" messages for this client
            setMessages([
                { id: 1, sender: 'agent', content: `Connected to ${selectedClient.first_name}'s WhatsApp stream. Monitoring for requests.`, timestamp: '09:00 AM' },
                { id: 2, sender: 'client_whatsapp', content: "Hey Coach, my knee hurts a bit during squats today. Should I skip?", timestamp: '10:30 AM' },
                { id: 3, sender: 'agent', content: `Analysis: Client reported injury (knee). I held off on auto-replying. Awaiting your guidance.`, timestamp: '10:31 AM' }
            ])
        }
    }, [selectedClient])

    const fetchClients = async () => {
        try {
            const { data, error } = await supabase.from('members').select('*')
            if (error) throw error
            if (data) {
                setClients(data)
                if (data.length > 0) setSelectedClient(data[0])
            }
        } catch (error) {
            console.error("Error fetching clients:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSend = () => {
        if (!input.trim()) return

        // Add Trainer Message
        const newMsg: Message = { id: Date.now(), sender: 'trainer', content: input, timestamp: 'Now' }
        setMessages(prev => [...prev, newMsg])
        setInput('')

        // Simulate Agent Reply
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'agent',
                content: `Understood. I will relay this to ${selectedClient?.first_name} via WhatsApp immediately.`,
                timestamp: 'Now'
            }])
        }, 1000)
    }

    return (
        <div className="flex h-[calc(100vh-2rem)] gap-6 p-4 md:p-6 bg-[#0a0a0a] text-white overflow-hidden">

            {/* LEFT SIDEBAR: CLIENT LIST */}
            <Card className="w-80 flex flex-col border-zinc-800 shadow-2xl bg-[#141414] text-white overflow-hidden rounded-[2rem]">
                <div className="p-5 border-b border-zinc-800 bg-[#1a1a1a]">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Smartphone className="h-5 w-5 text-[#cbfe00]" />
                        Inbox
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Search clients..."
                            className="pl-10 bg-[#222] border-none text-white placeholder:text-zinc-500 h-10 rounded-xl focus-visible:ring-1 focus-visible:ring-[#cbfe00]"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#cbfe00]" /></div>
                    ) : clients.length === 0 ? (
                        <div className="text-center p-8 text-zinc-500 text-sm">No clients found.</div>
                    ) : (
                        clients.map((client) => (
                            <div
                                key={client.id}
                                onClick={() => setSelectedClient(client)}
                                className={`p-3 rounded-xl flex gap-3 cursor-pointer transition-all border border-transparent ${selectedClient?.id === client.id ? 'bg-[#222] border-zinc-700 shadow-lg' : 'hover:bg-[#1f1f1f]'}`}
                            >
                                <Avatar className="h-10 w-10 border border-zinc-800">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${client.first_name}`} />
                                    <AvatarFallback className="bg-[#cbfe00] text-black font-bold">{client.first_name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className={`font-bold text-sm truncate ${selectedClient?.id === client.id ? 'text-white' : 'text-zinc-300'}`}>
                                            {client.first_name} {client.last_name}
                                        </h4>
                                        {selectedClient?.id === client.id && <span className="w-2 h-2 bg-[#cbfe00] rounded-full animate-pulse"></span>}
                                    </div>
                                    <p className="text-xs text-zinc-500 truncate flex items-center gap-1">
                                        <Bot className="h-3 w-3" /> Agent active
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            {/* RIGHT SIDE: AGENT INTERFACE */}
            <Card className="flex-1 flex flex-col border-zinc-800 shadow-2xl bg-[#141414] text-white overflow-hidden rounded-[2rem]">
                {selectedClient ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-[#1a1a1a]">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                        <Bot className="h-6 w-6 text-[#cbfe00]" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-[#141414] rounded-full p-0.5">
                                        <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-[#141414]"></div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">DailyFit Agent</h3>
                                    <p className="text-xs text-zinc-400 flex items-center gap-1">
                                        Mediating for: <span className="text-[#cbfe00] font-bold">{selectedClient.first_name} {selectedClient.last_name}</span>
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="hover:bg-[#222] text-zinc-400"><MoreVertical className="h-5 w-5" /></Button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#0a0a0a] custom-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'trainer' ? 'justify-end' : ''}`}>
                                    {/* Avatar Logic */}
                                    {msg.sender === 'agent' && (
                                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                                            <Bot className="h-5 w-5 text-[#cbfe00]" />
                                        </div>
                                    )}
                                    {msg.sender === 'client_whatsapp' && (
                                        <div className="w-8 h-8 rounded-full bg-green-900/20 flex items-center justify-center shrink-0 border border-green-500/30">
                                            <Smartphone className="h-4 w-4 text-green-500" />
                                        </div>
                                    )}

                                    {/* Bubble Logic */}
                                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'trainer'
                                            ? 'bg-[#cbfe00] text-black rounded-tr-none font-medium'
                                            : msg.sender === 'client_whatsapp'
                                                ? 'bg-[#1a1a1a] border border-green-900/50 text-green-200'
                                                : 'bg-[#1a1a1a] border border-zinc-800 text-zinc-300 rounded-tl-none'
                                        }`}>
                                        {msg.sender === 'client_whatsapp' && (
                                            <p className="text-[10px] font-bold text-green-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                <Smartphone className="h-3 w-3" /> Incoming from WhatsApp
                                            </p>
                                        )}
                                        {msg.content}
                                        <p className={`text-[10px] mt-2 opacity-50 ${msg.sender === 'trainer' ? 'text-black' : 'text-zinc-500'}`}>{msg.timestamp}</p>
                                    </div>

                                    {/* Trainer Avatar */}
                                    {msg.sender === 'trainer' && (
                                        <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center shrink-0">
                                            <User className="h-5 w-5 text-black" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-[#1a1a1a] border-t border-zinc-800">
                            <div className="flex gap-3 items-end bg-[#222] p-2 rounded-2xl border border-zinc-700 focus-within:border-[#cbfe00] transition-colors">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    className="border-none bg-transparent focus-visible:ring-0 text-white placeholder:text-zinc-500 h-10 py-2"
                                    placeholder={`Message Agent about ${selectedClient.first_name}...`}
                                />
                                <Button
                                    onClick={handleSend}
                                    size="icon"
                                    className="bg-[#cbfe00] hover:bg-[#b0dc00] text-black rounded-xl shadow-[0_0_15px_rgba(203,254,0,0.2)] h-10 w-10 shrink-0"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-center text-[10px] text-zinc-600 mt-2">
                                Your messages are processed by DailyFit AI before reaching the client via WhatsApp.
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                        <Bot className="h-16 w-16 mb-4 opacity-20" />
                        <h3 className="text-lg font-bold text-white mb-2">Select a Client</h3>
                        <p className="text-sm max-w-xs text-center">Open a conversation to manage WhatsApp interactions via the AI Agent.</p>
                    </div>
                )}
            </Card>
        </div>
    )
}
