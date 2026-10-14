### What happened?

`withUniwind` treats every prop whose name ends in `Style` as a style prop:

```js
// hoc/withUniwindUtils.js
export const isStyleProperty = (prop) => prop === "style" || prop.endsWith("Style");
```

So a wrapped component receives that prop as `[classStyles, value]` instead of the original value. On `GlassView` from `expo-glass-effect`, `glassEffectStyle` is an enum (`'regular' | 'clear' | 'none'`) or a config object, not a style. With `withUniwind(GlassView)`, `glassEffectStyle="regular"` reaches the native view as `[undefined, "regular"]`, and the glass effect disappears without any error or warning.

```tsx
const UniGlassView = withUniwind(GlassView);

// renders nothing
<UniGlassView glassEffectStyle="regular" className="h-16 rounded-2xl" />

// works
<UniGlassView className="h-16 rounded-2xl" />
```

Passing `[undefined, 'regular']` to a plain, unwrapped `GlassView` reproduces the same blank result, which confirms the array is the cause. This is not the radius issue from #123: per-corner radii (what `rounded-*` compiles to) render fine on the same device. Any other prop that ends in `Style` but isn't a style object will hit the same problem.

**Expected:** only treat a `*Style` prop as a style when a matching `*ClassName` prop is passed (or offer a way to exclude props); otherwise pass the value through unchanged.

**Workarounds:** leave the prop out when its default is fine, or rename it through an inner component:

```tsx
const UniGlassView = withUniwind(({ effect, ...props }) => <GlassView glassEffectStyle={effect} {...props} />);
```

Screenshot from the repro (iOS 27 simulator): bars B and D are blank, A, C, E and F render glass.

![repro](https://raw.githubusercontent.com/denniske/uniglass/master/repro.png)

### Steps to Reproduce

1. `npx create-expo-app` (SDK 57), add `uniwind`, `tailwindcss`, `expo-glass-effect`
2. `const UniGlassView = withUniwind(GlassView)`
3. Render `<UniGlassView glassEffectStyle="regular" className="h-16 rounded-2xl" />` on iOS 26+
4. The view takes up its 64pt height but shows no glass

### Snack or Repository Link

https://github.com/denniske/uniglass

### Uniwind version

1.12.2

### React Native Version

0.86.3

### Platforms

iOS

### Expo

Yes

### Additional information 〰

- [X] I've searched for [similar issues in this repository](https://github.com/uni-stack/uniwind/issues) and found none
