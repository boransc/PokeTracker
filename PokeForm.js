//lets user manually add a Pokemon theyve seen (name, location, date) and if they caught it
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, FlatList, Animated, Easing} from 'react-native';
import { gen1Pokemon } from './KantoPokemon';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PokeForm({ navigation, route }) {
  const addPokemon = route.params?.addPokemon;

  //inputs the user fills out
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [seenDate, setSeenDate] = useState('');
  const [caught, setCaught] = useState(false);
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);

  //just for spinning Pokeball animation
  const rotation = useState(new Animated.Value(0))[0];

  //spin forever
  React.useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 40000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  });

  //if for some reason addPokemon isn't passed in, go back to the list
  if (!addPokemon) {
    console.error("addPokemon function is missing");
    navigation.navigate('PokeList');
    return null;
  }

  //validation for empty fields
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!seenDate.trim()) newErrors.seenDate = 'Seen date is required'; 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //saves the new Pokemon if valid and real
  const checkDetails = async () => {
    if (!validate()) return;

    const foundPokemon = gen1Pokemon.find(
      (p) => p.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (!foundPokemon) {
      Alert.alert('Error', 'Pokémon not found in the Gen1 Pokédex.');
      return;
    }

    const newPokemon = {
      ...foundPokemon,
      locationSeen: location.trim(),
      seenDate: seenDate.trim(),
      caught: caught,
      isFavorite: false,
    };

    try {
      const existingData = await AsyncStorage.getItem('filteredPokemon');
      const pokemonList = existingData ? JSON.parse(existingData) : [];
      const updatedList = [...pokemonList, newPokemon];
      await AsyncStorage.setItem('filteredPokemon', JSON.stringify(updatedList));

      navigation.navigate('PokeList');
    } catch (error) {
      console.error("Failed to save Pokémon:", error);
      Alert.alert('Error', 'Failed to save Pokémon.');
    }
  };

  //suggest names from the list
  const handleNameChange = (text) => {
    setName(text);
    if (text.length > 0) {
      const filtered = gen1Pokemon
        .filter(p => p.name.toLowerCase().includes(text.toLowerCase()))
        .map(p => p.name);
      setSuggestions(filtered.slice(0, 5)); // max 5 suggestions
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion) => {
    setName(suggestion);
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      
      {/*spinning faded Pokeball in background*/}
      <Animated.Image
        source={require('./assets/pokeball2.png')}
        style={[
          styles.pokeballBackground,
          {
            transform: [
              {
                rotate: rotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      />

      {/*input: name*/}
      <Text style={styles.label}>Who's that Pokémon?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Pokémon name (e.g. Pikachu)"
        value={name}
        onChangeText={handleNameChange}
        autoCapitalize="words"
        clearButtonMode="while-editing"
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      {/*live suggestions below name box*/}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => selectSuggestion(item)}>
              <Text style={styles.suggestionItem}>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionList}
        />
      )}

      {/*input: locatio*/}
      <Text style={styles.label}>Where's that Pokémon?</Text>
      <TextInput
        style={styles.input}
        placeholder="Where did you see this Pokémon?"
        value={location}
        onChangeText={(text) => setLocation(text)}
        clearButtonMode="while-editing"
      />
      {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

      {/*input: date*/}
      <Text style={styles.label}>When did you see it?</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Today, Yesterday, 12 March 2025"
        value={seenDate}
        onChangeText={(text) => setSeenDate(text)}
        clearButtonMode="while-editing"
      />
      {errors.seenDate && <Text style={styles.errorText}>{errors.seenDate}</Text>}

      {/*toggle: caught or not*/}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Did you catch this Pokémon 🎯?</Text>
        <TouchableOpacity
          style={[styles.switchButton, caught && styles.switchButtonActive]}
          onPress={() => setCaught(!caught)}
        >
          <Text style={styles.switchText}>{caught ? "Yes" : "No"}</Text>
        </TouchableOpacity>
      </View>

      {/*buttons to submit or go back*/}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={checkDetails}>
          <Text style={styles.buttonText}>Add Pokémon</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (name || location || seenDate) {
              Alert.alert(
                'Unsaved Changes',
                'Are you sure you want to go back? Your inputs will be lost.',
                [{ text: 'Cancel', style: 'cancel' }, { text: 'Yes', onPress: () => navigation.navigate('PokeList') }]
              );
            } else {
              navigation.navigate('PokeList');
            }
          }}
        >
          <Text style={styles.buttonText}>Back to List</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

//stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  input: {
    height: 45,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  suggestionList: {
    maxHeight: 120,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  addButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  backButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    color: 'white'
  },
  switchButton: {
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  switchButtonActive: {
    backgroundColor: 'green'
  },
  switchText: {
    color: 'white',
    fontWeight: 'bold'
  },
  pokeballBackground: {
  position: 'absolute',
  alignSelf: 'center',
  width: 500,
  height: 500,
  opacity: 0.2 
},
});
