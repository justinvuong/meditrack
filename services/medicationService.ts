import { supabase } from '../supabase';

export async function addMedication(userId: string, name: string, dosage: string, hour: string, minute: string, period: 'AM' | 'PM') {
    const hour24 = 
        period === 'PM' && hour !== '12' ? (parseInt(hour) + 12).toString().padStart(2, '0') :
        period === 'AM' && hour === '12' ? '00' :
        hour;
        
    const formattedtime = `${hour24}:${minute}:00`; //hh:mm:ss format for supabase

    const { error } = await supabase.from('medications').insert({
        user_id: userId,
        name,
        dosage,
        schedule_time: formattedtime
    });

    return { error }; 
};

export const fetchMedications = async (userId: string) => {
    const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', userId)
        .order('schedule_time', { ascending: true });
    
    return { data, error }; 
};