import { useState } from 'react'; 
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import  CustomTimePicker  from '../../components/CustomTimePicker'; // Assuming you have a custom time picker component
import { supabase } from '../../supabase';
import { useRouter } from 'expo-router';

import { addMedication } from '../../services/medicationService';

export default function AddScreen() { 
    const [name, setName] = useState<string>('');
    const [dosage, setDosage] = useState<string>('');
    const [hour, setHour] = useState<string>('08');
    const [minute, setMinute] = useState<string>('00');
    const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
    const router = useRouter(); 


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
            setName('');
            setDosage('');
            setHour('01');
            setMinute('00');
            setPeriod('AM')
            router.replace('/home');
        }

    };


    return (
        <View style={styles.container}>
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

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
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
    }
});