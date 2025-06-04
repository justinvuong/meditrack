import { View, Text, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '../components/Button';

export default function WelcomeScreen() { 
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/meditrack-logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>Welcome to MediTrack</Text>

            <View style={styles.buttonGroup}>
                <Link href="/login" asChild>
                    <Button label="LogIn" />
                </Link>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F8FF',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    logo: { 
        width: 100, 
        height: 100, 
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#222',
        marginBottom: 40,
    },
    buttonGroup: {
        width: '100%',
        alignItems: 'center',
    }
})