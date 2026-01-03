'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react"
import { createClient } from '@/lib/supabase'

export function ImportClientsDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setStatus('idle')
            setMessage('')
        }
    }

    const processFile = async () => {
        if (!file) return;

        setLoading(true)
        const supabase = createClient()

        try {
            const text = await file.text();
            // Simple CSV Parser (Assumes: Name, Phone, Email)
            const lines = text.split('\n').map(line => line.trim()).filter(line => line);

            // Remove header if present (heuristic)
            const startIdx = lines[0].toLowerCase().includes('name') ? 1 : 0;

            const clientsToInsert = [];
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error("Not logged in");

            for (let i = startIdx; i < lines.length; i++) {
                const updatedLine = lines[i].replace('\r', ''); // Clean Windows returns
                const cols = updatedLine.split(','); // Basic split, careful with commas in quotes

                if (cols.length >= 2) {
                    clientsToInsert.push({
                        trainer_id: user.id,
                        name: cols[0].trim(),
                        phone_number: cols[1]?.trim(),
                        email: cols[2]?.trim() || null,
                        status: 'Active', // Default
                        joined_date: new Date().toISOString()
                    })
                }
            }

            if (clientsToInsert.length === 0) throw new Error("No valid data found");

            // Batch insert to 'members' table
            const { error } = await supabase.from('members').insert(clientsToInsert);

            if (error) throw error;

            setStatus('success')
            setMessage(`Successfully imported ${clientsToInsert.length} clients!`)
            setTimeout(() => {
                setIsOpen(false)
                window.location.reload() // Refresh to see data
            }, 1000)

        } catch (err: any) {
            console.error(err)
            setStatus('error')
            setMessage(err.message || "Failed to parse or upload.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Upload className="h-4 w-4" /> Import CSV
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
                <DialogHeader>
                    <DialogTitle>Import Clients</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file with columns: <strong>Name, Phone, Email</strong>.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/10 transition-colors">
                        <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-4" />
                        <Input
                            id="csvFile"
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <Label htmlFor="csvFile" className="cursor-pointer">
                            <span className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                                Select CSV File
                            </span>
                        </Label>
                        {file && <p className="mt-4 text-sm font-medium text-foreground">{file.name}</p>}
                    </div>
                </div>

                {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg text-sm">
                        <AlertCircle className="h-4 w-4" /> {message}
                    </div>
                )}
                {status === 'success' && (
                    <div className="flex items-center gap-2 text-green-500 bg-green-500/10 p-3 rounded-lg text-sm">
                        <CheckCircle className="h-4 w-4" /> {message}
                    </div>
                )}

                <DialogFooter>
                    <Button onClick={processFile} disabled={!file || loading} className="w-full font-bold">
                        {loading ? 'Importing...' : 'Upload & Import'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
