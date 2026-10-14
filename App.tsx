import './global.css';
import { GlassView, GlassViewProps } from 'expo-glass-effect';
import { useLayoutEffect, useReducer } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { withUniwind } from 'uniwind';

const UniGlassView = withUniwind(GlassView);

// Mimics what withUniwind does on native: re-renders once from a layout effect right after mount.
const RerenderGlass = (props: any) => {
    const [, bump] = useReducer((x: number) => x + 1, 0);
    useLayoutEffect(() => {
        bump();
    }, []);
    return <GlassView {...props} style={[{ height: 64, borderRadius: 16 }]} />;
};

// Workaround: hide glassEffectStyle from withUniwind's "*Style" prop detection by renaming it.
const UniGlassFixed = withUniwind(({ effect, ...props }: Omit<GlassViewProps, 'glassEffectStyle'> & { effect?: GlassViewProps['glassEffectStyle'] }) => (
    <GlassView glassEffectStyle={effect} {...props} />
));

const stripes = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7'];

export default function App() {
    return (
        <View style={{ flex: 1 }}>
            {/* Busy background so the glass is obvious */}
            <View style={{ position: 'absolute', inset: 0 }}>
                {Array.from({ length: 30 }).map((_, i) => (
                    <View key={i} style={{ height: 40, backgroundColor: stripes[i % stripes.length] }} />
                ))}
            </View>

            <ScrollView contentContainerStyle={{ paddingTop: 80, paddingHorizontal: 16, gap: 24 }}>
                <Label>A. GlassView, style height + borderRadius (works)</Label>
                <GlassView glassEffectStyle="regular" style={{ height: 64, borderRadius: 16 }} />

                <Label>B. withUniwind(GlassView), className "h-16 rounded-2xl"</Label>
                <UniGlassView glassEffectStyle="regular" className="h-16 rounded-2xl" />

                <Label>C. GlassView re-rendered once in useLayoutEffect</Label>
                <RerenderGlass glassEffectStyle="regular" />

                <Label>D. plain GlassView, glassEffectStyle as [undefined, "regular"] (what B receives)</Label>
                <GlassView glassEffectStyle={[undefined, 'regular'] as any} style={{ height: 64, borderRadius: 16 }} />

                <Label>E. withUniwind workaround, prop renamed to "effect"</Label>
                <UniGlassFixed effect="regular" className="h-16 rounded-2xl" />

                <Label>F. withUniwind(GlassView), no glassEffectStyle prop at all</Label>
                <UniGlassView className="h-16 rounded-2xl" />
            </ScrollView>
        </View>
    );
}

const Label = ({ children }: { children: string }) => (
    <Text style={{ color: 'white', fontWeight: '700', backgroundColor: '#000a', padding: 4, marginBottom: -16 }}>{children}</Text>
);
