import React, { useState } from 'react';
import {
  Text,
  View,
  Appearance,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
  useTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const colorScheme = Appearance.getColorScheme();

const Stack = createNativeStackNavigator();

const App = () => {
  return (
  <NavigationContainer theme={colorScheme === 'dark'? DarkTheme : DefaultTheme}>
    <Stack.Navigator>
      <Stack.Screen
        name="Activity 1"
        component={InputScreen}
      />
      <Stack.Screen
          name="Activity 2"
        component={ShowMessageScreen} />
    </Stack.Navigator>
  </NavigationContainer>
  );
};

const InputScreen = ({ navigation }) => {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, styles.margin]}
        onChangeText={text => setText(text)}
        placeholder="Enter a Message"
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('Activity 2', { text: text }) }
        style={[styles.button, styles.margin]}
      >
        <Text>SEND</Text>
      </TouchableOpacity>
    </View>
  );
};

const ShowMessageScreen = ({ navigation, route }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={{ color: colors.text }}>{route.params.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 30,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 40,
    paddingLeft: 10,

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
