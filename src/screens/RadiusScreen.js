// ─────────────────────────────────────────────────────────────────────────────
// RadiusScreen — calcula raio interno e externo de um tubo
// a partir da circunferência externa (fita métrica) e espessura (paquímetro)
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { parseSecure, LIMITS, ERRORS } from "../utils/validation";

const PI = Math.PI;

const C = {
  accent: "#6366f1",
  green:  "#10b981",
  amber:  "#f59e0b",
  red:    "#ef4444",
  border: "#e2e8f0",
  muted:  "#94a3b8",
  text:   "#1e293b",
  sub:    "#64748b",
  bg:     "#f8fafc",
};

const fmt = (v) => v.toFixed(2);

// ── Diagrama do tubo desenhado com Views ─────────────────────────────────────
function TubeDiagram({ step }) {
  const outerR = 70, innerR = 44, h = 8;

  return (
    <View style={d.diagramWrap}>

      {/* Vista frontal do tubo (seção circular) */}
      <View style={d.frontView}>

        {/* Anel externo */}
        <View style={[d.circle, {
          width: outerR * 2, height: outerR * 2, borderRadius: outerR,
          backgroundColor: "#c7d2fe", borderWidth: 2, borderColor: C.accent,
          justifyContent: "center", alignItems: "center",
        }]}>
          {/* Furo interno */}
          <View style={[d.circle, {
            width: innerR * 2, height: innerR * 2, borderRadius: innerR,
            backgroundColor: "#6366f1", opacity: 0.25,
            borderWidth: 1.5, borderColor: C.accent,
          }]} />
        </View>

        {/* Seta fita métrica — aparece no passo 1 */}
        {step >= 1 && (
          <View style={d.tapeRow}>
            <View style={[d.tapeLine, { backgroundColor: C.amber }]} />
            <Text style={[d.tapeLabel, { color: C.amber }]}>
              C ext (fita métrica)
            </Text>
          </View>
        )}

        {/* Seta espessura — aparece no passo 2 */}
        {step >= 2 && (
          <View style={d.espRow}>
            <View style={[d.espLine, { backgroundColor: C.green }]} />
            <Text style={[d.espLabel, { color: C.green }]}>esp (paquímetro)</Text>
          </View>
        )}
      </View>

      {/* Linha lateral com raios — aparece no resultado */}
      {step >= 3 && (
        <View style={d.radiiRow}>
          <View style={d.radiiItem}>
            <View style={[d.radiiLine, { backgroundColor: C.red, width: outerR }]} />
            <Text style={[d.radiiLabel, { color: C.red }]}>Re</Text>
          </View>
          <View style={d.radiiItem}>
            <View style={[d.radiiLine, {
              backgroundColor: C.green, width: innerR,
              borderStyle: "dashed",
            }]} />
            <Text style={[d.radiiLabel, { color: C.green }]}>Ri</Text>
          </View>
        </View>
      )}

      {/* Legenda */}
      <View style={d.legend}>
        {step >= 1 && <View style={d.legendItem}>
          <View style={[d.legendDot, { backgroundColor: C.amber }]} />
          <Text style={d.legendTxt}>Fita métrica → C ext</Text>
        </View>}
        {step >= 2 && <View style={d.legendItem}>
          <View style={[d.legendDot, { backgroundColor: C.green }]} />
          <Text style={d.legendTxt}>Paquímetro → espessura</Text>
        </View>}
        {step >= 3 && <View style={d.legendItem}>
          <View style={[d.legendDot, { backgroundColor: C.red }]} />
          <Text style={d.legendTxt}>Re / Ri calculados</Text>
        </View>}
      </View>
    </View>
  );
}

// ── Cartão de passo ──────────────────────────────────────────────────────────
function StepCard({ num, title, desc, color, active, done }) {
  return (
    <View style={[
      s.stepCard,
      active && { backgroundColor: `${color}10`, borderColor: color },
      done  && { backgroundColor: "#f0fdf4", borderColor: C.green },
    ]}>
      <View style={[s.stepBadge,
        { backgroundColor: done ? C.green : active ? color : C.muted }]}>
        <Text style={s.stepBadgeTxt}>{done ? "✓" : num}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.stepTitle,
          { color: done ? C.green : active ? color : C.text }]}>{title}</Text>
        <Text style={s.stepDesc}>{desc}</Text>
      </View>
    </View>
  );
}

// ── Chip de resultado ─────────────────────────────────────────────────────────
function Chip({ label, value, color }) {
  return (
    <View style={[s.chip, { borderColor: `${color}30`, backgroundColor: `${color}10` }]}>
      <Text style={[s.chipLabel, { color }]}>{label}</Text>
      <Text style={s.chipValue}>{value}</Text>
    </View>
  );
}

// ── TELA PRINCIPAL ────────────────────────────────────────────────────────────
export default function RadiusScreen() {
  const [step, setStep]       = useState(0);
  const [cExt, setCExt]       = useState("");
  const [espessura, setEsp]   = useState("");
  const [resultado, setRes]   = useState(null);

  const handleCExt = (v) => {
    setCExt(v);
    setStep(v ? 1 : 0);
    setRes(null);
  };

  const handleEsp = (v) => {
    setEsp(v);
    if (v && cExt) setStep(2);
    else if (cExt) setStep(1);
    setRes(null);
  };

  const calcular = () => {
    const c = parseSecure(cExt);
    const e = parseSecure(espessura);

    if (c === null || c <= 0) {
      Alert.alert("Atenção", "Informe a circunferência externa medida com a fita.");
      return;
    }
    if (c < LIMITS.CIRC_MIN || c > LIMITS.CIRC_MAX) {
      Alert.alert("Atenção", `Circunferência deve estar entre ${LIMITS.CIRC_MIN} e ${LIMITS.CIRC_MAX.toLocaleString()} mm.`);
      return;
    }
    if (e === null || e <= 0) {
      Alert.alert("Atenção", "Informe a espessura da parede medida com o paquímetro.");
      return;
    }
    if (e < LIMITS.THICKNESS_MIN || e > LIMITS.DIM_MAX) {
      Alert.alert("Atenção", `Espessura mínima aceita: ${LIMITS.THICKNESS_MIN} mm.`);
      return;
    }

    const dExt = c / PI;
    const rExt = dExt / 2;
    const rInt = rExt - e;
    const dInt = rInt * 2;
    const cInt = PI * dInt;

    if (rInt <= 0) {
      Alert.alert("Erro", ERRORS.THICKNESS_BIG);
      return;
    }
    if (!isFinite(rExt) || !isFinite(rInt)) {
      Alert.alert("Erro", "Resultado inválido. Verifique os valores informados.");
      return;
    }

    setRes({ dExt, rExt, rInt, dInt, cInt, cOrig: c, eOrig: e });
    setStep(3);
  };

  const reset = () => {
    setStep(0); setCExt(""); setEsp(""); setRes(null);
  };

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}
      keyboardShouldPersistTaps="handled">

      {/* DIAGRAMA */}
      <View style={s.card}>
        <TubeDiagram step={step} />
      </View>

      {/* PASSOS */}
      <View style={s.card}>
        <Text style={s.cardTitle}>📋 Como medir</Text>

        <StepCard num={1} color={C.amber}
          active={step === 0 || step === 1} done={step >= 2}
          title="Medir circunferência externa com fita"
          desc="Envolva a fita metálica ao redor do tubo e anote a medida em milímetros." />

        <StepCard num={2} color={C.green}
          active={step === 2} done={step >= 3}
          title="Medir espessura da parede com paquímetro"
          desc="Apoie o paquímetro na borda da face do tubo e meça a espessura em milímetros." />

        <StepCard num={3} color={C.accent}
          active={step === 3} done={false}
          title="Calcular — o app faz o resto"
          desc="Com C e espessura, calculamos ∅e, Re, Ri, ∅i e a circunferência interna." />
      </View>

      {/* INPUTS */}
      <View style={s.card}>
        <Text style={s.cardTitle}>📐 Inserir medidas</Text>

        {/* Campo circunferência */}
        <View style={s.inpWrap}>
          <Text style={[s.inpLabel, { color: C.amber }]}>
            PASSO 1 — Circunferência externa (mm)
          </Text>
          <View style={s.inpRow}>
            <TextInput
              style={[s.inp, cExt && { borderColor: C.amber }]}
              placeholder="ex: 314.16"
              placeholderTextColor={C.muted}
              keyboardType="numeric"
              value={cExt}
              onChangeText={handleCExt}
            />
            <View style={[s.inpUnit, { backgroundColor: `${C.amber}15` }]}>
              <Text style={[s.inpUnitTxt, { color: C.amber }]}>mm</Text>
            </View>
          </View>
          {cExt !== "" && !isNaN(parseFloat(cExt)) && (
            <Text style={[s.inpHint, { color: C.amber }]}>
              → ∅e ≈ {fmt(parseFloat(cExt) / PI)} mm
              {"  "}|{"  "}
              Re ≈ {fmt(parseFloat(cExt) / PI / 2)} mm
            </Text>
          )}
        </View>

        {/* Campo espessura */}
        <View style={s.inpWrap}>
          <Text style={[s.inpLabel, { color: C.green }]}>
            PASSO 2 — Espessura da parede (mm)
          </Text>
          <View style={s.inpRow}>
            <TextInput
              style={[s.inp, espessura && { borderColor: C.green }]}
              placeholder="ex: 5.0"
              placeholderTextColor={C.muted}
              keyboardType="numeric"
              value={espessura}
              onChangeText={handleEsp}
            />
            <View style={[s.inpUnit, { backgroundColor: `${C.green}15` }]}>
              <Text style={[s.inpUnitTxt, { color: C.green }]}>mm</Text>
            </View>
          </View>
        </View>

        {/* Botão */}
        <TouchableOpacity style={s.calcBtn} onPress={calcular}>
          <Text style={s.calcBtnTxt}>⚙  Calcular raios</Text>
        </TouchableOpacity>
      </View>

      {/* RESULTADO */}
      {resultado && (
        <LinearGradient
          colors={["#6366f108", "#818cf808"]}
          style={[s.card, { borderColor: `${C.accent}30` }]}>

          <Text style={[s.cardTitle, { color: C.accent }]}>✦ Resultado</Text>

          {/* chips principais */}
          <View style={s.chipGrid2}>
            <Chip label="Raio Externo (Re)"
              value={`${fmt(resultado.rExt)} mm`} color={C.red} />
            <Chip label="Raio Interno (Ri)"
              value={`${fmt(resultado.rInt)} mm`} color={C.green} />
          </View>

          <View style={s.chipGrid3}>
            <Chip label="∅ Externo"
              value={`${fmt(resultado.dExt)} mm`} color={C.accent} />
            <Chip label="∅ Interno"
              value={`${fmt(resultado.dInt)} mm`} color={C.accent} />
            <Chip label="C interna"
              value={`${fmt(resultado.cInt)} mm`} color={C.amber} />
          </View>

          {/* fórmulas */}
          <View style={s.formulaBox}>
            <Text style={s.formulaTitle}>📐 Cálculo passo a passo:</Text>
            <Text style={s.formulaLine}>
              ∅e = C ÷ π = {fmt(resultado.cOrig)} ÷ 3.14159
              {" = "}<Text style={s.formulaBold}>{fmt(resultado.dExt)} mm</Text>
            </Text>
            <Text style={s.formulaLine}>
              Re = ∅e ÷ 2 = {fmt(resultado.dExt)} ÷ 2
              {" = "}<Text style={[s.formulaBold, { color: C.red }]}>{fmt(resultado.rExt)} mm</Text>
            </Text>
            <Text style={s.formulaLine}>
              Ri = Re − esp = {fmt(resultado.rExt)} − {fmt(resultado.eOrig)}
              {" = "}<Text style={[s.formulaBold, { color: C.green }]}>{fmt(resultado.rInt)} mm</Text>
            </Text>
            <Text style={s.formulaLine}>
              ∅i = Ri × 2 = {fmt(resultado.rInt)} × 2
              {" = "}<Text style={s.formulaBold}>{fmt(resultado.dInt)} mm</Text>
            </Text>
            <Text style={s.formulaLine}>
              C int = π × ∅i = {fmt(resultado.dInt)} × 3.14159
              {" = "}<Text style={[s.formulaBold, { color: C.amber }]}>{fmt(resultado.cInt)} mm</Text>
            </Text>
          </View>

          <TouchableOpacity style={s.resetBtn} onPress={reset}>
            <Text style={s.resetBtnTxt}>↩  Novo cálculo</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}

      {/* DICA DE CAMPO */}
      <View style={s.tipBox}>
        <Text style={s.tipTitle}>💡 Dica de campo</Text>
        <Text style={s.tipTxt}>
          Sem fita métrica? Use um barbante ou cabo fino para envolver o tubo,
          marque o ponto de volta e meça com uma régua — isso dá a circunferência.
          {"\n\n"}
          Para a espessura, um paquímetro digital de R$30~50 resolve na
          maioria dos casos industriais.
        </Text>
      </View>

    </ScrollView>
  );
}

// ── Estilos do diagrama ───────────────────────────────────────────────────────
const d = StyleSheet.create({
  diagramWrap: { alignItems: "center", paddingVertical: 8 },
  frontView: { alignItems: "center", marginBottom: 12 },
  circle: { justifyContent: "center", alignItems: "center" },
  tapeRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  tapeLine: { height: 3, width: 80, borderRadius: 2 },
  tapeLabel: { fontSize: 11, fontWeight: "600" },
  espRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  espLine: { height: 3, width: 40, borderRadius: 2 },
  espLabel: { fontSize: 11, fontWeight: "600" },
  radiiRow: { flexDirection: "row", gap: 16, marginBottom: 8 },
  radiiItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  radiiLine: { height: 2.5, borderRadius: 2 },
  radiiLabel: { fontSize: 11, fontWeight: "700" },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 2 },
  legendTxt: { fontSize: 10, color: "#64748b" },
});

// ── Estilos gerais ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f8fafc" },
  container: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: "#fff", borderRadius: 16,
    borderWidth: 1, borderColor: "#e2e8f0",
    padding: 14, marginBottom: 14,
  },
  cardTitle: {
    fontSize: 13, fontWeight: "600", color: "#1e293b", marginBottom: 12,
  },
  stepCard: {
    flexDirection: "row", gap: 10, padding: 12,
    borderRadius: 10, marginBottom: 8,
    borderWidth: 1.5, borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  stepBadge: {
    width: 26, height: 26, borderRadius: 13,
    justifyContent: "center", alignItems: "center", flexShrink: 0,
  },
  stepBadgeTxt: { color: "#fff", fontSize: 12, fontWeight: "700" },
  stepTitle: { fontSize: 12, fontWeight: "600", marginBottom: 2 },
  stepDesc: { fontSize: 11, color: "#64748b", lineHeight: 16 },
  inpWrap: { marginBottom: 12 },
  inpLabel: { fontSize: 11, fontWeight: "600", marginBottom: 4, letterSpacing: 0.3 },
  inpRow: { flexDirection: "row", gap: 8 },
  inp: {
    flex: 1, padding: 10, borderWidth: 1.5,
    borderColor: "#e2e8f0", borderRadius: 8,
    fontSize: 14, color: "#1e293b",
  },
  inpUnit: {
    paddingHorizontal: 12, borderRadius: 8,
    justifyContent: "center", alignItems: "center",
  },
  inpUnitTxt: { fontSize: 12, fontWeight: "600" },
  inpHint: { fontSize: 11, marginTop: 4, fontWeight: "500" },
  calcBtn: {
    backgroundColor: "#6366f1", borderRadius: 10,
    padding: 13, alignItems: "center", marginTop: 4,
  },
  calcBtnTxt: { color: "#fff", fontSize: 14, fontWeight: "600" },
  chipGrid2: { flexDirection: "row", gap: 8, marginBottom: 8 },
  chipGrid3: { flexDirection: "row", gap: 6, marginBottom: 12 },
  chip: {
    flex: 1, borderRadius: 10, borderWidth: 1,
    padding: 8, alignItems: "center",
  },
  chipLabel: {
    fontSize: 9, fontWeight: "600", letterSpacing: 0.5,
    textTransform: "uppercase", marginBottom: 2,
  },
  chipValue: { fontSize: 15, fontWeight: "600", color: "#1e293b" },
  formulaBox: {
    backgroundColor: "#f8fafc", borderRadius: 10,
    borderWidth: 1, borderColor: "#e2e8f0",
    padding: 12, marginBottom: 12,
  },
  formulaTitle: { fontSize: 11, fontWeight: "700", color: "#1e293b", marginBottom: 6 },
  formulaLine: { fontSize: 11, color: "#64748b", lineHeight: 20 },
  formulaBold: { fontWeight: "700", color: "#1e293b" },
  resetBtn: {
    backgroundColor: "#f1f5f9", borderRadius: 10,
    padding: 11, alignItems: "center",
    borderWidth: 1, borderColor: "#e2e8f0",
  },
  resetBtnTxt: { color: "#64748b", fontSize: 13, fontWeight: "500" },
  tipBox: {
    backgroundColor: "#fffbeb", borderRadius: 12,
    borderWidth: 1, borderColor: "#fde68a",
    padding: 12, marginBottom: 8,
  },
  tipTitle: { fontSize: 12, fontWeight: "700", color: "#92400e", marginBottom: 4 },
  tipTxt: { fontSize: 11, color: "#92400e", lineHeight: 17 },
});
