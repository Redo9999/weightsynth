// ─────────────────────────────────────────────────────────────────────────────
// MeasureGuide — diagrama visual de como medir cada tipo de objeto
// Usa apenas View/Text do React Native (sem dependência de SVG externa)
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { View, Text, StyleSheet } from "react-native";

// ── Cilindro sólido ──────────────────────────────────────────────────────────
function CilindroSVG() {
  return (
    <View style={g.wrap}>
      {/* corpo do cilindro */}
      <View style={g.cylBody}>
        {/* face esquerda (elipse simulada) */}
        <View style={g.cylLeft} />
        {/* corpo central */}
        <View style={g.cylMid} />
        {/* face direita */}
        <View style={g.cylRight} />
      </View>
      {/* seta diâmetro */}
      <View style={g.arrowRow}>
        <View style={[g.dot, { backgroundColor: "#f43f5e" }]} />
        <View style={[g.line, { backgroundColor: "#f43f5e", width: 30 }]} />
        <Text style={[g.dimLbl, { color: "#f43f5e" }]}>∅</Text>
      </View>
      {/* seta comprimento */}
      <View style={g.arrowRow}>
        <View style={[g.dot, { backgroundColor: "#f59e0b" }]} />
        <View style={[g.line, { backgroundColor: "#f59e0b", width: 70 }]} />
        <Text style={[g.dimLbl, { color: "#f59e0b" }]}>L</Text>
      </View>
    </View>
  );
}

// ── Bloco / Chapa ─────────────────────────────────────────────────────────────
function BlocoSVG() {
  return (
    <View style={g.wrap}>
      {/* frente do bloco */}
      <View style={g.blockFront}>
        {/* label B (altura) */}
        <Text style={[g.faceLbl, { color: "#f43f5e" }]}>B</Text>
      </View>
      {/* topo do bloco (perspectiva) */}
      <View style={g.blockTop} />
      {/* lateral */}
      <View style={g.blockSide} />
      {/* setas */}
      <View style={[g.arrowRow, { marginTop: 4 }]}>
        <View style={[g.dot, { backgroundColor: "#10b981" }]} />
        <View style={[g.line, { backgroundColor: "#10b981", width: 40 }]} />
        <Text style={[g.dimLbl, { color: "#10b981" }]}>A</Text>
      </View>
      <View style={g.arrowRow}>
        <View style={[g.dot, { backgroundColor: "#f59e0b" }]} />
        <View style={[g.line, { backgroundColor: "#f59e0b", width: 55 }]} />
        <Text style={[g.dimLbl, { color: "#f59e0b" }]}>L</Text>
      </View>
    </View>
  );
}

// ── Tubo / Perfil oco ─────────────────────────────────────────────────────────
function TuboSVG() {
  return (
    <View style={g.wrap}>
      {/* anel externo */}
      <View style={g.tubeOuter}>
        {/* anel interno (furo) */}
        <View style={g.tubeInner} />
      </View>
      {/* setas */}
      <View style={g.arrowRow}>
        <View style={[g.dot, { backgroundColor: "#f43f5e" }]} />
        <View style={[g.line, { backgroundColor: "#f43f5e", width: 36 }]} />
        <Text style={[g.dimLbl, { color: "#f43f5e" }]}>∅e</Text>
      </View>
      <View style={g.arrowRow}>
        <View style={[g.dot, { backgroundColor: "#10b981" }]} />
        <View style={[g.line, { backgroundColor: "#10b981", width: 22, borderStyle: "dashed" }]} />
        <Text style={[g.dimLbl, { color: "#10b981" }]}>∅i</Text>
      </View>
      <View style={g.arrowRow}>
        <View style={[g.dot, { backgroundColor: "#f59e0b" }]} />
        <View style={[g.line, { backgroundColor: "#f59e0b", width: 60 }]} />
        <Text style={[g.dimLbl, { color: "#f59e0b" }]}>L</Text>
      </View>
    </View>
  );
}

const COMPONENTS = { cilindro: CilindroSVG, bloco: BlocoSVG, tubo: TuboSVG };

const LEGENDS = {
  cilindro: [
    { cor: "#f43f5e", txt: "∅ = diâmetro da seção circular" },
    { cor: "#f59e0b", txt: "L = comprimento total" },
  ],
  bloco: [
    { cor: "#10b981", txt: "A = largura" },
    { cor: "#f43f5e", txt: "B = altura" },
    { cor: "#f59e0b", txt: "L = comprimento" },
  ],
  tubo: [
    { cor: "#f43f5e", txt: "∅e = diâmetro externo" },
    { cor: "#10b981", txt: "∅i = diâmetro interno" },
    { cor: "#f59e0b", txt: "L = comprimento" },
  ],
};

const TITLES = {
  cilindro: "Barra / Cilindro sólido",
  bloco: "Bloco / Chapa",
  tubo: "Tubo / Perfil oco",
};

export default function MeasureGuide({ shape }) {
  const SVG = COMPONENTS[shape] || CilindroSVG;
  const legend = LEGENDS[shape] || LEGENDS.cilindro;
  const title = TITLES[shape] || "";

  return (
    <View style={s.card}>
      <SVG />
      <View style={s.info}>
        <Text style={s.title}>{title}</Text>
        {legend.map((it, i) => (
          <View key={i} style={s.row}>
            <View style={[s.dot, { backgroundColor: it.cor }]} />
            <Text style={s.txt}>{it.txt}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
  },
  info: { flex: 1 },
  title: { fontSize: 12, fontWeight: "600", color: "#111827", marginBottom: 6 },
  row: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 3 },
  dot: { width: 7, height: 7, borderRadius: 2 },
  txt: { fontSize: 11, color: "#374151" },
});

// ── Estilos internos dos diagramas ────────────────────────────────────────────
const g = StyleSheet.create({
  wrap: { width: 100, alignItems: "flex-start", justifyContent: "center" },
  // cilindro
  cylBody: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  cylLeft: {
    width: 14, height: 44, borderRadius: 7,
    backgroundColor: "#c7d2fe", borderWidth: 1, borderColor: "#6366f1",
  },
  cylMid: {
    width: 50, height: 44,
    backgroundColor: "#a5b4fc", borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: "#6366f1",
  },
  cylRight: {
    width: 14, height: 44, borderRadius: 7,
    backgroundColor: "#818cf8", borderWidth: 1, borderColor: "#6366f1",
  },
  // bloco
  blockFront: {
    width: 50, height: 40,
    backgroundColor: "#c7d2fe", borderWidth: 1, borderColor: "#6366f1",
    justifyContent: "center", alignItems: "center", marginBottom: 2,
  },
  blockTop: {
    width: 50, height: 12,
    backgroundColor: "#a5b4fc",
    borderWidth: 1, borderColor: "#6366f1",
    transform: [{ skewX: "30deg" }],
    position: "absolute", top: -10, left: 8,
  },
  blockSide: {
    width: 15, height: 40,
    backgroundColor: "#818cf8",
    borderWidth: 1, borderColor: "#6366f1",
    position: "absolute", left: 50, top: 0,
  },
  faceLbl: { fontSize: 13, fontWeight: "700" },
  // tubo
  tubeOuter: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: "#c7d2fe", borderWidth: 2, borderColor: "#6366f1",
    justifyContent: "center", alignItems: "center", marginBottom: 6,
  },
  tubeInner: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "#eef2ff", borderWidth: 1.5, borderColor: "#6366f1",
  },
  // genérico
  arrowRow: {
    flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 3,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  line: { height: 2, borderRadius: 1 },
  dimLbl: { fontSize: 10, fontWeight: "700" },
});
