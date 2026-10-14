# uniglass

Minimal repro: `withUniwind(GlassView)` from `expo-glass-effect` renders no glass when `glassEffectStyle` is passed, because Uniwind treats every prop ending in `Style` as a style and passes it as an array.

```bash
npm install
npx expo run:ios
```

Needs an iOS 26+ simulator. See `repro.png` for the result on iOS 27.
