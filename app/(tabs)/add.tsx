import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CustomTimePicker from '../../components/CustomTimePicker'; // Assuming you have a custom time picker component
import { supabase } from '../../supabase';

import { addMedication } from '@/services/medicationService';
import { formatSelectedTime } from '@/services/utils';
import { Medication } from '@/types/medication';

export default function AddScreen() { 
    const [name, setName] = useState<string>('');
    const [dosage, setDosage] = useState<string>('');
    const [hour, setHour] = useState<string>('08');
    const [minute, setMinute] = useState<string>('00');
    const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
    const [repeatDay, setRepeatDay] = useState<string>('Monday');
    const selectedTime = formatSelectedTime(hour, minute, period);
    const router = useRouter(); 

    useFocusEffect(
        useCallback(() => {
            setName('');
            setDosage('');
            setHour('08');
            setMinute('25');
            setPeriod('AM');
            setStartDate(null);
            setEndDate(null);
            setRepeatDay('Monday');
        }, [])
    );


    const handleSave = async () => {
        if (!name.trim() || !dosage.trim()) { 
            Alert.alert('Validation error', 'Please enter medication name and dosage');
            return;
        }

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) { 
            Alert.alert('Error', 'User not authenticated');
            return; 
        }

        const med: Medication = {
            user_id: user.id,
            name,
            dosage,
            scheduled_time: selectedTime,
            start_date: startDate?.toISOString().split('T')[0] || '',
            end_date: endDate?.toISOString().split('T')[0] || '',
            repeat_day: repeatDay,
        };

        const { error } = await addMedication(med); 

        if (error) {
            Alert.alert('Error', error.message);
        }
        else { 
            Alert.alert('Success', 'Medication added successfully')
            router.replace('/home')
        }
    }; 


    return (
        <ScrollView contentContainerStyle={styles.container} style={{ flex: 1, backgroundColor: '#F0F8FF'}}>
            <Text style={styles.title}>Add Medication</Text>

            <TextInput style={styles.input} placeholder="Medication name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Dosage (e.g. 500mg)" value={dosage} onChangeText={setDosage} />
            
            <Text style={styles.label}>When do you take it?</Text>
            <CustomTimePicker
                onChange={(h, m, p) => {
                    setHour(h);
                    setMinute(m);
                    setPeriod(p);
                }}
            />

            <Text style={styles.label}>Select Dates</Text>
            <View style={styles.dateRow}>
                <TouchableOpacity style={styles.datePickerButton} onPress={() => setStartDatePickerVisible(true)}>
                    <Text style={styles.datePickerButtonText}>
                        {startDate ? startDate.toDateString() : 'Start date'}
                    </Text>         
                </TouchableOpacity>

                <TouchableOpacity style={styles.datePickerButton} onPress={() => setEndDatePickerVisible(true)}>
                    <Text style={styles.datePickerButtonText}>
                        {endDate ? endDate.toDateString() : 'End Date'}
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Repeat On</Text>
            <View style={styles.pickerContainer}>
                <Picker style={styles.picker} selectedValue={repeatDay} onValueChange={(value) => setRepeatDay(value)}>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',].map((day) => (
                        <Picker.Item key={day} label={day} value={day} />
                    ))}
                </Picker>
            </View>
            
           
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode='date'
                onConfirm={(date) => {
                    setStartDate(date);
                    setStartDatePickerVisible(false);
                }}
                onCancel={() => setStartDatePickerVisible(false)}
            />

            <DateTimePickerModal
                isVisible={isEndDatePickerVisible}
                mode='date'
                onConfirm={(date) => {
                    setEndDate(date);
                    setEndDatePickerVisible(false);
                }}
                onCancel={() => setEndDatePickerVisible(false)}
            />

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        backgroundColor: '#F0F8FF',
        padding: 20, 
        justifyContent: 'center',
        marginTop: 24
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#fff',
        padding: 12, 
        borderRadius: 8,
        marginBottom: 20, 
        fontSize: 16,
    },
    label: {
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 8,
        textAlign: 'center'
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    addTimeButton: {
        marginTop: 10,
        backgroundColor: '#007bff',
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center'
    },
    addTimeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    scheduledTimesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10, 
        justifyContent: 'center',
    },
    timePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 20, 
        paddingHorizontal: 12,
        paddingVertical: 6, 
        margin: 4,
    },
    timePillText: {
        fontSize: 14,
        marginRight: 6,
        color: '#333'
    },
    removeText: {
        fontSize: 14,
        color: '#888'
    }, 
    saveButtonContainer: {
        padding: 16,
    },
    datePickerButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center'
    },
    datePickerButtonText: {
        fontSize: 16,
        color: '#333'
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 20,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8, 
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: '#fff'
    },
    picker: {
        width: '100%'
    }


}); 