import { Ionicons } from '@expo/vector-icons';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { supabase } from '../../supabase';

import { Medication } from '@/types/medication';
import { fetchMedications } from '../../services/medicationService';
import { formatTo12Hour, getLocalDateString } from '../../services/utils';

export default function HomeScreen() { 
    const [medications, setMedications] = useState<Medication[]>([]);
    const [todaysMedications, setTodaysMedications] = useState<Medication[]>([]);

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
                    
                    //console.log(data);
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

            <Text style={styles.greeting}>Good Morning</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Today's Medications</Text>

                {todaysMedications.length === 0 ? (
                    <View style={styles.placeholderBox}>
                        <Text style={styles.placeholderText}> No medications yet.</Text>
                    </View>
                ) : (
                    <ScrollView style={styles.listContainer}>
                        {todaysMedications.map((med) => (
                            <View key={med.id} style={styles.medCard}>
                                {/* left, name + dosage */}
                                <View>
                                    <Text style={styles.medName}>{med.name}</Text>
                                    <Text style={styles.dosage}>{med.dosage}</Text>
                                </View>

                                {/*right, time*/}
                                <View style={styles.medRight}>
                                    <Text style={styles.medInfo}>
                                        {med.scheduled_time ? formatTo12Hour(med.scheduled_time) : 'No time'}
                                    </Text>
                                </View>

                                {/*Button */}
                                <TouchableOpacity style={styles.medButton} onPress={() => Alert.alert('button press')}>
                                    <Ionicons name='checkmark' size={20} color='#fff' style={{ marginRight: 6 }} />
                                </TouchableOpacity>

                            </View>
                        ))}
                    </ScrollView>
                )}
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
        fontSize: 26,
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
        width: 36,
        height: 36,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
});