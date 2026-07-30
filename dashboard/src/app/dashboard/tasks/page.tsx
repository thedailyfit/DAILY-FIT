'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase"
import { Check, ChevronRight, Trash2, Plus, Clock, GripVertical } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Task {
    id: string;
    title: string;
    time?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in-progress' | 'done';
    event_date: string;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        setLoading(true)
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // We need today's date in local time formatted as YYYY-MM-DD
            const today = new Date()
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

            const { data, error } = await supabase
                .from('calendar_events')
                .select('*')
                .eq('trainer_id', user.id)
                .eq('event_date', todayStr)

            if (!error && data) {
                const mapped: Task[] = data.map((e: any) => ({
                    id: e.id,
                    title: e.title,
                    time: e.event_time || e.start_time || undefined,
                    priority: getPriority(e.title),
                    status: 'todo', // in-memory
                    event_date: e.event_date
                }))
                setTasks(mapped)
            }
        } catch (err) {
            console.error('Error loading tasks:', err)
        } finally {
            setLoading(false)
        }
    }

    const getPriority = (title: string): 'low' | 'medium' | 'high' => {
        const t = title.toLowerCase()
        if (t.includes('urgent') || t.includes('high') || t.includes('asap') || t.includes('deadline')) return 'high'
        if (t.includes('low') || t.includes('minor') || t.includes('optional')) return 'low'
        return 'medium'
    }

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTaskTitle.trim()) return

        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const today = new Date()
            const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
            const title = newTaskTitle.trim()

            const { data, error } = await supabase
                .from('calendar_events')
                .insert([{
                    trainer_id: user.id,
                    title,
                    event_date: todayStr,
                    event_type: 'task',
                }])
                .select()
                .single()

            if (!error && data) {
                const newTask: Task = {
                    id: data.id,
                    title: data.title,
                    time: data.event_time || data.start_time || undefined,
                    priority: getPriority(data.title),
                    status: 'todo',
                    event_date: data.event_date
                }
                setTasks(prev => [...prev, newTask])
                setNewTaskTitle('')
            }
        } catch (err) {
            console.error('Error adding task:', err)
        }
    }

    const updateStatus = (taskId: string, newStatus: Task['status']) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
    }

    const markDone = (taskId: string) => updateStatus(taskId, 'done')

    const pushToTomorrow = async (taskId: string) => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('calendar_events')
                .update({ event_date: tomorrowStr })
                .eq('id', taskId)

            if (!error) {
                setTasks(prev => prev.filter(t => t.id !== taskId))
            }
        } catch (err) {
            console.error('Error pushing to tomorrow:', err)
        }
    }

    const deleteTask = async (taskId: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('calendar_events')
                .delete()
                .eq('id', taskId)

            if (!error) {
                setTasks(prev => prev.filter(t => t.id !== taskId))
            }
        } catch (err) {
            console.error('Error deleting task:', err)
        }
    }

    // Drag and Drop handlers
    const onDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('taskId', id)
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const onDrop = (e: React.DragEvent, status: Task['status']) => {
        e.preventDefault()
        const id = e.dataTransfer.getData('taskId')
        if (id) {
            updateStatus(id, status)
        }
    }

    const renderColumn = (title: string, status: Task['status'], headerColor: string) => {
        const columnTasks = tasks.filter(t => t.status === status)

        return (
            <div 
                className="flex flex-col bg-card/50 backdrop-blur-md rounded-2xl p-4 border shadow-sm flex-1 min-w-[280px]"
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, status)}
            >
                <div className={`text-lg font-bold mb-4 px-2 pb-2 border-b ${headerColor}`}>
                    {title} <span className="text-muted-foreground text-sm ml-2 font-normal">({columnTasks.length})</span>
                </div>
                
                <div className="flex flex-col gap-3 flex-1">
                    <AnimatePresence>
                        {columnTasks.map((task, idx) => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                                draggable
                                onDragStart={(e: any) => onDragStart(e, task.id)}
                                className="bg-card border rounded-xl p-3 shadow-sm cursor-grab active:cursor-grabbing group hover:border-primary/50 transition-colors"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 font-bold text-foreground">
                                        <GripVertical className="h-4 w-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {task.title}
                                    </div>
                                    <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                        task.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                                        task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                        'bg-green-500/10 text-green-500'
                                    }`}>
                                        {task.priority}
                                    </div>
                                </div>
                                {task.time && (
                                    <div className="flex items-center text-xs text-muted-foreground mb-3 pl-6">
                                        <Clock className="h-3 w-3 mr-1" /> {task.time}
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-end gap-1 mt-2">
                                    {status !== 'done' && (
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-green-500 hover:text-green-600 hover:bg-green-500/10" onClick={() => markDone(task.id)} title="Mark Done">
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500 hover:text-blue-600 hover:bg-blue-500/10" onClick={() => pushToTomorrow(task.id)} title="Push to Tomorrow">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => deleteTask(task.id)} title="Delete">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {columnTasks.length === 0 && (
                        <div className="text-center p-6 text-muted-foreground text-sm border-2 border-dashed rounded-xl border-muted/50">
                            Drop tasks here
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen bg-background text-foreground">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase flex items-center gap-3">
                        <Check className="h-8 w-8 text-primary" /> Today's Tasks
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium">Manage your daily priorities and to-dos.</p>
                </div>
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2 items-center bg-card p-2 rounded-2xl border shadow-sm">
                <Input 
                    placeholder="Add a new task for today..." 
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    className="border-0 focus-visible:ring-0 text-base h-12 bg-transparent"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleAddTask(e);
                        }
                    }}
                />
                <Button type="button" onClick={handleAddTask} className="h-12 px-6 rounded-xl font-bold bg-primary hover:bg-primary/90">
                    <Plus className="h-5 w-5 mr-2" /> Add
                </Button>
            </form>

            <div className="flex flex-col md:flex-row gap-6 mt-8 overflow-x-auto pb-4">
                {renderColumn('To Do', 'todo', 'text-blue-500 border-b-blue-500/20')}
                {renderColumn('In Progress', 'in-progress', 'text-orange-500 border-b-orange-500/20')}
                {renderColumn('Done', 'done', 'text-green-500 border-b-green-500/20')}
            </div>
        </div>
    )
}
