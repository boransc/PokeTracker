# PokeTracker

Track which Gen-1 Pokémon you’ve **seen** and **caught**, browse rich details, and manage your own entries — all locally — with a lightweight React Native / Expo app.

> Built for a university assignment: local-only data (no external APIs), clear modular structure, and a focus on UX polish and code quality.

---

## ✨ Features

- **Gen-1 (Kanto) dataset, local only** – ships with a structured list in `KantoPokemon.js` (no network calls).  
- **Tracker workflow** – mark Pokémon as *seen* / *caught*, toggle *favourite*, and add notes.  
- **Search & filter** – find Pokémon by name or type; quick filters for favourites and caught.  
- **Detail view** – dedicated screen with Overview / Stats / Evolution style layout (local data powered).  
- **Onboarding + Help** – `WelcomeScreen`, tutorial walkthrough, and concise Help screen.  
- **Settings** – theme toggles and simple app preferences.  
- **Persistent locally** – state saved on-device (e.g., via AsyncStorage) so your list survives restarts.  
- **Modular React Navigation** – simple, readable file and screen organization.  

---

## 🧱 Project Structure

```
PokeTracker/
├─ assets/                     # images / icons
├─ App.js                      # app entry; navigation, theming, layout shell
├─ Theme.js                    # theme tokens / styles
├─ WelcomeScreen.js            # first-run welcome + CTA
├─ TutorialScreen.js           # onboarding walkthrough
├─ HelpScreen.js               # quick usage guide
├─ SettingsScreen.js           # preferences (e.g., theme)
├─ PokeList.js                 # searchable + filterable list
├─ PokemonCard.js              # compact card UI per Pokémon
├─ PokemonDetailScreen.js      # Overview / Stats / Evolution layout
├─ PokeForm.js                 # add/edit custom Pokémon entries / notes
├─ KantoPokemon.js             # local Gen-1 dataset (no API)
├─ index.js
├─ app.json
└─ package.json
```

---

## 🛠️ Tech Stack

- **React Native** with **Expo**  
- **React Navigation**  
- **AsyncStorage** (or similar) for local persistence  
- **Pure JS data** (`KantoPokemon.js`) for Pokémon entries, stats, and evolutions  

---

## 🚀 Getting Started

You can run with **Expo Go** (fastest) or **native emulators**.

### 1. Clone the repo
```bash
git clone https://github.com/boransc/PokeTracker.git
cd PokeTracker
```

### 2. Install dependencies
```bash
npm install
# or
yarn
```

### 3. Start the app
```bash
npx expo start
```

- **On device:** install **Expo Go** (iOS/Android), then scan the QR from your terminal/browser.  
- **Emulators:** press **a** (Android) or **i** (iOS) in the Expo dev server to run on an emulator/simulator.  

---

## 🗂️ Data Model Example

`KantoPokemon.js` exports a local array of Pokémon objects:

```js
{
  id: 1,
  name: "Bulbasaur",
  types: ["grass", "poison"],
  image: "assets/kanto/001-bulbasaur.png",
  description: "A strange seed was planted on its back at birth...",
  stats: {
    hp: 45,
    attack: 49,
    defense: 49,
    spAttack: 65,
    spDefense: 65,
    speed: 45
  },
  evolution: {
    stage: 1,
    evolvesTo: { id: 2, name: "Ivysaur" },
    evolvesFrom: null
  }
}
```

---

## 📱 Core Screens

- **Welcome / Tutorial** – introduce the app and how to track Pokémon quickly.  
- **List** – search by name, filter by type/favourites/caught; tap a card for details.  
- **Detail** – Overview (flavour + type), Stats (base stats), Evolution (static chain).  
- **Form** – add/edit notes or custom entries.  
- **Settings** – theme, reset options, and at-a-glance info.  
- **Help** – usage tips and navigation guidance.  

---

## 💾 Persistence

The tracker state (seen/caught/favourite, notes, and any custom entries) is saved locally on the device using lightweight storage (`AsyncStorage`). This keeps the app fully offline and compliant with the assignment constraints.

---

## 🧪 Suggested Testing

- **Unit**: helper and filter functions.  
- **Interaction**: toggle seen/caught/favourite, search edge cases.  
- **Navigation**: list → detail → back → settings.  
- **Persistence**: data survives reload; reset clears correctly.  

---

## 📸 Screenshots

Add your screenshots to `assets/` and link them here:

| List | Detail | Tutorial | Settings |
|------|--------|----------|----------|
| ![List](assets/screens/list.png) | ![Detail](assets/screens/detail.png) | ![Tutorial](assets/screens/tutorial.png) | ![Settings](assets/screens/settings.png) |

*(Replace with actual paths or remove if not needed.)*  

---

## 🗺️ Roadmap

- [ ] Type-chip filters and multi-select  
- [ ] Basic stat charts on Detail screen  
- [ ] Import/Export local data (JSON)  
- [ ] Dark mode polish + system theme sync  
- [ ] Accessibility improvements (TalkBack/VoiceOver, large text)  

---

## 📖 Assignment Context

- No external APIs — **all data is local**.  
- Clear, modular structure for walkthrough and reflection.  
- Final deliverable includes app, narrated video reflection, and code analysis.  

---

## 📜 License

All Rights Reserved © 2025  
This code is part of a university assignment and may not be copied, modified, or distributed without explicit permission.
