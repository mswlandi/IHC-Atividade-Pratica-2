import React, { useState } from 'react';
import { Text, View, Appearance, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const colorScheme = Appearance.getColorScheme();
if (colorScheme === 'dark') {

}

let calcAndUpdateResult = (val1, val2, setResult) => {
  let numVal1 = 0;
  let numVal2 = 0;

  if (!Number.isNaN(parseInt(val1, 10))) {
    numVal1 = parseInt(val1, 10);
  }

  if (!Number.isNaN(parseInt(val2, 10))) {
    numVal2 = parseInt(val2, 10);
  }

  setResult(numVal1 + numVal2);
}

const App = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [result, setResult] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, styles.margin]}
        onChangeText={text => setText1(text)}
        placeholder="Enter a Number"
        keyboardType="number-pad"
      />
      <TextInput
        style={[styles.input, styles.margin]}
        onChangeText={text => setText2(text)}
        placeholder="Enter a Number"
        keyboardType="number-pad"
      />
      <TouchableOpacity
        onPress={() => calcAndUpdateResult(text1, text2, setResult)}
        style={[styles.button, styles.margin]}
      >
        <Text>Sum</Text>
      </TouchableOpacity>
      <Text style={styles.text}>
        {result}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    padding: 30
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 40,
    width: '100%',
  },
  text: {
    color: 'white'
  },
  button: {
    alignSelf: 'stretch',
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  margin: {
    marginBottom: 10,
  },
})

export default App;