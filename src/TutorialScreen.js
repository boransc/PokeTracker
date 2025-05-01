import React from 'react';
import { View, Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const imageStyle = {
  width: 300,
  height: 525,
  resizeMode: 'contain',
  marginVertical: 10,
};

export default function TutorialScreen({ navigation }) {
  return (
    <Onboarding
      onSkip={() => navigation.replace('PokeList')}
      onDone={() => navigation.replace('PokeList')}
      pages={[
        //page 1
        {
          backgroundColor: '#fff',
          image: (<Image source={require('./assets/pokeball2.png')}style={{ width: 300, height: 300, marginHorizontal: 10 }}/>),
          title: 'Welcome to PokéTracker!',
          subtitle: 'Track and manage your Pokémon-catching journey!'
        },
        //page 2: PokeList
        {
          backgroundColor: '#fef3bd',
          image: (<Image source={require('./assets/Filled_PokeList.png')} style={imageStyle}/>),
          title: 'Pokédex View',
          subtitle: 'View and scroll through all 151 Kanto Pokémon in your PokeList.'
        },
        //page 3: PokeForm
        {
          backgroundColor: '#ffecd2',
          image: (<Image source={require('./assets/Filled_PokeForm.png')}style={imageStyle}/>),
          title: 'Add Pokémon',
          subtitle: 'This is where you are able to add your seen or caught pokemon to your PokeList and favourite it or expand it for more details in the list view.'
        },
        //page 4: Filter
        {
          backgroundColor: '#e0f7fa',
          image: (<Image source={require('./assets/Pokelist_Filter.png')} style={imageStyle}/>),
          title: 'Filter Pokémon',
          subtitle: 'Narrow down your view by the typing of your choosing.'
        },
        //page 5: Sort
        {
          backgroundColor: '#dcedc8',
          image: (<Image source={require('./assets/Pokelist_Sort.png')} style={imageStyle}  /> ),
          title: 'Sort Pokémon',
          subtitle: 'Sort your list by the Pokemon Name, ID and Favourited Pokemon.'
        },
        //page 6: Details Overview
        {
          backgroundColor: '#ffe6e6',
          image: (<Image source={require('./assets/Pokemon_Overview.png')} style={imageStyle}/>),
          title: 'Pokémon Overview',
          subtitle: 'Tap on a Pokémon for detailed overview info.'
        },
        //page 7: Details Stats
        {
          backgroundColor: '#e6f0ff',
          image: (<Image source={require('./assets/Pokemon_Stats.png')} style={imageStyle}/>),
          title: 'Stats Page',
          subtitle: 'See base stats like HP, Attack, Defense, Special and Speed.'
        },
        //page 8: Details Evolution Chain
        {
          backgroundColor: '#f3e5f5',
          image: (<Image source={require('./assets/Pokemon_Evolution.png')} style={imageStyle}/>),
          title: 'Evolution Info',
          subtitle: 'Learn about the Evolution Chains of each pokemon in your list'
        },
        //page 9: Settings
        {
          backgroundColor: '#fff3e0',
          image: (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Image source={require('./assets/Settings.png')} style={[imageStyle, { width: 225, marginHorizontal: 5 }]}/>
              <Image source={require('./assets/Settings_DarkMode.png')}style={[imageStyle, { width: 225, marginHorizontal: 5 }]}/>
            </View>
          ),
          title: 'Settings',
          subtitle: 'Switch between Light and Dark Mode and Change your Preferences!',
        },
        //page 10: Help Page
        {
          backgroundColor: '#e0f2f1',
          image: (<Image source={require('./assets/HelpPage.png')} style={imageStyle}/>),
          title: 'Need Help?',
          subtitle: 'Check the Help page to understand how to use the app.',
        },
        //page 11: Done
        {
          backgroundColor: '#f1f8e9',
          image: (<Image source={require('./assets/pokeball2.png')} style={imageStyle}/>),
          title: 'You’re All Set!',
          subtitle: 'Let’s begin your journey to catch ‘em all! 🎯',
        },
      ]}
    />
  );
}
