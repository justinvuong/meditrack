import { useState, useEffect } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

type props = {
    onChange: (hour: string, minute: string, period: 'AM' | 'PM') => void;
};

export default function CustomTimePicker({ onChange }: props) { 

    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const periods: ('AM' | 'PM')[] = ['AM', 'PM'];

    const [selectedHour, setSelectedHour] = useState<string>('08');
    const [selectedMinute, setSelectedMinute] = useState<string>('00');
    const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');

    const handleSelect = (type: 'hour' | 'minute' | 'period', value: string) => {
        if (type === 'hour') setSelectedHour(value);
        if (type === 'minute') setSelectedMinute(value);
        if (type === 'period') setSelectedPeriod(value as 'AM' | 'PM');

        const hourVal = type === 'hour' ? value : selectedHour;
        const minuteVal = type === 'minute' ? value : selectedMinute;
        const periodVal = type === 'period' ? (value as 'AM' | 'PM') : selectedPeriod;

        onChange(hourVal, minuteVal, periodVal);
    };

    return (
        <View style={styles.container}>

            <ScrollView style={styles.column}>
                {hours.map((hr) => (
                    <TouchableOpacity key={hr} onPress={() => handleSelect('hour', hr)}>
                        <Text style={[styles.item, selectedHour === hr && styles.selected]}>{hr}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView style={styles.column}>
                {minutes.map((min) => (
                    <TouchableOpacity key={min} onPress={() => handleSelect('minute', min)}>
                        <Text style={[styles.item, selectedMinute === min && styles.selected]}>{min}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView style={styles.column}>
                {periods.map((p) => (
                    <TouchableOpacity key={p} onPress={() => handleSelect('period', p)}>
                        <Text style={[styles.item, selectedPeriod === p && styles.selected]}>{p}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        height: 200,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
    },
    column: {
        flex: 1,
    },
    item: {
        fontSize: 20,
        textAlign: 'center',
        paddingVertical: 10,
        color: '#555',
    },
    selected: {
        fontWeight: 'bold',
        color: '#007BFF',
        backgroundColor: '#E0F0FF',
        borderRadius: 8,
    },
});