"use strict";
/**
 * WhatsApp Notification Utility
 *
 * This module handles sending WhatsApp notifications to clients when their
 * diet or workout plans are updated in the dashboard.
 */
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
exports.notifyClientPlanUpdate = notifyClientPlanUpdate;
exports.notifyMultipleClients = notifyMultipleClients;
const supabase_1 = require("./supabase");
/**
 * Send a WhatsApp notification to a client about a plan update
 */
function notifyClientPlanUpdate(notification) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const supabase = (0, supabase_1.createClient)();
            // Get client's WhatsApp number
            const { data: member, error: memberError } = yield supabase
                .from('members')
                .select('whatsapp_id, name')
                .eq('id', notification.clientId)
                .single();
            if (memberError || !member) {
                console.error('Error fetching member for notification:', memberError);
                return { success: false, error: 'Member not found' };
            }
            if (!member.whatsapp_id) {
                console.warn('Member has no WhatsApp number:', notification.clientId);
                return { success: false, error: 'No WhatsApp number' };
            }
            // Construct the notification message
            const message = constructPlanUpdateMessage(notification, member.name);
            // TODO: Integrate with your WhatsApp AI agent
            // This should call your existing WhatsApp service to send the message
            // For now, we'll log it and store it in a notifications table
            console.log('WhatsApp Notification:', {
                to: member.whatsapp_id,
                message,
                notification
            });
            // Store notification in database for tracking
            const { error: notifError } = yield supabase
                .from('client_notifications')
                .insert({
                client_id: notification.clientId,
                type: 'plan_update',
                message,
                whatsapp_number: member.whatsapp_id,
                sent_at: new Date().toISOString(),
                metadata: {
                    plan_type: notification.planType,
                    plan_name: notification.planName,
                    action: notification.action
                }
            });
            if (notifError) {
                console.error('Error storing notification:', notifError);
            }
            return { success: true, message };
        }
        catch (error) {
            console.error('Error sending WhatsApp notification:', error);
            return { success: false, error: String(error) };
        }
    });
}
/**
 * Construct a user-friendly message for plan updates
 */
function constructPlanUpdateMessage(notification, clientName) {
    const { planType, planName, action } = notification;
    const planTypeLabel = planType === 'diet' ? 'Diet Plan' : 'Workout Plan';
    switch (action) {
        case 'assigned':
            return `🎉 Great news ${clientName}! Your trainer has assigned you a new ${planTypeLabel}: "${planName}". Check your WhatsApp for details!`;
        case 'updated':
            return `📝 Update: Your trainer has made changes to your ${planTypeLabel} "${planName}". The updated plan is now available!`;
        case 'removed':
            return `ℹ️ Your ${planTypeLabel} "${planName}" has been removed. Your trainer will assign you a new plan soon.`;
        default:
            return `Your ${planTypeLabel} has been updated by your trainer.`;
    }
}
/**
 * Notify multiple clients about a plan update (e.g., when a template is modified)
 */
function notifyMultipleClients(clientIds, notification) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = yield Promise.allSettled(clientIds.map(clientId => notifyClientPlanUpdate(Object.assign(Object.assign({}, notification), { clientId }))));
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        return {
            total: clientIds.length,
            successful,
            failed,
            results
        };
    });
}
