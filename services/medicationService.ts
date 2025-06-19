import { CreateMedicationDTO } from '@/types/medication';
import { supabase } from '../supabase';

export async function addMedication(med: CreateMedicationDTO) {
    const { user_id, name, dosage, scheduled_time, start_date, end_date, repeat_day, taken } = med;

    const { error } = await supabase.from('medications').insert({
        user_id,
        name,
        dosage,
        scheduled_time,
        start_date,
        end_date,
        repeat_day,
        taken,
    });

    return { error };
};

export const fetchMedications = async (userId: string) => {
    const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', userId)
    
    return { data, error }; 
};

export async function deleteMedication(id: string) {
    const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);
    
    return { error };
}

export const toggleMedicationTaken = async (id: string, currentValue: boolean) => {
    const { error } = await supabase
        .from('medications')
        .update({ taken: !currentValue })
        .eq('id', id);
    
    return { error };
};