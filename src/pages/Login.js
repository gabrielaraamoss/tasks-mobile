import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
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
            alert('Por favor, ingresa un correo electrónico válido.');
            return false;
        }
        if (!password) {
           alert('Por favor, ingresa tu contraseña.');
            return false;
        }
        if (password.length < 6) {
           alert('La contraseña debe tener al menos 6 caracteres.');
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
               alert('El correo electrónico no es válido.');
                break;
            case 'auth/user-disabled':
               alert('La cuenta de usuario ha sido deshabilitada.');
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
               alert('Correo electrónico o contraseña incorrectos.');
                break;
            case 'auth/invalid-credential':
               alert('Las credenciales proporcionadas no son válidas.');
                break;
            default:
               alert('Ocurrió un error. Por favor, inténtalo de nuevo más tarde.');
        }
    };

    const toggleMode = () => {
        setIsCreatingAccount((prevMode) => !prevMode);
    };

    return (
        <View style={styles.loginBody}>
            <View style={styles.container}>
                <Text style={styles.welcomeText}>{!isCreatingAccount ? '¡Bienvenido!' : 'Registro.'}</Text>
                {!isCreatingAccount && <Text>Por favor ingresa tus credenciales.</Text>}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, {backgroundColor: 'white'}]}
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        placeholder="Correo electrónico"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <View style={styles.passwordInput}>
                        <TextInput
                            style={[styles.input, {flex: 1, backgroundColor: 'white'}]}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            placeholder="Contraseña"
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword((prevShowPassword) => !prevShowPassword)} style={styles.passwordToggle}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size={24} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handleAuth} style={styles.button}>
                        <Text style={styles.buttonText}>{isCreatingAccount ? 'Crear cuenta' : 'Iniciar sesión'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{marginVertical: 10}}></View> {/* Espacio vertical */}
                <Text>
                    {isCreatingAccount ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
                    <TouchableOpacity onPress={toggleMode}>
                        <Text style={styles.linkText}>{isCreatingAccount ? 'Inicia sesión' : 'Crea una cuenta'}</Text>
                    </TouchableOpacity>
                </Text>
            </View>
        </View>
    );
}

const styles = {
    loginBody: {
        flex: 1,
        backgroundColor: '#d9ead3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#e6f3e6',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        width: '80%', 
        maxWidth: 400, 
    },
    inputContainer: {
        marginBottom: 20,
        width: '100%',
    },
    input: {
        height: 40,
        width: '100%',
        marginBottom: 10,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#4caf50',
        width: '100%',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
    },
    welcomeText: {
        fontSize: 24,
        marginBottom: 10,
    },
    linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    passwordInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    passwordToggle: {
        position: 'absolute',
        top: '50%',
        right: 10,
        transform: [{translateY: -12}],
    },
};

export default Login;
