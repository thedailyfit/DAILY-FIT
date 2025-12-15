"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RequestActionsProps {
    requestId: string;
    whatsappId?: string;
    status: string;
}

export function RequestActions({ requestId, whatsappId, status }: RequestActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleMarkResolved = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from("client_requests")
                .update({ status: "resolved" })
                .eq("id", requestId);

            if (error) throw error;

            alert("Request marked as resolved");
            router.refresh(); // Refresh server data
        } catch (error) {
            console.error("Error updating request:", error);
            alert("Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    const handleReply = () => {
        if (!whatsappId) {
            alert("No WhatsApp number available");
            return;
        }
        // Clean number
        const cleanNumber = whatsappId.replace(/\D/g, "");
        window.open(`https://wa.me/${cleanNumber}`, "_blank");
    };

    return (
        <div className="flex items-center gap-2 mt-4">
            {status !== 'resolved' && (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleMarkResolved}
                    disabled={loading}
                >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {loading ? "Updating..." : "Mark as Resolved"}
                </Button>
            )}

            <Button size="sm" onClick={handleReply} variant="secondary">
                <Phone className="h-4 w-4 mr-2" />
                Reply via WhatsApp
            </Button>
        </div>
    );
}
