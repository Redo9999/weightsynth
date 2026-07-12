// ─────────────────────────────────────────────────────────────────────────────
// PixelView — renderiza um grid 8×8 de pixel art
// Aceita: px + pal (material padrão) OU grid (material customizado)
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { View } from "react-native";

export default function PixelView({ px, pal, grid, size = 6 }) {
  const rows = grid || px;
  if (!rows) return null;

  return (
    <View style={{ width: size * 8, height: size * 8 }}>
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
                  width: size,
                  height: size,
                  backgroundColor: color === "transparent" ? "rgba(0,0,0,0)" : color,
                }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}
