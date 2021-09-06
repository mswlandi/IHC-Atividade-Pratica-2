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


const colorScheme = Appearance.getColorScheme();
const Stack = createNativeStackNavigator();

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

const App = ({ navigation }) => {
  const [light, setLight] = useState(0);
  const [proximity, setProximity] = useState(0);
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

  SensorManager.startProximity(100);
  DeviceEventEmitter.addListener('Proximity', function (data) {
    setProximity(data.value);
  });

  return (
    <View style={styles.container1}>
      <TextInput
        style={[styles.input, styles.margin]}
        defaultValue={`Luminosidade: ${light.toFixed(3)}`}
        editable={false}
      />
      <TextInput
        style={[styles.input, styles.margin]}
        defaultValue={`Proximidade: ${proximity.toFixed(3)}`}
        editable={false}
      />
      <TextInput
        style={[styles.input, styles.margin]}
        defaultValue={`Latitude: ${location.latitude}`}
        editable={false}
      />
      <TextInput
        style={[styles.input, styles.margin]}
        defaultValue={`Latitude: ${location.longitude}`}
        editable={false}
      />
      <TouchableOpacity
        onPress={requestGPSPermission}
        style={[styles.button, styles.margin]}
      >
        <Text>Pedir Permissão</Text>
      </TouchableOpacity>
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
    flex: 1,
    padding: 30,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    color: 'white',
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