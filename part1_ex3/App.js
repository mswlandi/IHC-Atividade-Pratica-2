import React, { useState } from 'react';
import {
  Text,
  View,
  Appearance,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  useTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const SensorManager = NativeModules.SensorManager;


const colorScheme = Appearance.getColorScheme();
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Activity 1"
          component={AccelerometerScreen}
        />
        <Stack.Screen
          name="Activity 2"
          component={ShowMessageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AccelerometerScreen = ({ navigation }) => {
  const [acc, setAcc] = useState({ x: 0, y: 0, z: 0 });

  SensorManager.startAccelerometer(100);
  DeviceEventEmitter.addListener('Accelerometer', function (data) {
    setAcc(data);
    if (data.z < -7) {
      navigation.navigate('Activity 2')
    }
  });

  return (
    <View style={styles.container1}>
      <TextInput
        style={[styles.input, styles.margin]}
        defaultValue={`X: ${acc.x.toFixed(3)}`}
        editable={false}
      />
      <TextInput
        style={[styles.input, styles.margin]}
        defaultValue={`Y: ${acc.y.toFixed(3)}`}
        editable={false}
      />
      <TextInput
        style={[styles.input, styles.margin]}
        defaultValue={`Z: ${acc.z.toFixed(3)}`}
        editable={false}
      />
    </View>
  );
};

const ShowMessageScreen = ({ navigation }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container2}>
      <Text style={{ color: colors.text }}>Vire o celular para cima!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flexDirection: 'row',
    padding: 30,
  },
  container2: {
    flexDirection: 'row',
    padding: 30,
    paddingTop: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    color: 'white',

    height: 40,
    paddingLeft: 10,
    margin: 3,

    flexBasis: "auto",
    flexGrow: 1,
    flexShrink: 1,
  },
  button: {
    alignSelf: 'stretch',
    alignItems: "center",

    backgroundColor: "#DDDDDD",
    padding: 10,
    marginLeft: 10,

    flexBasis: 80,
    flexGrow: 0,
    flexShrink: 0,
  },
  margin: {
    marginBottom: 10,
  },
})

export default App;
