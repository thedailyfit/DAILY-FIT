"use strict";
"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestActions = RequestActions;
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const supabase_1 = require("@/lib/supabase");
const navigation_1 = require("next/navigation");
const react_1 = require("react");
function RequestActions({ requestId, whatsappId, status }) {
    const router = (0, navigation_1.useRouter)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const supabase = (0, supabase_1.createClient)();
    const handleMarkResolved = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            const { error } = yield supabase
                .from("client_requests")
                .update({ status: "resolved" })
                .eq("id", requestId);
            if (error)
                throw error;
            alert("Request marked as resolved");
            router.refresh(); // Refresh server data
        }
        catch (error) {
            console.error("Error updating request:", error);
            alert("Failed to update status");
        }
        finally {
            setLoading(false);
        }
    });
    const handleReply = () => {
        if (!whatsappId) {
            alert("No WhatsApp number available");
            return;
        }
        // Clean number
        const cleanNumber = whatsappId.replace(/\D/g, "");
        window.open(`https://wa.me/${cleanNumber}`, "_blank");
    };
    return (<div className="flex items-center gap-2 mt-4">
            {status !== 'resolved' && (<button_1.Button size="sm" variant="outline" onClick={handleMarkResolved} disabled={loading}>
                    <lucide_react_1.CheckCircle className="h-4 w-4 mr-2"/>
                    {loading ? "Updating..." : "Mark as Resolved"}
                </button_1.Button>)}

            <button_1.Button size="sm" onClick={handleReply} variant="secondary">
                <lucide_react_1.Phone className="h-4 w-4 mr-2"/>
                Reply via WhatsApp
            </button_1.Button>
        </div>);
}
