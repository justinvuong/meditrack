import { View, Text, StyleSheet, TextInput } from 'react-native'
import { useState } from 'react'; 
import { Button } from '../components/Button';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { supabase } from '../supabase';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            alert(error.message);
        }
        else {
            console.log('Login success', data);
            router.replace('/home');
        }
    };

    return (

        <View style={styles.container}>
            <Text style={styles.title}>Log in</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="default"
                autoCapitalize="none"
                inputMode="email"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button label="Log In" onPress={handleLogin} />
            
            <Link href="/signup" style={styles.signupLink}>
                Don't have an account? Sign u
            </Link>
        </View>

        
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F8FF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    title: {
        fontSize: 32,
        fontWeight: '500',
        marginBottom: 20,
        color: '#222',
    },
    input: {
        width: '85%',
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 20,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    signupLink: {
        marginTop: 20,
        color: '#007BFF',
        fontWeight: '500',
    },
});