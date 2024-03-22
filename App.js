import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/pages/Home';
import Login from './src/pages/Login';
import { store } from './src/redux/store';
import { TareasProvider } from './src/helpers/TareasProvider';

const Stack = createStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <TareasProvider> 
        <NavigationContainer>
          <Stack.Navigator headerMode="none">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home} />
          </Stack.Navigator>
        </NavigationContainer>
      </TareasProvider>
    </Provider>
  );
}

export default App;