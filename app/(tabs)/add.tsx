import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomTimePicker from '../../components/CustomTimePicker'; // Assuming you have a custom time picker component
import { supabase } from '../../supabase';


import { formatSelectedTime, formatTo12Hour } from '@/services/utils';
import { addMedication } from '../../services/medicationService';

export default function AddScreen() { 
    const [name, setName] = useState<string>('');
    const [dosage, setDosage] = useState<string>('');
    const [hour, setHour] = useState<string>('08');
    const [minute, setMinute] = useState<string>('00');
    const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
    const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
    const [scheduledTimes, setScheduledTimes] = useState<string[]>([]);
    const router = useRouter(); 

    useFocusEffect(
        useCallback(() => {
            setName('');
            setDosage('');
            setHour('08');
            setMinute('25');
            setPeriod('AM');
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
            Alert.alert('Error', 'User not uthenticated');
            return;
        }

        const { error } = await addMedication(user.id, name, dosage, hour, minute, period);

        if (error) {
            Alert.alert('Error', error.message);
        }
        else { 
            Alert.alert('Success', 'Medication added successfully');
            router.replace('/home');
        }

    };


    return (
        <ScrollView contentContainerStyle={styles.container} style={{ flex: 1, backgroundColor: '#F0F8FF'}}>
            <Text style={styles.title}>Add Medication</Text>

            <TextInput style={styles.input} placeholder="Medication name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Dosage (e.g. 500mg)" value={dosage} onChangeText={setDosage} />
            
            <Text style={styles.label}>Select Time</Text>
            <CustomTimePicker
                onChange={(h, m, p) => {
                    setHour(h);
                    setMinute(m);
                    setPeriod(p);
                }}
            />

            <TouchableOpacity
                style={styles.addTimeButton}
                onPress={() => {
                    const formatted = formatSelectedTime(hour, minute, period);
                    if (!scheduledTimes.includes(formatted)) { 
                        setScheduledTimes((prev) => [...prev, formatted]);
                    }
                    else {
                        Alert.alert('Duplicate', 'This time is already added');
                    }
                }}
            >
                <Text style={styles.addTimeButtonText}>+ Add Time</Text>
            </TouchableOpacity>

            
            <Text style={[styles.label, { marginTop: 24 }]}>Select Days</Text>
            <View style={styles.daySelector}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <TouchableOpacity
                        key={day}
                        style={[
                            styles.dayButton,
                            daysOfWeek.includes(day) && styles.dayButtonSelected
                        ]}
                        onPress={() => {
                            setDaysOfWeek((prev) =>
                                prev.includes(day)
                                    ? prev.filter((d) => d !== day)
                                    : [...prev, day]
                            );
                        }}
                    >
                        <Text style={[
                            styles.dayButtonText,
                            daysOfWeek.includes(day) && styles.dayButtonTextSelected
                        ]}>
                            {day.charAt(0)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>   

            <View style={styles.scheduledTimesList}>
                {[...scheduledTimes]
                    .sort((a, b) => a.localeCompare(b))
                    .map((time, idx) => (
                        <View key={idx} style={styles.timePill}>
                            <Text style={styles.timePillText}>{formatTo12Hour(time)}</Text>
                        
                            <TouchableOpacity onPress={() => 
                                setScheduledTimes((prev) => prev.filter((t) => t !== time))
                            }>
                                <Text style={styles.removeText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
            </View>
            

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        backgroundColor: '#F0F8FF',
        padding: 20, 
        justifyContent: 'center',
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
    daySelector: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dayButton: {
        width: 50,
        height: 50,
        borderRadius: 24,
        borderWidth: 1, 
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dayButtonSelected: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50'
    },
    dayButtonText: {
        color: '#333',
        fontWeight: '500',
        fontSize: 20
    },
    dayButtonTextSelected: {
        color: '#fff'
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
    }


}); 