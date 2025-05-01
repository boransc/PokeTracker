//help text for different parts of the app like welcome, list, detail etc.
import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from './Theme'; // getting the theme colors from context

export default function HelpScreen({ navigation }) {
  const { colors } = useContext(ThemeContext); // so the screen looks normal in dark/light mode

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/*this button lets you go back to the screen you came from*/}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={[styles.backText, { color: colors.primary }]}> Back</Text>
      </TouchableOpacity>

      {/*big title at the top*/}
      <Text style={[styles.title, { color: colors.text }]}>📚 Help & FAQs</Text>

      {/*all the help content scrolls down in case it overflows*/}
      <ScrollView contentContainerStyle={styles.contentContainer}>

        {/*section for the welcome screen info*/}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🎉 Welcome Screen</Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            Tap the Pokéball to start your adventure and explore your Pokémon list!
          </Text>
        </View>

        {/*info about the pokémon list screen*/}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📋 Pokémon List</Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            Browse all your Pokémon. You can search, sort, filter by type, or mark favorites!
          </Text>
        </View>

        {/*how to add new pokémon*/}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>➕ Add Pokémon</Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            Add a new Pokémon by selecting its name, location, and when you saw it. Optionally mark it caught!
          </Text>
        </View>

        {/*pokémon detail screen explanation*/}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📖 Pokémon Details</Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            View detailed stats, descriptions, evolution paths, and more about your Pokémon.
          </Text>
        </View>

        {/*settings stuff*/}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>⚙️ Settings</Text>
          <Text style={[styles.sectionText, { color: colors.text }]}>
            Customize your app experience. Toggle Dark Mode, set default sorting, and access this Help section.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 22,
  },
});
