// ─────────────────────────────────────────────────────────────────────────────
// CalcScreen — tela principal de cálculo de massa
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Alert, FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PixelView from "../components/PixelView";
import MeasureGuide from "../components/MeasureGuide";
import { MATERIALS, GRUPOS } from "../data/materials";
import { validateDim, validateMassResult, formatMass, ERRORS } from "../utils/validation";

// ── Campos de entrada por forma ──────────────────────────────────────────────
const SHAPE_GUIDES = {
  cilindro: {
    fields: [
      { id: "d1", label: "⬤  Diâmetro (∅)", placeholder: "ex: 100", hint: "mm" },
      { id: "d2", label: "↔  Comprimento (L)", placeholder: "ex: 1000", hint: "mm" },
    ],
  },
  bloco: {
    fields: [
      { id: "d1", label: "↔  Largura (A)", placeholder: "ex: 100", hint: "mm" },
      { id: "d2", label: "↕  Altura (B)",  placeholder: "ex: 50",  hint: "mm" },
      { id: "d3", label: "↔  Comprimento (L)", placeholder: "ex: 1000", hint: "mm" },
    ],
  },
  tubo: {
    fields: [
      { id: "d1", label: "⬤  Diâm. externo (∅e)", placeholder: "ex: 100", hint: "mm" },
      { id: "d2", label: "◎  Diâm. interno (∅i)", placeholder: "ex: 85",  hint: "mm" },
      { id: "d3", label: "↔  Comprimento (L)",    placeholder: "ex: 1000", hint: "mm" },
    ],
  },
};

const SHAPES = [
  { id: "cilindro", label: "⬤ Cilindro" },
  { id: "bloco",    label: "▬ Bloco" },
  { id: "tubo",     label: "◎ Tubo" },
];

export default function CalcScreen({ customSlots }) {
  const [shape, setShape] = useState("cilindro");
  const [matSel, setMatSel] = useState("aco");
  const [dims, setDims] = useState({ d1: "", d2: "", d3: "" });
  const [resultado, setResultado] = useState(null);

  const allMats = [...MATERIALS, ...customSlots.filter(Boolean)];
  const matAtual = allMats.find((m) => m.id === matSel) || MATERIALS[0];
  const guide = SHAPE_GUIDES[shape];

  const calcular = () => {
    const den = matAtual.den;
    let volume = 0, descDim = "";

    try {
      if (shape === "cilindro") {
        const vd = validateDim(dims.d1, "Diâmetro");
        const vl = validateDim(dims.d2, "Comprimento");
        if (!vd.ok) throw vd.error;
        if (!vl.ok) throw vl.error;
        const { value: d } = vd, { value: l } = vl;
        volume = Math.PI * Math.pow((d / 2) / 1000, 2) * (l / 1000);
        descDim = `∅${d} × ${l} mm`;

      } else if (shape === "bloco") {
        const va = validateDim(dims.d1, "Largura");
        const vb = validateDim(dims.d2, "Altura");
        const vl = validateDim(dims.d3, "Comprimento");
        if (!va.ok) throw va.error;
        if (!vb.ok) throw vb.error;
        if (!vl.ok) throw vl.error;
        const { value: a } = va, { value: b } = vb, { value: l } = vl;
        volume = (a / 1000) * (b / 1000) * (l / 1000);
        descDim = `${a}×${b}×${l} mm`;

      } else {
        const vde = validateDim(dims.d1, "Diâmetro externo");
        const vdi = validateDim(dims.d2, "Diâmetro interno");
        const vl  = validateDim(dims.d3, "Comprimento");
        if (!vde.ok) throw vde.error;
        if (!vdi.ok) throw vdi.error;
        if (!vl.ok)  throw vl.error;
        const { value: de } = vde, { value: di } = vdi, { value: l } = vl;
        if (di >= de) throw ERRORS.INNER_GTE_OUTER;
        volume = Math.PI *
          (Math.pow((de / 2) / 1000, 2) - Math.pow((di / 2) / 1000, 2)) *
          (l / 1000);
        descDim = `∅e${de} / ∅i${di} × ${l} mm`;
      }
    } catch (e) {
      Alert.alert("Atenção", typeof e === "string" ? e : ERRORS.FIELD_EMPTY);
      return;
    }

    const massa = den * volume;
    const massCheck = validateMassResult(massa);
    if (!massCheck.ok) {
      Alert.alert("Atenção", massCheck.error);
      return;
    }

    const { str: massaStr, unit: unid } = formatMass(massa);
    setResultado({
      massaStr, unid, descDim,
      vol: (volume * 1e6).toFixed(2),
      grama: (massa * 1000).toFixed(1),
      mat: matAtual,
    });
  };

  const handleShapeChange = (s) => {
    setShape(s);
    setDims({ d1: "", d2: "", d3: "" });
    setResultado(null);
  };

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}
      keyboardShouldPersistTaps="handled">

      {/* SHAPES */}
      <View style={s.pillRow}>
        {SHAPES.map((sh) => (
          <TouchableOpacity key={sh.id}
            style={[s.pill, shape === sh.id && s.pillActive]}
            onPress={() => handleShapeChange(sh.id)}>
            <Text style={[s.pillTxt, shape === sh.id && s.pillTxtActive]}>
              {sh.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* MATERIAIS */}
      <Text style={s.secLabel}>material</Text>
      {GRUPOS.map(({ id: grp, label }) => {
        const itens = MATERIALS.filter((m) => m.grp === grp);
        return (
          <View key={grp}>
            <Text style={s.grpLabel}>{label}</Text>
            <View style={s.matGrid}>
              {itens.map((m) => (
                <TouchableOpacity key={m.id}
                  style={[s.matCard, matSel === m.id && s.matCardSel]}
                  onPress={() => setMatSel(m.id)}>
                  <PixelView px={m.px} pal={m.pal} size={6} />
                  <Text style={s.matName}>{m.nome}</Text>
                  <Text style={s.matDen}>{m.den.toLocaleString()} kg/m³</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}

      {/* Materiais customizados */}
      {customSlots.filter(Boolean).length > 0 && (
        <>
          <Text style={s.grpLabel}>✦ Personalizados</Text>
          <View style={s.matGrid}>
            {customSlots.filter(Boolean).map((m) => (
              <TouchableOpacity key={m.id}
                style={[s.matCard, matSel === m.id && s.matCardSel]}
                onPress={() => setMatSel(m.id)}>
                <PixelView grid={m.grid} size={6} />
                <Text style={s.matName}>{m.nome}</Text>
                <Text style={s.matDen}>{m.den.toLocaleString()} kg/m³</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* GUIA DE MEDIÇÃO VISUAL */}
      <MeasureGuide shape={shape} />

      {/* INPUTS */}
      <Text style={s.secLabel}>dimensões (mm)</Text>
      <View style={guide.fields.length === 2 ? s.inpGrid2 : s.inpGrid3}>
        {guide.fields.map((f) => (
          <View key={f.id} style={s.inpWrap}>
            <Text style={s.inpLabel}>{f.label}</Text>
            <TextInput
              style={s.inp}
              placeholder={f.placeholder}
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              value={dims[f.id]}
              onChangeText={(v) => setDims({ ...dims, [f.id]: v })}
            />
            <Text style={s.inpSuf}>{f.hint}</Text>
          </View>
        ))}
      </View>

      {/* BOTÃO */}
      <TouchableOpacity style={s.calcBtn} onPress={calcular}>
        <Text style={s.calcBtnTxt}>⚖  Calcular massa</Text>
      </TouchableOpacity>

      {/* RESULTADO */}
      {resultado && (
        <LinearGradient
          colors={["#6366f115", "#818cf815"]}
          style={s.result}>
          <View style={s.resultIcon}>
            {resultado.mat.grid
              ? <PixelView grid={resultado.mat.grid} size={7} />
              : <PixelView px={resultado.mat.px} pal={resultado.mat.pal} size={7} />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.resultLbl}>MASSA ESTIMADA</Text>
            <Text style={s.resultNum}>
              {resultado.massaStr}
              <Text style={s.resultUnit}> {resultado.unid}</Text>
            </Text>
            <Text style={s.resultDesc}>
              {resultado.mat.nome} · {resultado.descDim}
            </Text>
            <View style={s.chips}>
              <View style={s.chip}><Text style={s.chipTxt}>ρ = {resultado.mat.den.toLocaleString()} kg/m³</Text></View>
              <View style={s.chip}><Text style={s.chipTxt}>V = {resultado.vol} cm³</Text></View>
              <View style={s.chip}><Text style={s.chipTxt}>{resultado.grama} g</Text></View>
            </View>
          </View>
        </LinearGradient>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 16, paddingBottom: 40 },
  pillRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 16 },
  pill: {
    paddingVertical: 7, paddingHorizontal: 16, borderRadius: 999,
    backgroundColor: "#f3f4f6", borderWidth: 1.5, borderColor: "#d1d5db",
  },
  pillActive: { backgroundColor: "#6366f1", borderColor: "#6366f1" },
  pillTxt: { fontSize: 13, fontWeight: "500", color: "#374151" },
  pillTxtActive: { color: "#fff" },
  secLabel: {
    fontSize: 11, fontWeight: "600", color: "#9ca3af",
    letterSpacing: 1, textTransform: "uppercase", marginBottom: 8,
  },
  grpLabel: {
    fontSize: 10, fontWeight: "600", color: "#9ca3af",
    textTransform: "uppercase", letterSpacing: 1,
    marginTop: 8, marginBottom: 6,
  },
  matGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  matCard: {
    width: "22%", borderRadius: 10, padding: 6, alignItems: "center",
    backgroundColor: "#f9fafb", borderWidth: 1.5, borderColor: "#e5e7eb",
  },
  matCardSel: { borderColor: "#6366f1", backgroundColor: "#eef2ff" },
  matName: { fontSize: 9, color: "#374151", marginTop: 4, textAlign: "center" },
  matDen: { fontSize: 8, color: "#9ca3af", marginTop: 1 },
  guide: {
    borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12,
    backgroundColor: "#f9fafb", padding: 12, marginVertical: 14,
  },
  guideTitle: { fontSize: 13, fontWeight: "500", color: "#111827", marginBottom: 6 },
  guideRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  guideDot: { width: 8, height: 8, borderRadius: 2 },
  guideTxt: { fontSize: 12, color: "#374151" },
  inpGrid2: { flexDirection: "row", gap: 10, marginBottom: 8 },
  inpGrid3: { flexDirection: "row", gap: 8, marginBottom: 8 },
  inpWrap: { flex: 1 },
  inpLabel: { fontSize: 11, color: "#6b7280", fontWeight: "500", marginBottom: 4 },
  inp: {
    borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8,
    padding: 10, fontSize: 14, backgroundColor: "#fff", color: "#111827",
  },
  inpSuf: { fontSize: 9, color: "#9ca3af", marginTop: 2 },
  calcBtn: {
    backgroundColor: "#6366f1", borderRadius: 10,
    padding: 14, alignItems: "center", marginTop: 12,
  },
  calcBtnTxt: { color: "#fff", fontSize: 15, fontWeight: "600" },
  result: {
    borderRadius: 14, padding: 14, marginTop: 14,
    flexDirection: "row", alignItems: "center", gap: 12,
    borderWidth: 1, borderColor: "rgba(99,102,241,0.2)",
  },
  resultIcon: {
    width: 58, height: 58, borderRadius: 12,
    borderWidth: 2, borderColor: "rgba(99,102,241,0.2)",
    overflow: "hidden", justifyContent: "center", alignItems: "center",
  },
  resultLbl: {
    fontSize: 10, color: "#6366f1", fontWeight: "600",
    letterSpacing: 1, marginBottom: 2,
  },
  resultNum: { fontSize: 30, fontWeight: "500", color: "#111827" },
  resultUnit: { fontSize: 16, color: "#6b7280" },
  resultDesc: { fontSize: 11, color: "#6b7280", marginTop: 3 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 6 },
  chip: {
    backgroundColor: "#f3f4f6", borderRadius: 99,
    paddingVertical: 2, paddingHorizontal: 8,
    borderWidth: 1, borderColor: "#e5e7eb",
  },
  chipTxt: { fontSize: 10, color: "#6b7280" },
});
