// ─────────────────────────────────────────────────────────────────────────────
// WeightSynth — App.js
// Calculadora de massa industrial para objetos cilíndricos, blocos e tubos
// React Native + Expo | Play Store + App Store
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import CalcScreen   from "./src/screens/CalcScreen";
import CustomScreen from "./src/screens/CustomScreen";
import RadiusScreen from "./src/screens/RadiusScreen";
import { safeGet, safeSet, checkStorageHealth } from "./src/utils/storage";

const STORAGE_KEY = "@weightsynth_custom_slots";

const TABS = [
  { id: "calc",   label: "⚖",  title: "Calcular"    },
  { id: "radius", label: "◎",  title: "Raio"         },
  { id: "custom", label: "✦",  title: "Materiais"    },
];

export default function App() {
  const [tab, setTab] = useState("calc");
  const [customSlots, setCustomSlots] = useState([null, null, null, null]);
  const [storageOk, setStorageOk] = useState(true);

  // ── Carregar slots e verificar saúde do storage ────────────────────────────
  useEffect(() => {
    (async () => {
      const healthy = await checkStorageHealth();
      setStorageOk(healthy);
      if (!healthy) {
        console.warn("[WeightSynth] AsyncStorage com problema — materiais personalizados não serão salvos.");
        return;
      }
      const saved = await safeGet(STORAGE_KEY);
      if (saved && Array.isArray(saved)) setCustomSlots(saved);
    })();
  }, []);

  const persistSlots = async (next) => {
    const ok = await safeSet(STORAGE_KEY, next);
    if (!ok) {
      console.warn("[WeightSynth] Falha ao salvar materiais personalizados.");
    }
  };

  const handleSave = (idx, material) => {
    const next = [...customSlots];
    next[idx] = material;
    setCustomSlots(next);
    persistSlots(next);
  };

  const handleClear = (idx) => {
    const next = [...customSlots];
    next[idx] = null;
    setCustomSlots(next);
    persistSlots(next);
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <Text style={s.logo}>
          Weight<Text style={s.logoAccent}>Synth</Text>
        </Text>
        <Text style={s.tagline}>calculadora de massa industrial</Text>
      </View>

      {/* ── TABS ──────────────────────────────────────────────────────────── */}
      <View style={s.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[s.tab, tab === t.id && s.tabActive]}
            onPress={() => setTab(t.id)}>
            <Text style={[s.tabIcon, tab === t.id && s.tabIconActive]}>
              {t.label}
            </Text>
            <Text style={[s.tabTxt, tab === t.id && s.tabTxtActive]}>
              {t.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── CONTEÚDO ──────────────────────────────────────────────────────── */}
      <View style={s.content}>
        {tab === "calc" && (
          <CalcScreen customSlots={customSlots} />
        )}
        {tab === "radius" && (
          <RadiusScreen />
        )}
        {tab === "custom" && (
          <CustomScreen
            slots={customSlots}
            onSave={handleSave}
            onClear={handleClear}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 16 : 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  logo: { fontSize: 22, fontWeight: "500", letterSpacing: -0.5, color: "#111827" },
  logoAccent: { color: "#6366f1" },
  tagline: { fontSize: 11, color: "#9ca3af", marginTop: 2 },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#6366f1" },
  tabIcon: { fontSize: 16, color: "#9ca3af", marginBottom: 1 },
  tabIconActive: { color: "#6366f1" },
  tabTxt: { fontSize: 10, fontWeight: "500", color: "#9ca3af" },
  tabTxtActive: { color: "#6366f1", fontWeight: "600" },
  content: { flex: 1 },
});
