import { Ionicons } from '@expo/vector-icons';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { supabase } from '../../supabase';

import { Medication } from '@/types/medication';
import { fetchMedications, toggleMedicationTaken } from '../../services/medicationService';
import { formatTo12Hour, getLocalDateString } from '../../services/utils';

export default function HomeScreen() { 
    const [medications, setMedications] = useState<Medication[]>([]);
    const [todaysMedications, setTodaysMedications] = useState<Medication[]>([]);

    const takenCount = todaysMedications.filter((med) => med.taken).length;
    const totalCount = todaysMedications.length;
    const progress = totalCount > 0 ? takenCount / totalCount : 0; 

    const handleToggleTaken = async (med: Medication) => { 
        const { error } = await toggleMedicationTaken(med.id, med.taken);

        if (error) {
            Alert.alert('error', 'could not update medication');
            return; 
        }

        const updated = todaysMedications.map((m) =>
            m.id === med.id ? { ...m, taken: !m.taken } : m
        )

        setTodaysMedications(updated);
    }

    useFocusEffect(
        useCallback(() => {
            const loadMeds = async () => {
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError || !user) {
                    Alert.alert('Error', 'User not authenticated');
                    return;
                }

                const { data, error } = await fetchMedications(user.id);

                if (error) {
                    Alert.alert('Error', error.message);
                    return;
                }
                else {
                    //console.log('fetched medications: ', data);
                    
                    //console.log('fetched meds', data);
                    setMedications(data || []);

                    const today = getLocalDateString(); 
                    const todaysMeds = (data || []).filter((med) => { 
                        if (!med.start_date) return false; 

                        const localDate = new Date(med.start_date).toLocaleDateString('en-CA');

                        //console.log(`Compareing ${localDate} to ${today}`);
                        return localDate === today; 
                    })

                    setTodaysMedications(todaysMeds); 
                    
                }
            };

            loadMeds();
            
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="menu" size={28} color="#222" />
            </View>

            <Text style={styles.greeting}>Hello name</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Today's Medications</Text>

                {todaysMedications.length === 0 ? (
                    <View style={styles.placeholderBox}>
                        <Text style={styles.placeholderText}> No medications yet.</Text>
                    </View>
                ) : (
                    <ScrollView style={styles.listContainer}>
                        {todaysMedications.map((med) => (
                            <View key={med.id} style={[styles.medCard, med.taken && styles.medCardTaken]}>
                                {/* left, name + dosage */}
                                <View>
                                    <Text style={[styles.medName, med.taken && styles.medNameTaken]}>{med.name}</Text>
                                    <Text style={styles.dosage}>{med.dosage}</Text>
                                </View>

                                {/*right, time*/}
                                <View style={styles.medRight}>
                                    <Text style={styles.medInfo}>
                                        {med.scheduled_time ? formatTo12Hour(med.scheduled_time) : 'No time'}
                                    </Text>
                                </View>

                                {/*Button */}
                                <TouchableOpacity style={[styles.medButton, med.taken && styles.medButtonTaken]} onPress={() => handleToggleTaken(med)}>
                                    <Ionicons name={med.taken ? 'checkmark-circle' : 'checkmark-outline'} size={18} color={med.taken ? '#2196F3' : '#bbb'} />
                                    <Text style={styles.medButtonText}>
                                        {med.taken ? 'Taken' : 'Mark as Taken'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </View>

            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                    Progress: {takenCount} of {totalCount} taken
                </Text>
                <Progress.Bar
                    progress={progress}
                    width={256}
                    height={12}
                    color='#2196F3'
                    unfilledColor='#BBDEFB'
                    borderRadius={6}
                    borderWidth={0}
                    animated={true}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        backgroundColor: '#F0F8FF',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    header: {
        alignItems: 'flex-end',
    },
    greeting: {
        fontSize: 32,
        fontWeight: '600',
        marginTop: 20,
        color: '#222',
    },
    section: {
        marginTop: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
        color: '#333',
    },
    placeholderBox: {
        height: 120,
        borderRadius: 10,
        backgroundColor: '#e0edff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#555',
    },
    listContainer: {
        maxHeight: 300,
    },
    medCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 10, 
        marginBottom: 12,
        elevation: 2,
        justifyContent: 'space-between',
    },
    medRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    medName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#222',
        maxWidth: 200,
    },
    dosage: {
        fontSize: 16,
        color: '#666',
        marginTop: 2,
    },
    medInfo: {
        fontSize: 18,
        fontWeight: '500',
        color: '#555',
    },
    medButton: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#2196F3',
        alignItems: 'center'
    },
    progressContainer: { 
        alignItems: 'center',
    },
    progressText: { 
        fontWeight: '500',
        marginBottom: 6,
    },
    medCardTaken: { 
        backgroundColor: '#e0e0e0', 
        opacity: 0.7,
    },
    medNameTaken: { 
        textDecorationLine: 'line-through',
        color: '#999'
    },
    medButtonText: { 
        color: '#fff',
        fontSize: 14,
        fontWeight: '600'
    },
    medButtonTaken: {
        backgroundColor: '#9E9E9E'
    }
});