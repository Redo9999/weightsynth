// ─────────────────────────────────────────────────────────────────────────────
// PixelView — renderiza pixel art (8×8 ou 16×16)
// WeightSynth v1.2.071326-BETA
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { View } from "react-native";

export default function PixelView({ px, pal, grid, size = 4 }) {
  const rows = grid || px;
  if (!rows) return null;

  const n = rows.length; // detecta automaticamente 8 ou 16
  const cellSize = size;

  return (
    <View style={{ width: cellSize * n, height: cellSize * n }}>
      {rows.map((row, y) => (
        <View key={y} style={{ flexDirection: "row" }}>
          {row.map((cell, x) => {
            let color = "transparent";
            if (grid) {
              color = cell || "transparent";
            } else {
              color = cell && pal ? pal[cell] : "transparent";
            }
            return (
              <View
                key={x}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor:
                    color === "transparent" ? "rgba(0,0,0,0)" : color,
                }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}
