// ─────────────────────────────────────────────────────────────────────────────
// WeightSynth — App.js
// v1.2.071326 — Tema claro/escuro, idiomas, tela de configurações
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import CalcScreen    from "./src/screens/CalcScreen";
import CustomScreen  from "./src/screens/CustomScreen";
import RadiusScreen  from "./src/screens/RadiusScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import { safeGet, safeSet, checkStorageHealth } from "./src/utils/storage";
import { getTheme } from "./src/theme/theme";
import { t } from "./src/i18n/i18n";

const STORAGE_KEY       = "@weightsynth_custom_slots";
const STORAGE_THEME     = "@weightsynth_theme";
const STORAGE_LANG      = "@weightsynth_lang";

export default function App() {
  const [tab, setTab]               = useState("calc");
  const [customSlots, setCustomSlots] = useState([null, null, null, null]);
  const [themeId, setThemeId]       = useState("light");
  const [lang, setLang]             = useState("pt");

  const theme = getTheme(themeId);

  // ── Carregar preferências e slots ─────────────────────────
  useEffect(() => {
    (async () => {
      await checkStorageHealth();
      const slots = await safeGet(STORAGE_KEY);
      if (slots && Array.isArray(slots)) setCustomSlots(slots);
      const savedTheme = await safeGet(STORAGE_THEME);
      if (savedTheme) setThemeId(savedTheme);
      const savedLang = await safeGet(STORAGE_LANG);
      if (savedLang) setLang(savedLang);
    })();
  }, []);

  const handleSave = (idx, material) => {
    const next = [...customSlots];
    next[idx] = material;
    setCustomSlots(next);
    safeSet(STORAGE_KEY, next);
  };

  const handleClear = (idx) => {
    const next = [...customSlots];
    next[idx] = null;
    setCustomSlots(next);
    safeSet(STORAGE_KEY, next);
  };

  const handleThemeChange = (id) => {
    setThemeId(id);
    safeSet(STORAGE_THEME, id);
  };

  const handleLangChange = (code) => {
    setLang(code);
    safeSet(STORAGE_LANG, code);
  };

  const TABS = [
    { id: "calc",     icon: "⚖",  label: t(lang, "calc")      },
    { id: "radius",   icon: "◎",  label: t(lang, "radius")    },
    { id: "custom",   icon: "✦",  label: t(lang, "materials") },
    { id: "settings", icon: "⚙",  label: t(lang, "settings")  },
  ];

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: theme.bg }]}>
      <StatusBar style={theme.statusBar} />

      {/* ── HEADER ──────────────────────────────────────── */}
      <View style={[s.header, { backgroundColor: theme.card, borderBottomColor: theme.tabBorder }]}>
        <Text style={[s.logo, { color: theme.text }]}>
          Weight<Text style={{ color: theme.accent }}>Synth</Text>
        </Text>
        <Text style={[s.tagline, { color: theme.textMuted }]}>
          calculadora de massa industrial
        </Text>
      </View>

      {/* ── TABS ────────────────────────────────────────── */}
      <View style={[s.tabs, { backgroundColor: theme.tabBg, borderBottomColor: theme.tabBorder }]}>
        {TABS.map((tb) => (
          <TouchableOpacity
            key={tb.id}
            style={[s.tab, tab === tb.id && { borderBottomColor: theme.accent }]}
            onPress={() => setTab(tb.id)}>
            <Text style={[s.tabIcon, { color: tab === tb.id ? theme.accent : theme.textMuted }]}>
              {tb.icon}
            </Text>
            <Text style={[s.tabTxt, { color: tab === tb.id ? theme.accent : theme.textMuted },
              tab === tb.id && { fontWeight: "700" }]}>
              {tb.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── CONTEÚDO ────────────────────────────────────── */}
      <View style={s.content}>
        {tab === "calc" && (
          <CalcScreen customSlots={customSlots} theme={theme} lang={lang} />
        )}
        {tab === "radius" && (
          <RadiusScreen theme={theme} lang={lang} />
        )}
        {tab === "custom" && (
          <CustomScreen
            slots={customSlots}
            onSave={handleSave}
            onClear={handleClear}
            theme={theme}
            lang={lang}
          />
        )}
        {tab === "settings" && (
          <SettingsScreen
            theme={theme}
            lang={lang}
            onThemeChange={handleThemeChange}
            onLangChange={handleLangChange}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1 },
  header:  {
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 16 : 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  logo:    { fontSize: 22, fontWeight: "600", letterSpacing: -0.5 },
  tagline: { fontSize: 11, marginTop: 2 },
  tabs:    { flexDirection: "row", borderBottomWidth: 1 },
  tab:     {
    flex: 1, paddingVertical: 8, alignItems: "center",
    borderBottomWidth: 2, borderBottomColor: "transparent",
  },
  tabIcon: { fontSize: 15, marginBottom: 1 },
  tabTxt:  { fontSize: 9, fontWeight: "500" },
  content: { flex: 1 },
});
