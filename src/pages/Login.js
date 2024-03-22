import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ToastContainer, toast } from 'react-native-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const auth = getAuth();

    const validateEmailAndPassword = () => {
        if (!validateEmail(email)) {
            toast.error('Por favor, ingresa un correo electrónico válido.');
            return false;
        }
        if (!password) {
            toast.error('Por favor, ingresa tu contraseña.');
            return false;
        }
        if (password.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres.');
            return false;
        }
        return true;
    };

    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handleAuth = () => {
        if (!validateEmailAndPassword()) return;

        if (isCreatingAccount) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => handleAuthSuccess(userCredential))
                .catch((error) => handleAuthError(error.code));
        } else {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => handleAuthSuccess(userCredential))
                .catch((error) => handleAuthError(error.code));
        }
    };

    const handleAuthSuccess = (userCredential) => {
        if (userCredential) {
            dispatch(authenticate({ loggedIn: true, checked: true, userId: userCredential.user.uid }));
            navigation.navigate('Home');
        }
    };

    const handleAuthError = (errorCode) => {
        switch (errorCode) {
            case 'auth/invalid-email':
                toast.error('El correo electrónico no es válido.');
                break;
            case 'auth/user-disabled':
                toast.error('La cuenta de usuario ha sido deshabilitada.');
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                toast.error('Correo electrónico o contraseña incorrectos.');
                break;
            case 'auth/invalid-credential':
                toast.error('Las credenciales proporcionadas no son válidas.');
                break;
            default:
                toast.error('Ocurrió un error. Por favor, inténtalo de nuevo más tarde.');
        }
    };

    const toggleMode = () => {
        setIsCreatingAccount((prevMode) => !prevMode);
    };

    return (
        <View style={styles.loginBody}>
            <ToastContainer />
            <View style={styles.container}>
                <Text>{!isCreatingAccount ? '¡Bienvenido!' : 'Registro.'}</Text>
                {!isCreatingAccount && <Text>Por favor ingresa tus credenciales.</Text>}
                <View>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        placeholder="Correo electrónico"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            placeholder="Contraseña"
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword((prevShowPassword) => !prevShowPassword)}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size={24} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handleAuth}>
                        <Text>{isCreatingAccount ? 'Crear cuenta' : 'Iniciar sesión'}</Text>
                    </TouchableOpacity>
                </View>
                <Text>
                    {isCreatingAccount ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
                    <TouchableOpacity onPress={toggleMode}>
                        <Text>{isCreatingAccount ? 'Inicia sesión' : 'Crea una cuenta'}</Text>
                    </TouchableOpacity>
                </Text>
            </View>
        </View>
    );
}

const styles = {
    loginBody: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#d9ead3',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    input: {
        height: 40,
        width: '100%',
        marginBottom: 10,
    },
};

export default Login;
