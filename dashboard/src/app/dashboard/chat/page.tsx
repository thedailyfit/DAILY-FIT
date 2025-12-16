"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Phone, Video, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChatPage() {
    return (
        <div className="flex h-[calc(100vh-2rem)] gap-6 p-6">
            {/* Sidebar List */}
            <Card className="w-80 flex flex-col border-none shadow-xl bg-[#1A1A1A] text-white overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                    <h2 className="font-bold text-lg mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search chats..."
                            className="pl-9 bg-[#2A2A2A] border-none text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#CCFF00]"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`p-3 rounded-xl flex gap-3 cursor-pointer transition-colors ${i === 1 ? 'bg-[#2A2A2A]' : 'hover:bg-[#2A2A2A]'}`}>
                            <div className="relative">
                                <Avatar>
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                                    <AvatarFallback className="bg-[#CCFF00] text-black font-bold">U{i}</AvatarFallback>
                                </Avatar>
                                {i === 1 && <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#CCFF00] border-2 border-[#1A1A1A] rounded-full"></span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h4 className="font-semibold text-sm truncate">Client Name {i}</h4>
                                    <span className="text-xs text-gray-500">10:4{i} AM</span>
                                </div>
                                <p className="text-xs text-gray-400 truncate">Hey coach, check out my form video...</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col border-none shadow-xl bg-[#1A1A1A] text-white overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1A1A1A]">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={`https://i.pravatar.cc/150?u=1`} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold">Sarah Jenkins</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse"></span>
                                <span className="text-xs text-[#CCFF00]">Online Now</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="hover:bg-[#2A2A2A] text-gray-400 hover:text-white"><Phone className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon" className="hover:bg-[#2A2A2A] text-gray-400 hover:text-white"><Video className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon" className="hover:bg-[#2A2A2A] text-gray-400 hover:text-white"><MoreVertical className="h-5 w-5" /></Button>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#141414]">
                    <div className="flex justify-center"><span className="text-xs text-gray-600 bg-[#2A2A2A] px-3 py-1 rounded-full">Today, 10:30 AM</span></div>

                    <div className="flex gap-3">
                        <Avatar className="w-8 h-8 mt-1">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=1`} />
                            <AvatarFallback>SJ</AvatarFallback>
                        </Avatar>
                        <div className="bg-[#2A2A2A] p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                            <p className="text-sm">Morning Coach! Should I increase weights today?</p>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <div className="bg-[#CCFF00] text-black p-3 rounded-2xl rounded-tr-none max-w-[80%] font-medium shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                            <p className="text-sm">Absolutely! Try +2.5kg on the Squats if you felt good last time. 💪</p>
                        </div>
                        <Avatar className="w-8 h-8 mt-1">
                            <AvatarFallback className="bg-white text-black">ME</AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* Input */}
                <div className="p-4 bg-[#1A1A1A]">
                    <div className="flex gap-3 bg-[#2A2A2A] p-2 rounded-xl border border-gray-800 focus-within:border-[#CCFF00] transition-colors">
                        <Input
                            className="border-none bg-transparent focus-visible:ring-0 text-white placeholder:text-gray-500"
                            placeholder="Type a message..."
                        />
                        <Button size="icon" className="bg-[#CCFF00] hover:bg-[#bbe600] text-black rounded-lg shadow-[0_0_10px_rgba(204,255,0,0.4)]">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
