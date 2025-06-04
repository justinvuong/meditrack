import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons';

import { supabase } from '../../supabase';
import { useEffect, useState } from 'react'; 

import { fetchMedications } from '../../services/medicationService';
import { formatTo12Hour } from '../../services/utils';

export default function HomeScreen() { 
    const [medications, setMedications] = useState<any[]>([]);

    useEffect(() => {
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
                setMedications(data || []);
            }
        };
        loadMeds();
    }, []);
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="menu" size={28} color="#222" />
            </View>

            <Text style={styles.greeting}>Good Morning, Justin</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Today's Medications</Text>

                {medications.length === 0 ? (
                    <View style={styles.placeholderBox}>
                        <Text style={styles.placeholderText}> No medications yet.</Text>
                    </View>
                ) : (
                    <ScrollView style={styles.listContainer}>
                        {medications.map((med) => (
                            <View key={med.id} style={styles.medCard}>
                                {/*Left, name + dosage */}
                                <View>                   
                                    <Text style={styles.medName} numberOfLines={1} ellipsizeMode="tail">
                                        {med.name}
                                    </Text>
                                    <Text style={styles.dosage}>{med.dosage}</Text>
                                </View>

                                {/*Right, time + button */}
                                <View style={styles.medRight}>                
                                    <Text style={styles.medInfo}>
                                        {formatTo12Hour(med.schedule_time)}
                                    </Text>

                                    {/*button */}
                                    <TouchableOpacity style={styles.medButton}onPress={() => Alert.alert('button pressed')}>
                                        <Ionicons name="checkmark" size={20} color="#fff" style={{ marginRight: 6 }} />
                                    </TouchableOpacity>
                                </View>
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