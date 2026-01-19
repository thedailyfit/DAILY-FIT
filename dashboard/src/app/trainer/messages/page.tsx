"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    MessageSquare,
    Send,
    Phone,
    Search,
    CheckCheck,
    Clock
} from "lucide-react";

interface Conversation {
    memberId: string;
    memberName: string;
    phone: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
}

interface Message {
    id: string;
    sender: 'user' | 'assistant';
    message: string;
    created_at: string;
}

export default function TrainerMessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [trainerId, setTrainerId] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        fetchTrainerAndConversations();
    }, []);

    const fetchTrainerAndConversations = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get trainer's staff ID
            const { data: staff } = await supabase
                .from('staff')
                .select('id, gym_id')
                .eq('auth_id', user.id)
                .single();

            if (!staff) return;
            setTrainerId(staff.id);

            // Get assigned clients with their last message
            const { data: members } = await supabase
                .from('members')
                .select('member_id, name, phone_number')
                .eq('assigned_trainer_id', staff.id);

            if (!members || members.length === 0) {
                setLoading(false);
                return;
            }

            // Build conversations from members
            const convos: Conversation[] = [];
            for (const member of members) {
                // Get last message
                const { data: chatHistory } = await supabase
                    .from('chat_history')
                    .select('message, created_at')
                    .eq('member_id', member.member_id)
                    .order('created_at', { ascending: false })
                    .limit(1);

                convos.push({
                    memberId: member.member_id,
                    memberName: member.name || 'Unknown',
                    phone: member.phone_number || '',
                    lastMessage: chatHistory?.[0]?.message || 'No messages yet',
                    lastMessageTime: chatHistory?.[0]?.created_at || new Date().toISOString(),
                    unreadCount: 0
                });
            }

            // Sort by most recent
            convos.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
            setConversations(convos);

        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectConversation = async (convo: Conversation) => {
        setSelectedConversation(convo);

        // Fetch messages for this member
        const { data } = await supabase
            .from('chat_history')
            .select('*')
            .eq('member_id', convo.memberId)
            .order('created_at', { ascending: true });

        setMessages(data || []);
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        // Insert message to chat_history
        const { error } = await supabase
            .from('chat_history')
            .insert({
                member_id: selectedConversation.memberId,
                sender: 'assistant',
                message: newMessage,
                metadata: { sent_by_trainer: trainerId }
            });

        if (!error) {
            setMessages([...messages, {
                id: crypto.randomUUID(),
                sender: 'assistant',
                message: newMessage,
                created_at: new Date().toISOString()
            }]);
            setNewMessage("");

            // TODO: Send via Twilio WhatsApp
        }
    };

    const filteredConversations = conversations.filter(c =>
        c.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = diff / (1000 * 60 * 60);

        if (hours < 24) {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (hours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    return (
        <div className="p-6 h-[calc(100vh-2rem)] flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                    <MessageSquare className="h-8 w-8 text-green-500" />
                    WhatsApp Messages
                </h1>
                <p className="text-muted-foreground">Chat with your assigned clients</p>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Conversations List */}
                <Card className="lg:col-span-1 flex flex-col">
                    <CardHeader className="pb-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search clients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-0">
                        <ScrollArea className="h-[500px]">
                            {loading ? (
                                <div className="p-4 text-center text-muted-foreground">Loading...</div>
                            ) : filteredConversations.length === 0 ? (
                                <div className="p-8 text-center">
                                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No conversations yet</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Your assigned clients will appear here
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {filteredConversations.map((convo) => (
                                        <button
                                            key={convo.memberId}
                                            onClick={() => selectConversation(convo)}
                                            className={`w-full p-4 text-left hover:bg-muted/50 transition-colors ${selectedConversation?.memberId === convo.memberId ? 'bg-muted' : ''
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-green-100 text-green-700">
                                                        {convo.memberName.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium truncate">{convo.memberName}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatTime(convo.lastMessageTime)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                                                        {convo.lastMessage}
                                                    </p>
                                                </div>
                                                {convo.unreadCount > 0 && (
                                                    <Badge className="bg-green-500">{convo.unreadCount}</Badge>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Chat Window */}
                <Card className="lg:col-span-2 flex flex-col">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <CardHeader className="border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-green-100 text-green-700">
                                                {selectedConversation.memberName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg">{selectedConversation.memberName}</CardTitle>
                                            <CardDescription className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {selectedConversation.phone}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        WhatsApp
                                    </Badge>
                                </div>
                            </CardHeader>

                            {/* Messages */}
                            <CardContent className="flex-1 p-4 overflow-auto">
                                <ScrollArea className="h-[400px] pr-4">
                                    <div className="space-y-4">
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.sender === 'assistant' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.sender === 'assistant'
                                                            ? 'bg-green-500 text-white rounded-br-md'
                                                            : 'bg-muted rounded-bl-md'
                                                        }`}
                                                >
                                                    <p className="text-sm">{msg.message}</p>
                                                    <div className={`flex items-center gap-1 justify-end mt-1 ${msg.sender === 'assistant' ? 'text-green-100' : 'text-muted-foreground'
                                                        }`}>
                                                        <span className="text-xs">
                                                            {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {msg.sender === 'assistant' && <CheckCheck className="h-3 w-3" />}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>

                            {/* Message Input */}
                            <div className="p-4 border-t">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                        className="flex-1"
                                    />
                                    <Button onClick={sendMessage} className="bg-green-500 hover:bg-green-600">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium">Select a conversation</h3>
                                <p className="text-muted-foreground">Choose a client to start messaging</p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
