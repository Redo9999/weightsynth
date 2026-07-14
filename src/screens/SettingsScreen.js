// ─────────────────────────────────────────────────────────────────────────────
// SettingsScreen.js — Tela de configurações
// WeightSynth v1.2.071326
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Linking, Switch,
} from "react-native";
import { LANGUAGES, t } from "../i18n/i18n";

const VERSION = "1.2.071326";

const PATCH_NOTES = [
  {
    version: "1.2.071326",
    date: "07/12/2025",
    changes: [
      "Tema claro e escuro nas configurações",
      "Suporte a 4 idiomas: Português, Inglês, Espanhol e Chinês",
      "Nova tela de Configurações com créditos e patch notes",
      "Sistema de versionamento implementado",
    ],
    planned: [
      "Pixel art reformulada estilo lingote/barra metálica",
      "Histórico de cálculos",
      "Compartilhar resultado por WhatsApp/e-mail",
    ],
  },
  {
    version: "1.0.071225",
    date: "07/12/2025",
    changes: [
      "Lançamento inicial do WeightSynth",
      "Cálculo de massa para cilindros, blocos e tubos",
      "16 materiais com pixel art exclusiva",
      "Cálculo de raio por fita métrica e paquímetro",
      "4 slots de materiais personalizados com editor de pixel art",
      "Persistência de dados com AsyncStorage seguro",
      "Validação de entrada com limites reais de segurança",
      "Política de privacidade — zero coleta de dados",
    ],
    planned: [],
  },
];

// ── Componente de linha de configuração ───────────────────────────────────────
function SettingRow({ label, children, theme, last }) {
  return (
    <View style={[
      styles.row,
      { borderBottomWidth: last ? 0 : 1, borderBottomColor: theme.border },
    ]}>
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      <View style={styles.rowRight}>{children}</View>
    </View>
  );
}

// ── Componente de seção ───────────────────────────────────────────────────────
function Section({ title, children, theme }) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.accent }]}>{title}</Text>
      <View style={[styles.sectionCard, {
        backgroundColor: theme.card,
        borderColor: theme.border,
      }]}>
        {children}
      </View>
    </View>
  );
}

// ── TELA PRINCIPAL ────────────────────────────────────────────────────────────
export default function SettingsScreen({ theme, lang, onThemeChange, onLangChange }) {
  const isDark = theme.id === "dark";

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.bg }]}
      contentContainerStyle={styles.container}>

      {/* ── APARÊNCIA ─────────────────────────────────────── */}
      <Section title={t(lang, "theme")} theme={theme}>
        <SettingRow label={isDark ? t(lang, "themeDark") : t(lang, "themeLight")} theme={theme} last>
          <Switch
            value={isDark}
            onValueChange={(v) => onThemeChange(v ? "dark" : "light")}
            trackColor={{ false: theme.border, true: theme.accent }}
            thumbColor={isDark ? theme.accentBg : "#fff"}
          />
        </SettingRow>
      </Section>

      {/* ── IDIOMA ────────────────────────────────────────── */}
      <Section title={t(lang, "language")} theme={theme}>
        {LANGUAGES.map((l, i) => (
          <SettingRow key={l.code} label={`${l.flag}  ${l.label}`} theme={theme}
            last={i === LANGUAGES.length - 1}>
            <TouchableOpacity
              onPress={() => onLangChange(l.code)}
              style={[
                styles.langBtn,
                {
                  backgroundColor: lang === l.code ? theme.accent : "transparent",
                  borderColor: lang === l.code ? theme.accent : theme.border,
                },
              ]}>
              <Text style={[
                styles.langBtnTxt,
                { color: lang === l.code ? "#fff" : theme.textSub },
              ]}>
                {lang === l.code ? "✓" : "○"}
              </Text>
            </TouchableOpacity>
          </SettingRow>
        ))}
      </Section>

      {/* ── SOBRE ─────────────────────────────────────────── */}
      <Section title={t(lang, "about")} theme={theme}>
        <SettingRow label={t(lang, "version")} theme={theme}>
          <Text style={[styles.valueText, { color: theme.textSub }]}>{VERSION}</Text>
        </SettingRow>
        <SettingRow label={t(lang, "developer")} theme={theme} last>
          <Text style={[styles.valueText, { color: theme.textSub }]}>Wenson C. de Lira</Text>
        </SettingRow>
      </Section>

      {/* ── TEXTO SOBRE ───────────────────────────────────── */}
      <View style={[styles.aboutBox, {
        backgroundColor: theme.accentBg,
        borderColor: theme.accentBorder,
      }]}>
        <Text style={[styles.aboutText, { color: theme.accent }]}>
          {t(lang, "aboutText")}
        </Text>
      </View>

      {/* ── PATCH NOTES ───────────────────────────────────── */}
      <Section title={t(lang, "patchNotes")} theme={theme}>
        {PATCH_NOTES.map((patch, pi) => (
          <View key={patch.version} style={[
            styles.patchBlock,
            {
              borderBottomWidth: pi < PATCH_NOTES.length - 1 ? 1 : 0,
              borderBottomColor: theme.border,
            },
          ]}>
            {/* Header da versão */}
            <View style={styles.patchHeader}>
              <View style={[styles.versionBadge, {
                backgroundColor: pi === 0 ? theme.accent : theme.chipBg,
              }]}>
                <Text style={[styles.versionBadgeTxt, {
                  color: pi === 0 ? "#fff" : theme.textSub,
                }]}>
                  v{patch.version}
                </Text>
              </View>
              <Text style={[styles.patchDate, { color: theme.textMuted }]}>
                {patch.date}
              </Text>
            </View>

            {/* Mudanças */}
            {patch.changes.map((c, i) => (
              <View key={i} style={styles.changeRow}>
                <Text style={[styles.changeDot, { color: theme.green }]}>✓</Text>
                <Text style={[styles.changeTxt, { color: theme.text }]}>{c}</Text>
              </View>
            ))}

            {/* Planejado */}
            {patch.planned.length > 0 && (
              <>
                <Text style={[styles.plannedTitle, { color: theme.amber }]}>
                  🔜 Próxima versão:
                </Text>
                {patch.planned.map((p, i) => (
                  <View key={i} style={styles.changeRow}>
                    <Text style={[styles.changeDot, { color: theme.amber }]}>→</Text>
                    <Text style={[styles.changeTxt, { color: theme.textSub }]}>{p}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        ))}
      </Section>

      {/* ── POLÍTICA DE PRIVACIDADE ────────────────────────── */}
      <TouchableOpacity
        style={[styles.privacyBtn, { borderColor: theme.border }]}
        onPress={() => Linking.openURL("https://redo9999.github.io/weightsynth/privacy-policy.html")}>
        <Text style={[styles.privacyTxt, { color: theme.accent }]}>
          🔒  Política de Privacidade
        </Text>
      </TouchableOpacity>

      <Text style={[styles.footer, { color: theme.textMuted }]}>
        WeightSynth v{VERSION} • © 2025 Wenson C. de Lira{"\n"}
        Todos os direitos reservados
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { padding: 16, paddingBottom: 40 },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 11, fontWeight: "700",
    textTransform: "uppercase", letterSpacing: 1,
    marginBottom: 8, paddingLeft: 4,
  },
  sectionCard: {
    borderRadius: 14, borderWidth: 1, overflow: "hidden",
  },
  row: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14, paddingVertical: 13,
  },
  rowLabel: { fontSize: 14, fontWeight: "500" },
  rowRight: { alignItems: "flex-end" },
  valueText: { fontSize: 13 },
  langBtn: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 1.5, alignItems: "center", justifyContent: "center",
  },
  langBtnTxt: { fontSize: 13, fontWeight: "700" },
  aboutBox: {
    borderRadius: 12, borderWidth: 1,
    padding: 14, marginBottom: 20,
  },
  aboutText: { fontSize: 13, lineHeight: 20 },
  patchBlock: { padding: 14 },
  patchHeader: {
    flexDirection: "row", alignItems: "center",
    gap: 10, marginBottom: 10,
  },
  versionBadge: {
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 99,
  },
  versionBadgeTxt: { fontSize: 11, fontWeight: "700" },
  patchDate: { fontSize: 11 },
  changeRow: {
    flexDirection: "row", gap: 8,
    marginBottom: 4, paddingRight: 8,
  },
  changeDot: { fontSize: 12, fontWeight: "700", marginTop: 1 },
  changeTxt: { fontSize: 12, lineHeight: 18, flex: 1 },
  plannedTitle: {
    fontSize: 11, fontWeight: "700",
    marginTop: 10, marginBottom: 6,
  },
  privacyBtn: {
    borderWidth: 1, borderRadius: 12,
    padding: 14, alignItems: "center",
    marginBottom: 16,
  },
  privacyTxt: { fontSize: 13, fontWeight: "500" },
  footer: {
    textAlign: "center", fontSize: 11, lineHeight: 18,
  },
});
