// ─────────────────────────────────────────────────────────────────────────────
// PixelEditor — editor de pixel art 8×8 com paleta de cores
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import {
  View, TouchableOpacity, ScrollView, Text, StyleSheet,
} from "react-native";
import { PALETTE_EDITOR, EMPTY_GRID } from "../data/materials";

export default function PixelEditor({ grid, onChange }) {
  const [paintColor, setPaintColor] = useState(PALETTE_EDITOR[0]);
  const [eraser, setEraser] = useState(false);

  const paint = (y, x) => {
    const next = grid.map((r) => [...r]);
    next[y][x] = eraser ? null : paintColor;
    onChange(next);
  };

  return (
    <View>
      {/* Paleta */}
      <View style={s.palette}>
        {PALETTE_EDITOR.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => { setPaintColor(c); setEraser(false); }}
            style={[
              s.swatch,
              { backgroundColor: c },
              !eraser && paintColor === c && s.swatchSel,
            ]}
          />
        ))}
        {/* Borracha */}
        <TouchableOpacity
          onPress={() => setEraser(true)}
          style={[s.swatch, s.eraser, eraser && s.swatchSel]}
        >
          <Text style={{ fontSize: 12 }}>⌫</Text>
        </TouchableOpacity>
      </View>

      {/* Grid 8×8 */}
      <View style={s.grid}>
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <TouchableOpacity
              key={`${y}-${x}`}
              onPress={() => paint(y, x)}
              activeOpacity={0.7}
              style={[
                s.cell,
                { backgroundColor: cell || "#f3f4f6" },
              ]}
            />
          ))
        )}
      </View>

      {/* Limpar */}
      <TouchableOpacity
        onPress={() => onChange(EMPTY_GRID())}
        style={s.clearBtn}
      >
        <Text style={s.clearTxt}>Limpar tela</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  palette: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 12,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  swatchSel: {
    borderWidth: 2,
    borderColor: "#6366f1",
  },
  eraser: {
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 8 * 34,
    alignSelf: "center",
    gap: 2,
  },
  cell: {
    width: 32,
    height: 32,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  clearBtn: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#fca5a5",
  },
  clearTxt: {
    color: "#dc2626",
    fontSize: 12,
    fontWeight: "500",
  },
});
