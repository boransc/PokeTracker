// shows all the Pokémon the user has seen/added. You can search, filter, sort, favorite, delete, etc.
import React, { useState, useCallback, useContext } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  SafeAreaView, Modal, Dimensions, StyleSheet, Alert, Animated, Easing
} from 'react-native';
import { ThemeContext } from './Theme';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';
import PokemonCard from './PokemonCard';

const screenWidth = Dimensions.get('window').width;

export default function PokeListScreen({ navigation, route }) {
  const { colors } = useContext(ThemeContext);

  //states for search, filtering and sorting
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortMode, setSortMode] = useState('ID_ASC');
  const [pokemonList, setPokemonList] = useState([]);

  //for the rotating Pokeball in the background
  const rotation = useState(new Animated.Value(0))[0];

  //whenever we return to this screen, reload the Pokemon list
  useFocusEffect(
    useCallback(() => {
      const loadPokemonList = async () => {
        try {
          const savedList = await AsyncStorage.getItem('filteredPokemon');
          if (savedList) setPokemonList(JSON.parse(savedList));
        } catch (error) {
          console.error("Failed to load Pokémon list:", error);
        }
      };
      loadPokemonList();

      //if a new Pokemon was added save and refresh list
      if (route.params?.newPokemon) {
        setPokemonList(prevList => {
          const updatedList = [...prevList, { ...route.params.newPokemon, isFavorite: false }];
          AsyncStorage.setItem('filteredPokemon', JSON.stringify(updatedList))
            .catch(error => console.error("Failed to save Pokémon list:", error));
          return updatedList;
        });
        navigation.setParams({ newPokemon: null });
      }
    }, [route.params?.newPokemon, navigation])
  );

  //start the spinning Pokeball
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

  //toggles the favorite star
  const toggleFavorite = (id) => {
    setPokemonList(prevList =>
      prevList.map(pokemon =>
        pokemon.id === id ? { ...pokemon, isFavorite: !pokemon.isFavorite } : pokemon
      )
    );
  };

  //toggles caught status (not used in UI yet, but works)
  const toggleCaught = (id) => {
    setPokemonList(prevList =>
      prevList.map(pokemon =>
        pokemon.id === id ? { ...pokemon, caught: !pokemon.caught } : pokemon
      )
    );
  };

  //show alert before deleting
  const confirmDeletePokemon = (id) => {
    Alert.alert(
      'Delete Pokémon',
      'Are you sure you want to remove this Pokémon?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deletePokemon(id) }
      ]
    );
  };

  //delete Pokémon from the list + save updated list
  const deletePokemon = (id) => {
    setPokemonList(prevList => {
      const updatedList = prevList.filter(pokemon => pokemon.id !== id);
      AsyncStorage.setItem('filteredPokemon', JSON.stringify(updatedList))
        .catch(error => console.error("Failed to delete Pokémon:", error));
      return updatedList;
    });
  };

  //filters and sorts the Pokémon list based on current settings
  const filterAndSortPokemon = () => {
    let filteredPokemon = pokemonList.filter(pokemon =>
      (selectedType === 'All' || pokemon.type.includes(selectedType)) &&
      pokemon.name.toLowerCase().includes(search.toLowerCase())
    );

    switch (sortMode) {
      case 'NAME_ASC':filteredPokemon.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'NAME_DESC':filteredPokemon.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'ID_ASC':filteredPokemon.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        break;
      case 'ID_DESC':filteredPokemon.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'FAVORITE_FIRST':filteredPokemon.sort((a, b) => (b.isFavorite === true) - (a.isFavorite === true));
        break;
    }
    return filteredPokemon;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      {/*Settings button*/}
      <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
        <Text style={{ fontSize: 24 }}>⚙️</Text>
      </TouchableOpacity>

      {/*Background Pokeball*/}
      <Animated.Image
        source={require('./assets/pokeball2.png')}
        style={[styles.pokeballBackground, {
          transform: [{
            rotate: rotation.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            }),
          }],
        }]}
      />

      {/*Title*/}
      <Text style={[styles.title, { color: colors.text }]}>PokéList</Text>

      {/*Search Bar*/}
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchBar, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Search Pokémon..."
          placeholderTextColor={colors.border}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/*Filter + Sort buttons*/}
      <View style={styles.topButtons}>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.primary }]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={styles.buttonText}>Filter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortButton, { backgroundColor: colors.primary }]}
          onPress={() => setSortModalVisible(true)}
        >
          <Text style={styles.buttonText}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/*The Pokemon cards*/}
      <FlatList
        data={filterAndSortPokemon()}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.text }]}>
            {"\n"}No Pokémon found!{"\n"}Add one with the "+" button!
          </Text>
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1, margin: 8 }}>
            <Swipeable renderRightActions={() => (
              <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeletePokemon(item.id)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            )}>
              <PokemonCard
                pokemon={item}
                onPress={() => navigation.navigate('PokeDetail', { pokemonData: item })}
                onToggleFavorite={() => toggleFavorite(item.id)}
                onToggleCaught={() => toggleCaught(item.id)}
              />
            </Swipeable>
          </View>
        )}
      />

      {/*Add Pokemon button*/}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PokeForm', { addPokemon: setPokemonList })}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>

      {/*Sort Modal*/}
      <Modal transparent visible={sortModalVisible} onRequestClose={() => setSortModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Sort Pokémon</Text>

            {['NAME_ASC', 'NAME_DESC', 'ID_ASC', 'ID_DESC', 'FAVORITE_FIRST'].map(mode => (
              <TouchableOpacity
                key={mode}
                onPress={() => {
                  setSortMode(mode);
                  setSortModalVisible(false);
                }}
              >
                <Text style={[styles.modalOption, { color: colors.text }]}>{mode.replace('_', ' ')}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.closeButton} onPress={() => setSortModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/*Filter Modal*/}
      <Modal transparent visible={filterModalVisible} onRequestClose={() => setFilterModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.chipContainer}>
            {['All', 'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Fairy'].map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.chip, selectedType === type && styles.activeChip]}
                onPress={() => {
                  setSelectedType(type);
                  setFilterModalVisible(false);
                }}
              >
                <Text style={styles.chipText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 10 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', paddingTop: 50, paddingBottom: 10 },
  searchContainer: { alignItems: 'center', paddingVertical: 10 },
  searchBar: { width: screenWidth * 0.8, borderRadius: 10, padding: 10, fontSize: 16 },
  topButtons: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginVertical: 10 },
  filterButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, elevation: 3 },
  sortButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, elevation: 3 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: 'green', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabIcon: { fontSize: 30, bottom: 2, color: 'white', fontWeight: 'bold' },
  emptyText: { fontSize: 18, textAlign: 'center', marginTop: 20 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { padding: 20, borderRadius: 10, width: 300, alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  modalOption: { fontSize: 18, marginVertical: 10 },
  closeButton: { marginTop: 20, backgroundColor: 'green', padding: 10, borderRadius: 5 },
  closeButtonText: { color: 'white', fontSize: 16 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 10, marginBottom: 10 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#ddd', borderRadius: 20, margin: 5 },
  activeChip: { backgroundColor: '#007bff' },
  chipText: { fontSize: 14 },
  deleteButton: { backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', width: 80, height: '85%', borderRadius: 20, marginTop: 10, marginBottom: 10 },
  deleteButtonText: { color: 'white', fontWeight: 'bold' },
  pokeballBackground: { position: 'absolute', marginTop: 230, alignSelf: 'center', width: 500, height: 500, opacity: 0.2 },
  settingsButton: { position: 'absolute', top: 55, right: 40, zIndex: 10 },
});
