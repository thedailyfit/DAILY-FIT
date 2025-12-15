'use server';

import { createClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function updatePaymentStatus(paymentId: string, status: 'paid' | 'pending' | 'overdue' | 'cancelled') {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from('payments')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', paymentId);

        if (error) {
            console.error('Error updating payment status:', error);
            throw new Error('Failed to update payment status');
        }

        revalidatePath('/dashboard/payments');
        return { success: true };
    } catch (error) {
        console.error('Error in updatePaymentStatus:', error);
        return { success: false, error: 'Failed to update payment status' };
    }
}

export async function deletePayment(paymentId: string) {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from('payments')
            .delete()
            .eq('id', paymentId);

        if (error) {
            console.error('Error deleting payment:', error);
            throw new Error('Failed to delete payment');
        }

        revalidatePath('/dashboard/payments');
        return { success: true };
    } catch (error) {
        console.error('Error in deletePayment:', error);
        return { success: false, error: 'Failed to delete payment' };
    }
}
