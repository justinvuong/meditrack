import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../supabase';
import { fetchMedications, deleteMedication } from '@/services/medicationService';

type Medication = { 
    id: string;
    name: string;
    dosage: string;
    schedule_time?: string
}

export default function ListScreen() {
    const [medications, setMedications] = useState<Medication[]>([]);

    useFocusEffect(
        useCallback(() => {
            const loadMeds = async () => {
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError || !user) {
                    console.error('User not authenticated');
                    return;
                }

                const { data, error } = await fetchMedications(user.id);

                if (error) {
                    console.error('error fetching meds', error.message);
                }
                else {
                    setMedications(data || []);
                }
            };

            loadMeds();
        }, [])
    );

    const handleDelete = async (id: string) => {
        const { error } = await deleteMedication(id);

        if (error) {
            console.error('Error deleting medication', error.message);
        }
        else {
            setMedications((prev) => prev.filter((med) => med.id !== id));
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
            <Text style={styles.header}>Current Medication</Text>
            {medications.map((med) => (
                <View key={med.id} style={styles.medCard}>
                    {/*Left, name + dosage */}
                    <View>                   
                        <Text style={styles.medName} numberOfLines={1} ellipsizeMode="tail">
                            {med.name}
                        </Text>
                        <Text style={styles.dosage}>{med.dosage}</Text>
                    </View>

                    {/*right, buttons */}
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity onPress={() => handleDelete(med.id)}>
                            <Ionicons name="trash-bin" size={30} color="#F44336" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="create-outline" size={30} color="black" />
                        </TouchableOpacity>
                    </View>
                        
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: '500',
        textAlign: 'center',
        paddingBottom: 20,
        paddingTop: 10
    },
    container: { 
        flex: 1,
        backgroundColor: '#F0F8FF',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    medCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    medName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
    dosage: {
        fontSize: 16,
        marginTop: 2,
        color: '#222',
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 10
    },
    
});