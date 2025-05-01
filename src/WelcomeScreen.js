import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  Animated,
  Easing,
  Alert,
} from 'react-native';
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function WelcomeScreen({ navigation }) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  });

  const handleStart = async () => {
    const hasSeenTutorial = await AsyncStorage.getItem('hasSeenTutorial');
    if (hasSeenTutorial) {
      navigation.replace('PokeList');
      return;
    }

    Alert.alert(
      'Welcome!',
      'Would you like to take a quick tutorial before entering the app?',
      [
        {
          text: 'Skip',
          onPress: async () => {
            await AsyncStorage.setItem('hasSeenTutorial', 'true');
            navigation.replace('PokeList');
          },
          style: 'cancel',
        },
        {
          text: 'Start Tutorial',
          onPress: async () => {
            await AsyncStorage.setItem('hasSeenTutorial', 'true');
            navigation.replace('Tutorial');
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pokeballContainer}>
        <Animated.Image
          style={[styles.pokeball, { transform: [{ translateY: bounceAnim }] }]}
          source={require('./assets/pokeball2.png')}
        />

        <Pressable onPress={handleStart} style={styles.buttonWrapper}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Card style={styles.buttonCard}>
              {/* Empty Card - used only for invisible clickable area */}
            </Card>
          </Animated.View>
        </Pressable>
      </View>

      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Welcome to {"\n"}PokéTracker!
      </Animated.Text>

      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        Track your journey. Catch ‘em all. {"\n"} Press the Pokéball to Get Started!
      </Animated.Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  title: {
    position: 'absolute',
    bottom: screenHeight * 0.09,
    left: 0,
    right: 0,
    fontSize: screenWidth * 0.1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  pokeball: {
    marginTop: 10,
    height: screenWidth,
    width: screenWidth,
    alignSelf: 'center',
  },
  buttonCard: {
    backgroundColor: 'transparent',
    borderRadius: 100,
    width: screenWidth * 0.28,
    height: screenWidth * 0.28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagline: {
    marginTop: 30,
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  pokeballContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    position: 'absolute',
    top: '52%',
    left: '50%',
    transform: [{ translateX: -screenWidth * 0.141 }, { translateY: -screenWidth * 0.13 }],
    opacity: 0,
  },
});
