import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMoon, faSun, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { TareasContext } from '../helpers/TareasProvider';
import { auth } from '../config/firebase-config';

function Navbar() {
  const { darkMode, toggleDarkMode } = useContext(TareasContext);
  const navigation = useNavigation(); 

  const handleCerrarSesion = () => {
    auth.signOut() 
      .then(() => {
        navigation.navigate('Login'); 
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <View style={[styles.navbar, darkMode && styles.darkNavbar]}>
      <View style={styles.navbarContainer}>
        <Text style={styles.navbarTitle}>Gestor de tareas</Text>
        <View style={styles.navbarIcons}>
          <TouchableOpacity onPress={toggleDarkMode} style={styles.navbarIcon}>
            <FontAwesomeIcon
              icon={darkMode ? faSun : faMoon}
              size={24}
              color={darkMode ? '#fff' : '#000'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCerrarSesion} style={styles.navbarIcon}>
            <FontAwesomeIcon
              icon={faSignOutAlt}
              size={24}
              color={darkMode ? '#fff' : '#000'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#fff',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  darkNavbar: {
    backgroundColor: '#000',
  },
  navbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navbarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  navbarIcons: {
    flexDirection: 'row',
  },
  navbarIcon: {
    marginLeft: 10,
  },
};

export default Navbar;
