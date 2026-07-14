// ─────────────────────────────────────────────────────────────────────────────
// RadiusScreen.js — Cálculo de circunferência interna
// WeightSynth v1.2.071326-BETA
//
// Fluxo:
//   1. Usuário mede circunferência EXTERNA com fita métrica (mm)
//   2. Usuário mede espessura da parede com paquímetro (mm, aceita vírgula)
//   3. App calcula: C_int = π × (C_ext/π − 2×esp)
//      e exibe também: ∅e, ∅i, Re, Ri
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { parseSecure, LIMITS, ERRORS } from "../utils/validation";

const PI = Math.PI;
const fmt2 = (v) => v.toFixed(2);
const fmt4 = (v) => v.toFixed(4);

// Aceita tanto vírgula quanto ponto como separador decimal
function parseInput(str) {
  if (!str) return null;
  const normalized = str.replace(",", ".");
  const v = parseFloat(normalized);
  return isNaN(v) ? null : v;
}

// ── Diagrama por Views ────────────────────────────────────────────────────────
function TubeDiagram({ step, theme }) {
  const outerR = 64, innerR = 40;
  return (
    <View style={[d.wrap, { backgroundColor: theme.card }]}>
      {/* Vista frontal — seção circular */}
      <View style={d.front}>
        {/* Anel externo */}
        <View style={[d.ring, {
          width: outerR * 2, height: outerR * 2, borderRadius: outerR,
          backgroundColor: theme.accentBg,
          borderWidth: 2, borderColor: theme.accent,
          justifyContent: "center", alignItems: "center",
        }]}>
          {/* Furo interno */}
          <View style={[d.ring, {
            width: innerR * 2, height: innerR * 2, borderRadius: innerR,
            backgroundColor: theme.bg,
            borderWidth: 1.5, borderColor: theme.accent,
          }]} />
        </View>

        {/* Fita métrica — passo 1 */}
        {step >= 1 && (
          <View style={d.annotRow}>
            <View style={[d.annotLine, { backgroundColor: theme.amber, width: 90 }]} />
            <Text style={[d.annotLbl, { color: theme.amber }]}>C ext (fita)</Text>
          </View>
        )}

        {/* Espessura — passo 2 */}
        {step >= 2 && (
          <View style={d.annotRow}>
            <View style={[d.annotLine, {
              backgroundColor: theme.green, width: 24,
              borderStyle: "dashed",
            }]} />
            <Text style={[d.annotLbl, { color: theme.green }]}>esp (paquímetro)</Text>
          </View>
        )}

        {/* Circunferência interna — resultado */}
        {step >= 3 && (
          <View style={d.annotRow}>
            <View style={[d.annotLine, { backgroundColor: theme.red, width: 55 }]} />
            <Text style={[d.annotLbl, { color: theme.red }]}>C int (resultado)</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ── Cartão de passo ───────────────────────────────────────────────────────────
function StepCard({ num, title, desc, color, active, done, theme }) {
  return (
    <View style={[sc.card, {
      backgroundColor: active ? `${color}12` : done ? `${theme.green}10` : theme.card,
      borderColor: active ? color : done ? theme.green : theme.border,
    }]}>
      <View style={[sc.badge, {
        backgroundColor: done ? theme.green : active ? color : theme.textMuted,
      }]}>
        <Text style={sc.badgeTxt}>{done ? "✓" : num}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[sc.title, {
          color: done ? theme.green : active ? color : theme.text,
        }]}>{title}</Text>
        <Text style={[sc.desc, { color: theme.textSub }]}>{desc}</Text>
      </View>
    </View>
  );
}

// ── Chip de resultado ─────────────────────────────────────────────────────────
function ResultChip({ label, value, color, theme, large }) {
  return (
    <View style={[rc.chip, {
      backgroundColor: `${color}12`,
      borderColor: `${color}30`,
      flex: large ? 2 : 1,
    }]}>
      <Text style={[rc.label, { color }]}>{label}</Text>
      <Text style={[rc.value, { color: theme.text, fontSize: large ? 20 : 15 }]}>
        {value}
      </Text>
    </View>
  );
}

// ── TELA PRINCIPAL ────────────────────────────────────────────────────────────
export default function RadiusScreen({ theme, lang }) {
  const [step, setStep]     = useState(0);
  const [cExt, setCExt]     = useState("");
  const [esp, setEsp]       = useState("");
  const [resultado, setRes] = useState(null);

  const handleCExt = (v) => {
    setCExt(v);
    setStep(v.trim() ? 1 : 0);
    setRes(null);
  };

  const handleEsp = (v) => {
    setEsp(v);
    if (v.trim() && cExt.trim()) setStep(2);
    else if (cExt.trim()) setStep(1);
    setRes(null);
  };

  const calcular = () => {
    const c = parseInput(cExt);
    const e = parseInput(esp);

    if (!c || c <= 0) {
      Alert.alert("Atenção", "Informe a circunferência externa medida com a fita.");
      return;
    }
    if (c < 1 || c > 99999) {
      Alert.alert("Atenção", "Circunferência deve estar entre 1 e 99.999 mm.");
      return;
    }
    if (!e || e <= 0) {
      Alert.alert("Atenção", "Informe a espessura da parede medida com o paquímetro.");
      return;
    }
    if (e < 0.01) {
      Alert.alert("Atenção", "Espessura mínima: 0,01 mm.");
      return;
    }

    // Cálculos
    const dExt = c / PI;           // diâmetro externo
    const rExt = dExt / 2;         // raio externo
    const rInt = rExt - e;         // raio interno
    const dInt = rInt * 2;         // diâmetro interno
    const cInt = PI * dInt;        // circunferência interna ← resultado principal

    if (rInt <= 0) {
      Alert.alert("Erro", "A espessura é maior que o raio externo. Verifique os valores.");
      return;
    }

    setRes({ c, e, dExt, rExt, rInt, dInt, cInt });
    setStep(3);
  };

  const reset = () => {
    setStep(0); setCExt(""); setEsp(""); setRes(null);
  };

  return (
    <ScrollView
      style={[s.scroll, { backgroundColor: theme.bg }]}
      contentContainerStyle={s.container}
      keyboardShouldPersistTaps="handled">

      {/* DIAGRAMA */}
      <TubeDiagram step={step} theme={theme} />

      {/* PASSOS */}
      <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[s.cardTitle, { color: theme.text }]}>📋 Como medir</Text>

        <StepCard num={1} color={theme.amber}
          active={step === 0 || step === 1} done={step >= 2} theme={theme}
          title="Medir circunferência externa com fita"
          desc="Envolva a fita ao redor do tubo/cilindro e anote em milímetros." />

        <StepCard num={2} color={theme.green}
          active={step === 2} done={step >= 3} theme={theme}
          title="Medir espessura da parede com paquímetro"
          desc="Apoie o paquímetro na borda da face. Aceita decimais (ex: 3,22 mm)." />

        <StepCard num={3} color={theme.accent}
          active={step === 3} done={false} theme={theme}
          title="Resultado — circunferência interna"
          desc="C_int = π × (C_ext÷π − 2×espessura). Exibido em mm com 4 casas." />
      </View>

      {/* INPUTS */}
      <View style={[s.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[s.cardTitle, { color: theme.text }]}>📐 Inserir medidas</Text>

        {/* Campo 1 — circunferência externa */}
        <View style={s.inpWrap}>
          <Text style={[s.inpLabel, { color: theme.amber }]}>
            PASSO 1 — Circunferência externa (mm)
          </Text>
          <View style={s.inpRow}>
            <TextInput
              style={[s.inp, {
                backgroundColor: theme.inputBg,
                borderColor: cExt ? theme.amber : theme.border,
                color: theme.text,
              }]}
              placeholder="ex: 314.16"
              placeholderTextColor={theme.textMuted}
              keyboardType="decimal-pad"
              value={cExt}
              onChangeText={handleCExt}
            />
            <View style={[s.unit, { backgroundColor: `${theme.amber}18` }]}>
              <Text style={[s.unitTxt, { color: theme.amber }]}>mm</Text>
            </View>
          </View>
          {/* Preview em tempo real */}
          {cExt !== "" && parseInput(cExt) > 0 && (
            <Text style={[s.hint, { color: theme.amber }]}>
              → ∅ externo ≈ {fmt2(parseInput(cExt) / PI)} mm
            </Text>
          )}
        </View>

        {/* Campo 2 — espessura */}
        <View style={s.inpWrap}>
          <Text style={[s.inpLabel, { color: theme.green }]}>
            PASSO 2 — Espessura da parede (mm) — use vírgula ou ponto decimal
          </Text>
          <View style={s.inpRow}>
            <TextInput
              style={[s.inp, {
                backgroundColor: theme.inputBg,
                borderColor: esp ? theme.green : theme.border,
                color: theme.text,
              }]}
              placeholder="ex: 3,22  ou  3.22"
              placeholderTextColor={theme.textMuted}
              keyboardType="decimal-pad"
              value={esp}
              onChangeText={handleEsp}
            />
            <View style={[s.unit, { backgroundColor: `${theme.green}18` }]}>
              <Text style={[s.unitTxt, { color: theme.green }]}>mm</Text>
            </View>
          </View>
          {esp !== "" && parseInput(esp) > 0 && (
            <Text style={[s.hint, { color: theme.green }]}>
              → Espessura: {fmt2(parseInput(esp))} mm confirmada
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[s.calcBtn, { backgroundColor: theme.accent }]}
          onPress={calcular}>
          <Text style={s.calcBtnTxt}>⚙  Calcular circunferência interna</Text>
        </TouchableOpacity>
      </View>

      {/* RESULTADO */}
      {resultado && (
        <LinearGradient
          colors={[`${theme.accent}10`, `${theme.accent}05`]}
          style={[s.card, { borderColor: `${theme.accent}30` }]}>

          <Text style={[s.cardTitle, { color: theme.accent }]}>
            ✦ Resultado
          </Text>

          {/* RESULTADO PRINCIPAL — C interna */}
          <View style={[s.mainResult, {
            backgroundColor: theme.accentBg,
            borderColor: theme.accentBorder,
          }]}>
            <Text style={[s.mainLabel, { color: theme.accent }]}>
              CIRCUNFERÊNCIA INTERNA
            </Text>
            <Text style={[s.mainValue, { color: theme.text }]}>
              {fmt4(resultado.cInt)}
              <Text style={[s.mainUnit, { color: theme.textSub }]}> mm</Text>
            </Text>
            <Text style={[s.mainPi, { color: theme.textMuted }]}>
              = π × {fmt4(resultado.dInt)} mm
            </Text>
          </View>

          {/* Chips secundários */}
          <View style={s.chipRow}>
            <ResultChip label="C externa" value={`${fmt4(resultado.c)} mm`}
              color={theme.amber} theme={theme} />
            <ResultChip label="Espessura" value={`${fmt2(resultado.e)} mm`}
              color={theme.green} theme={theme} />
          </View>
          <View style={s.chipRow}>
            <ResultChip label="∅ Externo" value={`${fmt2(resultado.dExt)} mm`}
              color={theme.accent} theme={theme} />
            <ResultChip label="∅ Interno" value={`${fmt2(resultado.dInt)} mm`}
              color={theme.accent} theme={theme} />
          </View>
          <View style={s.chipRow}>
            <ResultChip label="Raio Ext (Re)" value={`${fmt2(resultado.rExt)} mm`}
              color={theme.red} theme={theme} />
            <ResultChip label="Raio Int (Ri)" value={`${fmt2(resultado.rInt)} mm`}
              color={theme.red} theme={theme} />
          </View>

          {/* Fórmulas */}
          <View style={[s.formula, {
            backgroundColor: theme.bg, borderColor: theme.border,
          }]}>
            <Text style={[s.formulaTitle, { color: theme.text }]}>
              📐 Cálculo passo a passo:
            </Text>
            <Text style={[s.formulaLine, { color: theme.textSub }]}>
              ∅e = C_ext ÷ π = {fmt4(resultado.c)} ÷ π ={" "}
              <Text style={{ fontWeight:"700", color: theme.text }}>
                {fmt4(resultado.dExt)} mm
              </Text>
            </Text>
            <Text style={[s.formulaLine, { color: theme.textSub }]}>
              ∅i = ∅e − 2×esp = {fmt2(resultado.dExt)} − 2×{fmt2(resultado.e)} ={" "}
              <Text style={{ fontWeight:"700", color: theme.text }}>
                {fmt4(resultado.dInt)} mm
              </Text>
            </Text>
            <Text style={[s.formulaLine, { color: theme.textSub }]}>
              C_int = π × ∅i = π × {fmt4(resultado.dInt)} ={" "}
              <Text style={{ fontWeight:"700", color: theme.accent }}>
                {fmt4(resultado.cInt)} mm
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            style={[s.resetBtn, {
              backgroundColor: theme.card, borderColor: theme.border,
            }]}
            onPress={reset}>
            <Text style={[s.resetTxt, { color: theme.textSub }]}>
              ↩  Novo cálculo
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      )}

      {/* DICA */}
      <View style={[s.tip, { backgroundColor: "#fffbeb", borderColor: "#fde68a" }]}>
        <Text style={s.tipTitle}>💡 Dica de campo</Text>
        <Text style={s.tipTxt}>
          Sem fita métrica? Use um barbante, envolva o tubo, marque o ponto
          de volta e meça com uma régua — isso dá a circunferência.{"\n\n"}
          O paquímetro aceita casas decimais (ex: 3,22 mm). Use o cursor
          de profundidade para medir a espessura da parede na face do tubo.
        </Text>
      </View>

    </ScrollView>
  );
}

// ── Estilos do diagrama ───────────────────────────────────────────────────────
const d = StyleSheet.create({
  wrap:      { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 14 },
  front:     { alignItems: "center" },
  ring:      { justifyContent: "center", alignItems: "center" },
  annotRow:  { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  annotLine: { height: 2.5, borderRadius: 2 },
  annotLbl:  { fontSize: 11, fontWeight: "600" },
});

const sc = StyleSheet.create({
  card:  { flexDirection:"row", gap:10, padding:12, borderRadius:10,
           marginBottom:8, borderWidth:1.5 },
  badge: { width:26, height:26, borderRadius:13, justifyContent:"center",
           alignItems:"center", flexShrink:0 },
  badgeTxt: { color:"#fff", fontSize:12, fontWeight:"700" },
  title: { fontSize:12, fontWeight:"600", marginBottom:2 },
  desc:  { fontSize:11, lineHeight:16 },
});

const rc = StyleSheet.create({
  chip:  { borderRadius:10, borderWidth:1, padding:8, alignItems:"center", margin:3 },
  label: { fontSize:9, fontWeight:"600", letterSpacing:0.5,
           textTransform:"uppercase", marginBottom:2 },
  value: { fontWeight:"600" },
});

const s = StyleSheet.create({
  scroll:   { flex:1 },
  container:{ padding:16, paddingBottom:40 },
  card:     { borderRadius:14, borderWidth:1, padding:14, marginBottom:14 },
  cardTitle:{ fontSize:13, fontWeight:"600", marginBottom:12 },
  inpWrap:  { marginBottom:12 },
  inpLabel: { fontSize:11, fontWeight:"600", marginBottom:4, letterSpacing:0.3 },
  inpRow:   { flexDirection:"row", gap:8 },
  inp:      { flex:1, padding:10, borderWidth:1.5, borderRadius:8, fontSize:14 },
  unit:     { paddingHorizontal:12, borderRadius:8,
              justifyContent:"center", alignItems:"center" },
  unitTxt:  { fontSize:12, fontWeight:"600" },
  hint:     { fontSize:11, marginTop:4, fontWeight:"500" },
  calcBtn:  { borderRadius:10, padding:13, alignItems:"center", marginTop:4 },
  calcBtnTxt:{ color:"#fff", fontSize:14, fontWeight:"600" },
  mainResult:{ borderRadius:12, borderWidth:1.5, padding:14,
               alignItems:"center", marginBottom:10 },
  mainLabel: { fontSize:10, fontWeight:"700", letterSpacing:1,
               textTransform:"uppercase", marginBottom:4 },
  mainValue: { fontSize:28, fontWeight:"600", lineHeight:34 },
  mainUnit:  { fontSize:18 },
  mainPi:    { fontSize:11, marginTop:2 },
  chipRow:   { flexDirection:"row", marginHorizontal:-3, marginBottom:4 },
  formula:   { borderRadius:10, borderWidth:1, padding:12, marginTop:8, marginBottom:12 },
  formulaTitle:{ fontSize:11, fontWeight:"700", marginBottom:6 },
  formulaLine: { fontSize:11, lineHeight:20 },
  resetBtn:  { borderRadius:10, padding:11, alignItems:"center", borderWidth:1 },
  resetTxt:  { fontSize:13, fontWeight:"500" },
  tip:       { borderRadius:12, borderWidth:1, padding:12, marginBottom:8 },
  tipTitle:  { fontSize:12, fontWeight:"700", color:"#92400e", marginBottom:4 },
  tipTxt:    { fontSize:11, color:"#92400e", lineHeight:17 },
});
