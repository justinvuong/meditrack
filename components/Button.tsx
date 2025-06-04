import React from 'react'; 
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

type ButtonProps = {
    label: string;
    onPress?: () => void;
    type?: 'primary' | 'secondary';
    style?: ViewStyle
};

export const Button = ({ label, onPress, type = 'primary', style }: ButtonProps) => {
    const isPrimary = type === 'primary';

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[styles.button, isPrimary ? styles.primary : styles.secondary, style]}
        >
            <Text style={isPrimary ? styles.primaryText : styles.secondaryText}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '80%',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 10,
    },
    primary: {
        backgroundColor: '#007BFF',
    },
    secondary: {
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '007BFF',
    },
    primaryText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 16,
    },
    secondaryText: {
        color: '007BFF',
        fontWeight: '600',
        fontSize: 16,
    },
});