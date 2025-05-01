//this shows each Pokémon as a card with some info + animations + favorite toggle
import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';

//card color match the Pokémon type
const getTypeColor = (type) => {
  switch (type) {
    case 'Grass': return '#4CAF50'; case 'Fire': return '#FF7043'; case 'Water': return '#42A5F5';
    case 'Electric': return '#C9A000'; case 'Poison': return '#AB47BC'; case 'Bug': return '#9E9D24';
    case 'Normal': return '#BDBDBD'; case 'Flying': return '#7E57C2'; case 'Ground': return '#A1887F'; 
    case 'Fighting': return '#E53935'; case 'Psychic': return '#EC407A'; case 'Rock': return '#8D6E63'; 
    case 'Ghost': return '#7E57C2'; case 'Ice': return '#80DEEA'; case 'Dragon': return '#5C6BC0';
    case 'Fairy': return '#F48FB1'; case 'Steel': return '#90A4AE'; default: return '#68A090';
  }
};

export default function PokemonCard({ pokemon, onPress, onToggleFavorite }) {
  //animation for fade-in and slide-up when card loads
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    //when the component mounts, start the animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  });

  const backgroundColor = getTypeColor(pokemon.type[0]);

  return (
    <Animated.View
      style={[styles.cardContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
    >
      {/*when you press the card, it shows details*/}
      <TouchableOpacity
        style={[styles.card, { backgroundColor }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {/*the top-right area for favorite star and caught icon*/}
        <View style={styles.badges}>
          <TouchableOpacity style={styles.favoriteBadge} onPress={onToggleFavorite}>
            <Text style={styles.favoriteStar}>
              {pokemon.isFavorite ? '★' : '☆'}
            </Text>
          </TouchableOpacity>

          {pokemon.caught && (
            <View style={styles.caughtBadge}>
              <Text style={styles.caughtText}>🎯</Text>
            </View>
          )}
        </View>

        {/*Pokémon image and basic info*/}
        <Image source={{ uri: pokemon.image }} style={styles.image} />
        <Text style={styles.name}>{pokemon.name}</Text>
        <Text style={styles.id}>#{pokemon.id}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

//styling for the card layout and animations
const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    margin: 8,
  },
  card: {
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    elevation: 5,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  badges: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriteBadge: {
    marginHorizontal: 2,
  },
  favoriteStar: {
    fontSize: 24,
    color: 'gold',
  },
  caughtBadge: {
    marginHorizontal: 2,
  },
  caughtText: {
    fontSize: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
    marginTop: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'capitalize',
    marginBottom: 4,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  id: {
    fontSize: 12,
    color: 'white',
  },
});
