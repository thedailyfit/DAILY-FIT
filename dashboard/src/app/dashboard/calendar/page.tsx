'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Users } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Session {
    id: string;
    title: string;
    date: Date;
    time: string;
    type: 'session' | 'task';
    clientName?: string;
}

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [sessions, setSessions] = useState<Session[]>([])
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    // Form state
    const [newTask, setNewTask] = useState({ title: '', date: '', time: '', type: 'session' })

    useEffect(() => {
        fetchSessions()
    }, [])

    const fetchSessions = async () => {
        setLoading(true)
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { setLoading(false); return }

            const { data, error } = await supabase
                .from('calendar_events')
                .select('*')
                .eq('trainer_id', user.id)
                .order('event_date', { ascending: true })

            if (!error && data) {
                const mapped: Session[] = data.map((e: any) => ({
                    id: e.id,
                    title: e.title,
                    date: new Date(e.event_date),
                    time: e.event_time || '12:00 PM',
                    type: e.event_type || 'task',
                    clientName: e.client_name || undefined
                }))
                setSessions(mapped)
            }
        } catch (err) {
            console.error('Error loading calendar events:', err)
        } finally {
            setLoading(false)
        }
    }

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const days = new Date(year, month + 1, 0).getDate()
        const firstDay = new Date(year, month, 1).getDay()
        return { days, firstDay }
    }

    const { days, firstDay } = getDaysInMonth(currentDate)
    const daysArray = Array.from({ length: days }, (_, i) => i + 1)
    const blanksArray = Array.from({ length: firstDay }, (_, i) => i)
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    const today = () => setCurrentDate(new Date())

    const handleAddTask = async () => {
        if (!newTask.title || !newTask.date) return
        
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('calendar_events')
                .insert([{
                    trainer_id: user.id,
                    title: newTask.title,
                    event_date: newTask.date,
                    event_time: newTask.time || '12:00 PM',
                    event_type: newTask.type
                }])
                .select()
                .single()

            if (!error && data) {
                const newEvent: Session = {
                    id: data.id,
                    title: data.title,
                    date: new Date(data.event_date),
                    time: data.event_time || '12:00 PM',
                    type: data.event_type || 'task'
                }
                setSessions(prev => [...prev, newEvent])
            }
        } catch (err) {
            console.error('Error saving event:', err)
        }
        
        setIsAddOpen(false)
        setNewTask({ title: '', date: '', time: '', type: 'session' })
    }

    const getEventsForDay = (day: number) => {
        return sessions.filter(s => 
            s.date.getDate() === day && 
            s.date.getMonth() === currentDate.getMonth() && 
            s.date.getFullYear() === currentDate.getFullYear()
        ).sort((a, b) => a.time.localeCompare(b.time))
    }

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-background text-foreground">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase flex items-center gap-3">
                        <CalendarIcon className="h-8 w-8 text-primary" /> Calendar
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium">Manage your sessions and tasks.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-card border rounded-lg p-1 mr-4 shadow-sm">
                        <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="ghost" className="font-bold text-sm mx-2" onClick={today}>Today</Button>
                        <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                    
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md">
                                <Plus className="h-4 w-4 mr-2" /> New Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Event</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Session with John..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <Input type="date" value={newTask.date} onChange={e => setNewTask({...newTask, date: e.target.value})} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Time</Label>
                                        <Input type="time" value={newTask.time} onChange={e => setNewTask({...newTask, time: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <select 
                                        className="w-full border bg-background text-foreground rounded-md h-10 px-3"
                                        value={newTask.type} 
                                        onChange={e => setNewTask({...newTask, type: e.target.value})}
                                    >
                                        <option value="session">Client Session</option>
                                        <option value="task">Personal Task</option>
                                    </select>
                                </div>
                                <Button className="w-full mt-4" onClick={handleAddTask}>Save Event</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Calendar Grid */}
            <Card className="border shadow-sm rounded-2xl overflow-hidden bg-card">
                <CardHeader className="border-b bg-muted/30 pb-4">
                    <CardTitle className="text-xl font-bold text-center">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-7 border-b">
                        {weekDays.map(day => (
                            <div key={day} className="py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider border-r last:border-0">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 auto-rows-fr">
                        {blanksArray.map(i => (
                            <div key={`blank-${i}`} className="min-h-[120px] bg-muted/10 border-r border-b"></div>
                        ))}
                        {daysArray.map(day => {
                            const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();
                            const dayEvents = getEventsForDay(day);
                            
                            return (
                                <div key={day} className={`min-h-[140px] p-2 border-r border-b last:border-r-0 transition-colors hover:bg-muted/20 ${isToday ? 'bg-primary/5' : ''}`}>
                                    <div className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-2 ${isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                                        {day}
                                    </div>
                                    <div className="space-y-1">
                                        {dayEvents.map(event => (
                                            <div 
                                                key={event.id} 
                                                className={`text-[10px] sm:text-xs p-1.5 rounded-md font-medium truncate flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 shadow-sm ${
                                                    event.type === 'session' 
                                                    ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20' 
                                                    : 'bg-purple-500/10 text-purple-700 border border-purple-500/20'
                                                }`}
                                                title={`${event.time} - ${event.title}`}
                                            >
                                                {event.type === 'session' ? <Users className="h-3 w-3 shrink-0" /> : <Clock className="h-3 w-3 shrink-0" />}
                                                <span className="truncate">{event.time} {event.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
