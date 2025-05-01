//settings screen
import React, { useContext, useState, useEffect } from 'react';
import {
  View,Text,Switch,TouchableOpacity,StyleSheet,Alert,} from 'react-native';
import { ThemeContext } from './Theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ navigation }) {
  //sort and darkmode states
  const { darkMode, toggleTheme, colors } = useContext(ThemeContext);
  const [sortMode, setSortMode] = useState('ID_ASC');

  //use effect to load settings from async
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSort = await AsyncStorage.getItem('sortPreference');
        if (savedSort) setSortMode(savedSort);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    loadSettings();
  }, []);

  //changing the sorting preference
  const changeSortMode = async (mode) => {
    try {
      setSortMode(mode);
      await AsyncStorage.setItem('sortPreference', mode);
      Alert.alert('Sort Preference Updated!', `Now sorting by: ${formatSortText(mode)}`);
    } catch (error) {
      console.error('Failed to save sort preference:', error);
    }
  };

  //the names of the sorting preferences
  const formatSortText = (mode) => {
    switch (mode) {
      case 'NAME_ASC': return 'Name (A-Z)';
      case 'NAME_DESC': return 'Name (Z-A)';
      case 'ID_ASC': return 'ID (Ascending)';
      case 'ID_DESC': return 'ID (Descending)';
      case 'FAVORITE_FIRST': return 'Favorites First';
      default: return 'Unknown';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/*Back Button*/}
      <View style={{position: 'absolute', top: 58, left: 20, zIndex: 10}}>
        <TouchableOpacity onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('PokeList');
          }
        }}>
          <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.header, { color: colors.text }]}>⚙️ Settings</Text>

      {/*Dark Mode*/}
      <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
        <Text style={[styles.settingText, { color: colors.text }]}>🌙 Dark Mode</Text>
        <Switch value={darkMode} onValueChange={toggleTheme} />
      </View>

      {/*Sort Preference*/}
      <View style={[styles.settingItem, { flexDirection: 'column', alignItems: 'flex-start', backgroundColor: colors.card }]}>
        <Text style={[styles.settingText, { color: colors.text }]}>🔁 Default Sort Preference:</Text>

        <TouchableOpacity onPress={() => changeSortMode('ID_ASC')}>
          <Text style={sortMode === 'ID_ASC' ? styles.activeOption : styles.optionText}>
            ID Ascending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changeSortMode('ID_DESC')}>
          <Text style={sortMode === 'ID_DESC' ? styles.activeOption : styles.optionText}>
            ID Descending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changeSortMode('NAME_ASC')}>
          <Text style={sortMode === 'NAME_ASC' ? styles.activeOption : styles.optionText}>
            Name A → Z
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changeSortMode('NAME_DESC')}>
          <Text style={sortMode === 'NAME_DESC' ? styles.activeOption : styles.optionText}>
            Name Z → A
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => changeSortMode('FAVORITE_FIRST')}>
          <Text style={sortMode === 'FAVORITE_FIRST' ? styles.activeOption : styles.optionText}>
            Favorites First
          </Text>
        </TouchableOpacity>
      </View>

      {/*About Section*/}
      <View style={[styles.aboutContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.aboutTitle, { color: colors.text }]}>📚 About PokeTracker</Text>
        <Text style={[styles.aboutText, { color: colors.text }]}>Version: 1.0</Text>
        <Text style={[styles.aboutText, { color: colors.text }]}>Developed by Boran Sac</Text>
        <Text style={[styles.aboutText, { color: colors.text }]}>University of Hertfordshire</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Help')}>
  <Text style={[styles.linkText, { color: colors.primary }]}>❓ Help & FAQs</Text>
</TouchableOpacity>
    </View>
  );
}

//stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50
  },
  backText: {
    fontSize: 18
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  settingItem: {
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    width: '100%'
  },
  settingText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  optionText: {
    fontSize: 16,
    marginTop: 10,
    color: '#555'
  },
  activeOption: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#007bff'
  },
  aboutContainer: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  aboutText: {
    fontSize: 16,
    marginBottom: 5
  },
  linkText: {
  fontSize: 18,
  fontWeight: 'bold',
  marginTop: 20,
  textAlign: 'center'
}
});
