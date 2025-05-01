//importing files and modules for navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './WelcomeScreen';
import ListScreen from './PokeList';
import FormScreen from './PokeForm';
import DetailScreen from './PokemonDetailScreen';
import SettingsScreen from './SettingsScreen';
import { ThemeProvider } from './Theme';
import HelpScreen from './HelpScreen';
import TutorialScreen from './TutorialScreen';

//creating the Stack constant
const Stack = createStackNavigator();

//creates the functionality to navigate through the screens
export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Tutorial" component={TutorialScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PokeList" component={ListScreen} />
          <Stack.Screen name="PokeForm" component={FormScreen} />
          <Stack.Screen name="PokeDetail" component={DetailScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  ); 
}
