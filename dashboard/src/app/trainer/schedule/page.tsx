"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Calendar as CalendarIcon,
    Clock,
    User,
    Plus,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

interface ScheduleEvent {
    id: string;
    title: string;
    clientName: string;
    time: string;
    duration: number;
    type: 'session' | 'consultation' | 'followup';
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TrainerSchedulePage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState<ScheduleEvent[]>([]);

    // Get calendar days
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // Add empty cells for days before the first day
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Add all days in month
        for (let d = 1; d <= lastDay.getDate(); d++) {
            days.push(new Date(year, month, d));
        }

        return days;
    };

    const navigateMonth = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = (date: Date) => {
        return date.toDateString() === selectedDate.toDateString();
    };

    // Mock events for demonstration
    useEffect(() => {
        setEvents([
            { id: '1', title: 'PT Session', clientName: 'John Doe', time: '09:00', duration: 60, type: 'session' },
            { id: '2', title: 'Check-in', clientName: 'Jane Smith', time: '11:00', duration: 30, type: 'followup' },
            { id: '3', title: 'New Client', clientName: 'Mike Johnson', time: '14:00', duration: 45, type: 'consultation' },
        ]);
    }, [selectedDate]);

    const getEventColor = (type: string) => {
        switch (type) {
            case 'session': return 'bg-blue-500';
            case 'consultation': return 'bg-green-500';
            case 'followup': return 'bg-orange-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                        <CalendarIcon className="h-8 w-8 text-primary" />
                        Schedule
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage your training sessions</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Session
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Days header */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {daysOfWeek.map(day => (
                                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {getDaysInMonth(currentDate).map((date, i) => (
                                <button
                                    key={i}
                                    onClick={() => date && setSelectedDate(date)}
                                    disabled={!date}
                                    className={`
                                        aspect-square p-2 rounded-lg text-sm font-medium transition-all
                                        ${!date ? 'invisible' : ''}
                                        ${date && isToday(date) ? 'bg-primary text-primary-foreground' : ''}
                                        ${date && isSelected(date) && !isToday(date) ? 'bg-primary/20 border-2 border-primary' : ''}
                                        ${date && !isToday(date) && !isSelected(date) ? 'hover:bg-muted' : ''}
                                    `}
                                >
                                    {date?.getDate()}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Day View */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </CardTitle>
                        <CardDescription>{events.length} sessions scheduled</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {events.length === 0 ? (
                            <div className="text-center py-8">
                                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No sessions scheduled</p>
                            </div>
                        ) : (
                            events.map((event) => (
                                <div
                                    key={event.id}
                                    className="p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-1 h-12 rounded-full ${getEventColor(event.type)}`} />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{event.title}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {event.duration}min
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <Clock className="h-3 w-3" />
                                                {event.time}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="h-3 w-3" />
                                                {event.clientName}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
