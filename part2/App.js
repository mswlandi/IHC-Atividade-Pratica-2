import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  View,
  Appearance,
  StyleSheet,
  TextInput,
  NativeModules,
  DeviceEventEmitter,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  useTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Geolocation from 'react-native-geolocation-service';
const SensorManager = NativeModules.SensorManager;



const requestGPSPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Permissão do uso do GPS para Atividade Prática 2",
        message:
        "Para usar o GPS você precisa conceder a permissão do uso da Geolocalização",
        buttonNeutral: "Me pergunte depois",
        buttonNegative: "Cancelar",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const colorScheme = Appearance.getColorScheme();
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Tela"
          component={Tela}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Tela = ({ navigation }) => {
  const [light, setLight] = useState(0);
  const [acc, setAcc] = useState({ x: 0, y: 0, z: 0 });
  const [gyro, setGyro] = useState({ x: 0, y: 0, z: 0 });
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const watchId = useRef(null);

  let locationPermission = true;
  useEffect(() => {
    if (!PermissionsAndroid.check("android.permission.ACCESS_FINE_LOCATION")) {
      locationPermission = requestGPSPermission();
    }
  });

  useEffect(() => {
    if (locationPermission) {
      watchId.current = Geolocation.watchPosition(
        (position) => {
          setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude});
        },
        (error) => {
          setLocation(null);
          console.log(error);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 5000,
          fastestInterval: 2000,
          showLocationDialog: true,
        },
      );
    }

    return () => {
      if (watchId) {
        Geolocation.clearWatch(watchId);
      }
    };
  });

  SensorManager.startLightSensor(100);
  DeviceEventEmitter.addListener('LightSensor', function (data) {
    setLight(data.light);
  });

  DeviceEventEmitter.addListener('Gyroscope', function (data) {
    setGyro(data);
  });
  SensorManager.startGyroscope(100);

  SensorManager.startAccelerometer(100);
  DeviceEventEmitter.addListener('Accelerometer', function (data) {
    setAcc(data);
    if (data.z < -7) {
      navigation.navigate('Activity 2')
    }
  });

  const { colors } = useTheme();

  return (
    <View style={styles.container1}>
      <TextInput
        style={[styles.input, styles.margin, { color: colors.text }]}
        defaultValue={`Luminosidade: ${light.toFixed(3)}`}
        editable={false}
      />
      <Text style={{ color: colors.text }}>Acelerometro:</Text>
      <View style={styles.container2}>
        <TextInput
          style={[styles.acel, styles.margin, { color: colors.text }]}
          defaultValue={`X: ${acc.x.toFixed(3)}`}
          editable={false}
        />
        <TextInput
          style={[styles.acel, styles.margin, { color: colors.text }]}
          defaultValue={`Y: ${acc.y.toFixed(3)}`}
          editable={false}
        />
        <TextInput
          style={[styles.acel, styles.margin, { color: colors.text }]}
          defaultValue={`Z: ${acc.z.toFixed(3)}`}
          editable={false}
        />
      </View>
      <Text style={{ color: colors.text }}>Giroscópio:</Text>
      <View style={styles.container2}>
        <TextInput
          style={[styles.acel, styles.margin, { color: colors.text }]}
          defaultValue={`X: ${gyro.x.toFixed(3)}`}
          editable={false}
        />
        <TextInput
          style={[styles.acel, styles.margin, { color: colors.text }]}
          defaultValue={`Y: ${gyro.y.toFixed(3)}`}
          editable={false}
        />
        <TextInput
          style={[styles.acel, styles.margin, { color: colors.text }]}
          defaultValue={`Z: ${gyro.z.toFixed(3)}`}
          editable={false}
        />
      </View>
      <TextInput
        style={[styles.input, styles.margin, { color: colors.text }]}
        defaultValue={`Latitude: ${location.latitude}`}
        editable={false}
      />
      <TextInput
        style={[styles.input, styles.margin, { color: colors.text }]}
        defaultValue={`Longitude: ${location.longitude}`}
        editable={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    padding: 30,
  },
  container2: {
    flexDirection: 'row',
  },
  acel: {
    borderColor: 'gray',
    borderWidth: 1,

    height: 40,
    paddingLeft: 10,
    margin: 3,

    flexBasis: "auto",
    flexGrow: 1,
    flexShrink: 1,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',

    height: 40,
    paddingLeft: 10,
    margin: 3,
  },
  button: {
    alignSelf: 'stretch',
    alignItems: "center",

    backgroundColor: "#DDDDDD",
    padding: 10,
    marginLeft: 10,
  },
  margin: {
    marginBottom: 10,
  },
})

export default App;