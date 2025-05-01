// shows details about a Pokémon including overview, stats, and evolution info
import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View, Text, Image, StyleSheet, Dimensions,
  TouchableOpacity, SafeAreaView, ScrollView, Animated, Easing
} from 'react-native';
import { gen1Pokemon } from './KantoPokemon';
import { ThemeContext } from './Theme';

const screenWidth = Dimensions.get('window').width;

export default function PokeDetailScreen({ route, navigation }) {
  const { pokemonData } = route.params;
  const { colors } = useContext(ThemeContext);

  const pokemon = pokemonData;

  //handles which tab is active
  const [activeTab, setActiveTab] = useState('Overview');

  //extra info fetched from API
  const [detailedInfo, setDetailedInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  //animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const statAnimations = useRef({}).current;

  //spin the pokeball background
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  });

  //fade in when switching tabs
  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    //animate the stats bars
    if (pokemon.stats) {
      Object.keys(pokemon.stats).forEach(stat => {
        if (!statAnimations[stat]) {
          statAnimations[stat] = new Animated.Value(0);
        } else {
          statAnimations[stat].setValue(0);
        }
        if (activeTab === 'Stats') {
          Animated.timing(statAnimations[stat], {
            toValue: Math.min(pokemon.stats[stat], 100),
            duration: 1600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }).start();
        }
      });
    }
  }, [activeTab, pokemon.stats, fadeAnim, statAnimations]);

  //fetch extra Pokémon info from PokeAPI
  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name.toLowerCase()}`);
        const pokemonData = await res.json();

        const resSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name.toLowerCase()}`);
        const speciesData = await resSpecies.json();

        //parsing data
        const height = pokemonData.height / 10;
        const weight = pokemonData.weight / 10;
        const abilities = pokemonData.abilities.map(a => a.ability.name);
        const types = pokemonData.types.map(t => t.type.name);

        const maleRate = speciesData.gender_rate === -1
          ? "Genderless"
          : `${((8 - speciesData.gender_rate) / 8) * 100}% ♂ / ${(speciesData.gender_rate / 8) * 100}% ♀`;

        const catchRate = speciesData.capture_rate;
        const baseFriendship = speciesData.base_happiness;
        const growthRate = speciesData.growth_rate.name;
        const eggGroups = speciesData.egg_groups.map(g => g.name);

        setDetailedInfo({
          height, weight, abilities, types, maleRate,
          catchRate, baseFriendship, growthRate, eggGroups,
        });
      } catch (error) {
        console.error("Failed to fetch Pokémon details:", error);
        setDetailedInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [pokemon.name]);

  //animation for rotating pokeball
  const rotateStyle = {
    transform: [{
      rotate: rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      })
    }],
    position: 'absolute',
    alignSelf: 'center',
    opacity: 0.2,
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    zIndex: -1,
  };

  //builds the evolution chain based on Kanto data
  const getEvolutionChain = (poke) => {
    let base = poke;
    while (base.evolution?.evolvesFrom) {
      const previous = gen1Pokemon.find(p => p.id === base.evolution.evolvesFrom);
      if (!previous) break;
      base = previous;
    }
    const chain = [base];
    while (chain[chain.length - 1].evolution?.evolvesTo) {
      const nextId = chain[chain.length - 1].evolution.evolvesTo;
      const next = gen1Pokemon.find(p => p.id === nextId);
      if (!next) break;
      chain.push(next);
    }
    return chain;
  };

  const evolutionLine = getEvolutionChain(pokemon);

  //small tab button component
  const TabButton = ({ label }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === label && { borderBottomColor: colors.primary, borderBottomWidth: 3 }]}
      onPress={() => setActiveTab(label)}
    >
      <Text style={[styles.tabText, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );

  //render the "Overview" tab
  const renderOverview = () => (
    <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
      <Animated.Image
        source={require('./assets/pokeball2.png')}
        style={rotateStyle}
        resizeMode="contain"
      />
      <Image source={{ uri: pokemon.image }} style={styles.image} />

      {/*if caught or favorite, show badges*/}
      <View style={styles.badgesRow}>
        {pokemon.isFavorite && <Text style={styles.badge}>⭐ Favorite</Text>}
        {pokemon.caught && <Text style={styles.badge}>🎯 Caught</Text>}
      </View>

      <Text style={[styles.name, { color: colors.text }]}>{pokemon.name}</Text>
      <Text style={[styles.type, { color: colors.text }]}>Type: {pokemon.type.join(', ')}</Text>
      <Text style={[styles.description, { color: colors.text }]}>{pokemon.description}</Text>

      {/*location and date*/}
      <View style={styles.extraInfo}>
        <Text style={styles.extraText}>📍 Seen at: {pokemon.locationSeen || 'Unknown'}</Text>
        <Text style={styles.extraText}>📅 Seen on: {pokemon.seenDate || 'Unknown'}</Text>
      </View>

      {/*fetched extra info*/}
      {loading ? (
        <Text style={{ marginTop: 20, color: colors.text }}>Loading details...</Text>
      ) : detailedInfo ? (
        <>
          <View style={styles.infoBlock}><Text style={[styles.infoLabel, { color: colors.text }]}>Height:</Text><Text style={[styles.infoText, { color: colors.text }]}>{detailedInfo.height} m</Text></View>
          <View style={styles.infoBlock}><Text style={[styles.infoLabel, { color: colors.text }]}>Weight:</Text><Text style={[styles.infoText, { color: colors.text }]}>{detailedInfo.weight} kg</Text></View>
          <View style={styles.infoBlock}><Text style={[styles.infoLabel, { color: colors.text }]}>Abilities:</Text><Text style={[styles.infoText, { color: colors.text }]}>{detailedInfo.abilities.join(', ')}</Text></View>
          <View style={styles.infoBlock}><Text style={[styles.infoLabel, { color: colors.text }]}>Gender Ratio:</Text><Text style={[styles.infoText, { color: colors.text }]}>{detailedInfo.maleRate}</Text></View>
          <View style={styles.infoBlock}><Text style={[styles.infoLabel, { color: colors.text }]}>Catch Rate:</Text><Text style={[styles.infoText, { color: colors.text }]}>{detailedInfo.catchRate}</Text></View>
          <View style={styles.infoBlock}><Text style={[styles.infoLabel, { color: colors.text }]}>Base Friendship:</Text><Text style={[styles.infoText, { color: colors.text }]}>{detailedInfo.baseFriendship}</Text></View>
          <View style={styles.infoBlock}><Text style={[styles.infoLabel, { color: colors.text }]}>Growth Rate:</Text><Text style={[styles.infoText, { color: colors.text }]}>{detailedInfo.growthRate}</Text></View>
          <View style={styles.infoBlock}><Text style={[styles.infoLabel, { color: colors.text }]}>Egg Groups:</Text><Text style={[styles.infoText, { color: colors.text }]}>{detailedInfo.eggGroups.join(', ')}</Text></View>
        </>
      ) : (
        <Text style={{ color: colors.text }}>Details not available.</Text>
      )}
    </Animated.View>
  );

  //render Stats tab
  const renderStats = () => {
    if (!pokemon?.stats) {
      return <Text style={{ marginTop: 20, color: colors.text }}>Stats not available.</Text>;
    }
    const totalBaseStats = Object.values(pokemon.stats).reduce((sum, val) => sum + val, 0);

    return (
      <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
        {Object.entries(pokemon.stats).map(([stat, value]) => (
          <View key={stat} style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.text }]}>{stat.toUpperCase()}</Text>
            <View style={styles.statBarBackground}>
              <Animated.View style={[
                styles.statBarFill,
                { width: statAnimations[stat]?.interpolate({ inputRange: [0, 150], outputRange: ['0%', '100%'] }) || '0%' }
              ]} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
          </View>
        ))}
        <View style={styles.totalStatsContainer}>
          <Text style={styles.totalStatsText}>Total Base Stats: {totalBaseStats}</Text>
        </View>
      </Animated.View>
    );
  };

  //render Evolution tab
  const renderEvolution = () => (
    <Animated.View style={[styles.tabContent, { opacity: fadeAnim }]}>
      {evolutionLine.map((evo, index) => (
        <View key={evo.id} style={styles.evolutionBlock}>
          <Image source={{ uri: evo.image }} style={styles.verticalEvoImage} />
          <Text style={[styles.evoName, { color: colors.text }]}>{evo.name}</Text>
          {index < evolutionLine.length - 1 && <Text style={styles.downArrow}>⬇️</Text>}
        </View>
      ))}
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.tabBar}>
        <TabButton label="Overview" />
        <TabButton label="Stats" />
        <TabButton label="Evolution" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'Stats' && renderStats()}
        {activeTab === 'Evolution' && renderEvolution()}
      </ScrollView>

      {/*back button*/}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
} 

//stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4'
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center'
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginTop: 40
  },
  tabButton: {
    padding: 10
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  tabContent: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center'
  },
  image: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.5,
    marginBottom: 15,
    marginTop: 40,
    zIndex: 1
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  type: {
    fontSize: 18,
    marginVertical: 5
  },
  description: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center'
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 35
  },
  statLabel: {
    width: 60,
    fontWeight: 'bold'
  },
  statBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
    borderRadius: 5
  },
  statBarFill: {
    height: 10,
    backgroundColor: '#007bff',
    borderRadius: 5
  },
  statValue: {
    width: 30,
    textAlign: 'right'
  },
  evolutionBlock: {
    alignItems: 'center',
    marginVertical: 20
  },
  verticalEvoImage: {
    width: 150,
    height: 150
  },
  evoName: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  downArrow: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 10
  },
  backButton: {
    padding: 12,
    backgroundColor: '#007bff',
    alignItems: 'center'
  },
  backText: {
    color: 'white',
    fontSize: 16
  },
    infoBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10
  },
  infoLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    flex: 1
  },
  infoText: {
    fontSize: 16,
    flex: 2,marginTop: 10,
    textAlign: 'right'
  },
  totalStatsContainer: {
  marginTop: 20,
  padding: 10,
  backgroundColor: '#e0e0e0',
  borderRadius: 10
},
totalStatsText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  textAlign: 'center'
},

  badgesRow: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 10
},
badge: {
  backgroundColor: '#ffd700',
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 12,
  marginHorizontal: 5,
  fontWeight: 'bold',
  fontSize: 14
},
extraInfo: {
  marginTop: 10,
  marginBottom: 20,
  alignItems: 'center'
},
extraText: {
  fontSize: 14,
  color: '#555',
  marginBottom: 5
}
});
