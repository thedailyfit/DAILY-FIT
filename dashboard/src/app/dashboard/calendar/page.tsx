'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Users, Trash2, CalendarDays } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"

interface Session {
    id: string;
    title: string;
    date: Date;
    time: string;
    type: 'session' | 'task' | 'follow_up' | 'deadline';
    clientName?: string;
    color?: string;
    remarks?: string;
}

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [sessions, setSessions] = useState<Session[]>([])
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [view, setView] = useState<'month' | 'week'>('month')
    
    // Edit state
    const [editingEvent, setEditingEvent] = useState<Session | null>(null)
    const [isEditMode, setIsEditMode] = useState(false)

    // Form state
    const [newTask, setNewTask] = useState({ title: '', date: '', time: '', type: 'session', remarks: '' })

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
                    date: new Date(e.event_date + 'T00:00:00'), // ensure local date
                    time: e.event_time || '12:00 PM',
                    type: e.event_type || 'task',
                    clientName: e.client_name || undefined,
                    color: e.color || undefined,
                    remarks: e.remarks || undefined
                }))
                setSessions(mapped)
            }
        } catch (err) {
            console.error('Error loading calendar events:', err)
        } finally {
            setLoading(false)
        }
    }

    const openEditDialog = (event: Session) => {
        setEditingEvent(event)
        const year = event.date.getFullYear()
        const month = String(event.date.getMonth() + 1).padStart(2, '0')
        const day = String(event.date.getDate()).padStart(2, '0')

        setNewTask({
            title: event.title,
            date: `${year}-${month}-${day}`,
            time: event.time,
            type: event.type,
            remarks: event.remarks || ''
        })
        setIsEditMode(true)
        setIsAddOpen(true)
    }

    const openAddDialog = () => {
        setEditingEvent(null)
        const year = currentDate.getFullYear()
        const month = String(currentDate.getMonth() + 1).padStart(2, '0')
        const day = String(currentDate.getDate()).padStart(2, '0')
        
        setNewTask({ title: '', date: `${year}-${month}-${day}`, time: '12:00', type: 'session', remarks: '' })
        setIsEditMode(false)
        setIsAddOpen(true)
    }

    const handleSaveEvent = async () => {
        if (!newTask.title || !newTask.date) return
        
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            if (isEditMode && editingEvent) {
                const { data, error } = await supabase
                    .from('calendar_events')
                    .update({
                        title: newTask.title,
                        event_date: newTask.date,
                        event_time: newTask.time || '12:00 PM',
                        event_type: newTask.type
                    })
                    .eq('id', editingEvent.id)
                    .select()
                    .single()

                if (!error && data) {
                    setSessions(prev => prev.map(s => s.id === editingEvent.id ? {
                        ...s,
                        title: data.title,
                        date: new Date(data.event_date + 'T00:00:00'),
                        time: data.event_time || '12:00 PM',
                        type: data.event_type || 'task'
                    } : s))
                }
            } else {
                const { data, error } = await supabase
                    .from('calendar_events')
                    .insert([{
                        trainer_id: user.id,
                        title: newTask.title,
                        event_date: newTask.date,
                        event_time: newTask.time || '12:00 PM',
                        event_type: newTask.type,
                        remarks: newTask.remarks
                    }])
                    .select()
                    .single()

                if (!error && data) {
                    const newEvent: Session = {
                        id: data.id,
                        title: data.title,
                        date: new Date(data.event_date),
                        time: data.event_time || '12:00 PM',
                        type: data.event_type || 'task',
                        remarks: data.remarks
                    }
                    setSessions(prev => [...prev, newEvent])
                }
            }
        } catch (err) {
            console.error('Error saving event:', err)
        }
        
        setIsAddOpen(false)
    }

    const handleDeleteEvent = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('calendar_events')
                .delete()
                .eq('id', id)

            if (!error) {
                setSessions(prev => prev.filter(s => s.id !== id))
                setIsAddOpen(false)
            }
        } catch (err) {
            console.error('Error deleting event:', err)
        }
    }

    // Drag and Drop
    const onDragStart = (e: React.DragEvent, event: Session) => {
        e.dataTransfer.setData('eventId', event.id)
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.currentTarget.classList.add('bg-primary/10')
    }
    
    const onDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('bg-primary/10')
    }

    const onDrop = async (e: React.DragEvent, date: Date) => {
        e.preventDefault()
        e.currentTarget.classList.remove('bg-primary/10')
        const eventId = e.dataTransfer.getData('eventId')
        if (!eventId) return
        
        const eventToUpdate = sessions.find(s => s.id === eventId)
        if (!eventToUpdate) return

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const dateStr = `${year}-${month}-${day}`
        
        // Optimistic update
        setSessions(prev => prev.map(s => s.id === eventId ? { ...s, date: new Date(dateStr + 'T00:00:00') } : s))

        try {
            const supabase = createClient()
            await supabase
                .from('calendar_events')
                .update({ event_date: dateStr })
                .eq('id', eventId)
        } catch (err) {
            console.error('Error updating event date:', err)
            // Revert on error (could fetch again)
            fetchSessions()
        }
    }

    // Date math
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

    const getWeekDays = (date: Date) => {
        const d = new Date(date)
        const day = d.getDay()
        const diff = d.getDate() - day
        
        const week = []
        for (let i = 0; i < 7; i++) {
            const weekDay = new Date(d.setDate(diff + i))
            week.push(weekDay)
        }
        return week
    }

    const currentWeekDays = getWeekDays(currentDate)

    const prevPeriod = () => {
        if (view === 'month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
        else setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7))
    }
    
    const nextPeriod = () => {
        if (view === 'month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
        else setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7))
    }
    
    const today = () => setCurrentDate(new Date())

    const getEventsForDay = (d: Date) => {
        return sessions.filter(s => 
            s.date.getDate() === d.getDate() && 
            s.date.getMonth() === d.getMonth() && 
            s.date.getFullYear() === d.getFullYear()
        ).sort((a, b) => a.time.localeCompare(b.time))
    }

    const getEventColor = (type: string, customColor?: string) => {
        if (customColor) return customColor
        switch (type) {
            case 'session': return 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
            case 'task': return 'bg-purple-500/10 text-purple-700 border border-purple-500/20'
            case 'follow_up': return 'bg-green-500/10 text-green-700 border border-green-500/20'
            case 'deadline': return 'bg-red-500/10 text-red-700 border border-red-500/20'
            default: return 'bg-gray-500/10 text-gray-700 border border-gray-500/20'
        }
    }

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'session': return <Users className="h-3 w-3 shrink-0" />
            case 'task': return <Clock className="h-3 w-3 shrink-0" />
            case 'follow_up': return <CalendarDays className="h-3 w-3 shrink-0" />
            case 'deadline': return <Clock className="h-3 w-3 shrink-0 text-red-500" />
            default: return <Clock className="h-3 w-3 shrink-0" />
        }
    }

    const renderEventPill = (event: Session) => (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            key={event.id} 
            draggable
            onDragStart={(e: any) => onDragStart(e, event)}
            onClick={(e) => { e.stopPropagation(); openEditDialog(event); }}
            className={`w-full text-xs p-1.5 px-2 rounded-md font-medium truncate flex items-center justify-start gap-2 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md shadow-sm border-l-4 ${getEventColor(event.type, event.color)}`}
            title={`${event.time} - ${event.title}\n${event.remarks || ''}`}
        >
            {getEventIcon(event.type)}
            <span className="truncate">{event.time} {event.title}</span>
        </motion.div>
    )

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
                    <div className="flex bg-muted/30 p-1 rounded-lg border">
                        <Button variant={view === 'month' ? 'default' : 'ghost'} size="sm" onClick={() => setView('month')} className="rounded-md">Month</Button>
                        <Button variant={view === 'week' ? 'default' : 'ghost'} size="sm" onClick={() => setView('week')} className="rounded-md">Week</Button>
                    </div>

                    <div className="flex items-center bg-card border rounded-lg p-1 mr-4 shadow-sm">
                        <Button variant="ghost" size="icon" onClick={prevPeriod}><ChevronLeft className="h-4 w-4" /></Button>
                        <Button variant="ghost" className="font-bold text-sm mx-2" onClick={today}>Today</Button>
                        <Button variant="ghost" size="icon" onClick={nextPeriod}><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                    
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md" onClick={openAddDialog}>
                            <Plus className="h-4 w-4 mr-2" /> New Event
                        </Button>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{isEditMode ? 'Edit Event' : 'Add Event'}</DialogTitle>
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
                                        onChange={e => setNewTask({...newTask, type: e.target.value as any})}
                                    >
                                        <option value="session">Client Session</option>
                                        <option value="task">Personal Task</option>
                                        <option value="follow_up">Follow Up</option>
                                        <option value="deadline">Deadline</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Comments / Remarks</Label>
                                    <Input 
                                        value={newTask.remarks} 
                                        onChange={e => setNewTask({...newTask, remarks: e.target.value})} 
                                        placeholder="Add notes for this event..." 
                                    />
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button className="flex-1" onClick={handleSaveEvent}>{isEditMode ? 'Update Event' : 'Save Event'}</Button>
                                    {isEditMode && editingEvent && (
                                        <Button variant="destructive" size="icon" onClick={() => handleDeleteEvent(editingEvent.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Calendar Grid */}
            <motion.div 
                layout 
                className="border shadow-sm rounded-2xl overflow-hidden bg-card"
            >
                <CardHeader className="border-b bg-muted/30 pb-4">
                    <CardTitle className="text-xl font-bold text-center">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        {view === 'week' && ` - Week of ${currentWeekDays[0].getDate()}`}
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
                    <AnimatePresence mode="wait">
                        {view === 'month' ? (
                            <motion.div 
                                key="month-view"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-7 auto-rows-fr"
                            >
                                {blanksArray.map(i => (
                                    <div key={`blank-${i}`} className="min-h-[120px] bg-muted/10 border-r border-b"></div>
                                ))}
                                {daysArray.map(day => {
                                    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                                    const isToday = new Date().toDateString() === d.toDateString()
                                    const dayEvents = getEventsForDay(d)
                                    
                                    return (
                                        <div 
                                            key={day} 
                                            onDragOver={onDragOver}
                                            onDragLeave={onDragLeave}
                                            onDrop={(e) => onDrop(e, d)}
                                            className={`min-h-[140px] p-2 border-r border-b last:border-r-0 transition-colors hover:bg-muted/20 ${isToday ? 'bg-primary/5' : ''}`}
                                        >
                                            <div className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-2 ${isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                                                {day}
                                            </div>
                                            <div className="space-y-1.5">
                                                {dayEvents.map(renderEventPill)}
                                            </div>
                                        </div>
                                    )
                                })}
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="week-view"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-7 min-h-[500px]"
                            >
                                {currentWeekDays.map(d => {
                                    const isToday = new Date().toDateString() === d.toDateString()
                                    const dayEvents = getEventsForDay(d)
                                    return (
                                        <div 
                                            key={d.toISOString()} 
                                            onDragOver={onDragOver}
                                            onDragLeave={onDragLeave}
                                            onDrop={(e) => onDrop(e, d)}
                                            className={`p-3 border-r last:border-r-0 transition-colors hover:bg-muted/10 ${isToday ? 'bg-primary/5' : ''}`}
                                        >
                                            <div className="text-center mb-4">
                                                <div className={`text-lg font-black inline-flex items-center justify-center w-8 h-8 rounded-full ${isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                                                    {d.getDate()}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                {dayEvents.map(renderEventPill)}
                                            </div>
                                        </div>
                                    )
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </motion.div>
        </div>
    )
}
