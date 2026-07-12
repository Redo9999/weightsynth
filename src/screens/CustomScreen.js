// ─────────────────────────────────────────────────────────────────────────────
// CustomScreen — gerenciamento dos 4 slots de materiais personalizados
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  Modal, StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from "react-native";
import PixelView from "../components/PixelView";
import PixelEditor from "../components/PixelEditor";
import { EMPTY_GRID } from "../data/materials";
import { validateDensity, sanitizeName } from "../utils/validation";

export default function CustomScreen({ slots, onSave, onClear }) {
  const [editIdx, setEditIdx] = useState(null);
  const [nome, setNome]       = useState("");
  const [den, setDen]         = useState("");
  const [grid, setGrid]       = useState(EMPTY_GRID());

  const openEdit = (i) => {
    const s = slots[i];
    setEditIdx(i);
    setNome(s?.nome || "");
    setDen(s?.den?.toString() || "");
    setGrid(s?.grid ? s.grid.map((r) => [...r]) : EMPTY_GRID());
  };

  const save = () => {
    const n = sanitizeName(nome);
    if (!n || n.length < 2) {
      Alert.alert("Atenção", "Informe um nome válido para o material (mínimo 2 caracteres).");
      return;
    }
    const denResult = validateDensity(den);
    if (!denResult.ok) {
      Alert.alert("Atenção", denResult.error);
      return;
    }
    onSave(editIdx, {
      id: `custom_${editIdx}`,
      nome: n,
      den: denResult.value,
      grp: "custom",
      grid: grid.map((r) => [...r]),
    });
    setEditIdx(null);
  };

  const clear = () => {
    Alert.alert("Remover material", "Deseja remover este material personalizado?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Remover", style: "destructive", onPress: () => { onClear(editIdx); setEditIdx(null); } },
    ]);
  };

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      <Text style={s.intro}>
        Você tem <Text style={{ fontWeight: "700" }}>4 slots</Text> para materiais
        personalizados. Toque em um slot para configurar.
      </Text>

      {/* SLOTS */}
      <View style={s.slotGrid}>
        {slots.map((slot, i) => (
          <TouchableOpacity key={i} style={[s.slotCard, slot && s.slotFilled]}
            onPress={() => openEdit(i)}>
            {slot ? (
              <>
                <PixelView grid={slot.grid} size={6} />
                <Text style={s.matName}>{slot.nome}</Text>
                <Text style={s.matDen}>{slot.den.toLocaleString()} kg/m³</Text>
              </>
            ) : (
              <>
                <Text style={s.slotPlus}>+</Text>
                <Text style={[s.matName, { color: "#9ca3af" }]}>slot vazio</Text>
                <Text style={s.matDen}>toque para adicionar</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* DICA */}
      <View style={s.hint}>
        <Text style={s.hintTitle}>📐 Como calcular a densidade</Text>
        <Text style={s.hintTxt}>
          Pegue uma amostra do material com dimensões conhecidas
          (ex: <Text style={{ fontWeight: "700" }}>50×50×50 mm</Text>) e pese em gramas.{"\n\n"}
          <Text style={{ fontWeight: "700" }}>Fórmula:</Text>{" "}
          ρ = (peso em g ÷ volume em cm³) × 1000{"\n\n"}
          Exemplo: amostra 50×50×50 mm pesa 890 g{"\n"}
          Volume = 125 cm³ → ρ = (890÷125)×1000 ={" "}
          <Text style={{ fontWeight: "700" }}>7.120 kg/m³</Text>
        </Text>
      </View>

      {/* MODAL DE EDIÇÃO */}
      <Modal visible={editIdx !== null} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={s.overlay}>
          <View style={s.modal}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={s.modalTitle}>
                {slots[editIdx ?? 0]
                  ? `Editar slot ${(editIdx ?? 0) + 1}`
                  : `Novo material — slot ${(editIdx ?? 0) + 1}`}
              </Text>

              {/* Dica rápida */}
              <View style={[s.hint, { marginBottom: 12 }]}>
                <Text style={s.hintTitle}>💡 Dica rápida</Text>
                <Text style={s.hintTxt}>
                  Meça uma amostra de <Text style={{ fontWeight: "700" }}>50×50×50 mm</Text>,
                  pese em gramas e calcule:{"\n"}
                  <Text style={{ fontWeight: "700" }}>ρ = (gramas ÷ 125) × 1000</Text>
                </Text>
              </View>

              {/* Campos */}
              <View style={s.inpGrid2}>
                <View style={s.inpWrap}>
                  <Text style={s.inpLabel}>Nome do material</Text>
                  <TextInput style={s.inp} placeholder="ex: Bambu laminado"
                    value={nome} onChangeText={setNome} />
                </View>
                <View style={s.inpWrap}>
                  <Text style={s.inpLabel}>Densidade (kg/m³)</Text>
                  <TextInput style={s.inp} placeholder="ex: 700"
                    keyboardType="numeric" value={den} onChangeText={setDen} />
                </View>
              </View>

              {/* Editor pixel art */}
              <Text style={s.secLabel}>pixel art — toque para pintar</Text>
              <PixelEditor grid={grid} onChange={setGrid} />

              {/* Botões */}
              <View style={s.modalBtns}>
                <TouchableOpacity style={s.btnCancel} onPress={() => setEditIdx(null)}>
                  <Text style={s.btnCancelTxt}>Cancelar</Text>
                </TouchableOpacity>
                {slots[editIdx ?? 0] && (
                  <TouchableOpacity style={s.btnClear} onPress={clear}>
                    <Text style={s.btnClearTxt}>Remover</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={s.btnSave} onPress={save}>
                  <Text style={s.btnSaveTxt}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 16, paddingBottom: 40 },
  intro: { fontSize: 13, color: "#6b7280", marginBottom: 14, lineHeight: 20 },
  slotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  slotCard: {
    width: "22%", borderRadius: 10, padding: 8, alignItems: "center",
    borderWidth: 1.5, borderStyle: "dashed", borderColor: "#d1d5db",
    backgroundColor: "#f9fafb",
  },
  slotFilled: { borderStyle: "solid", borderColor: "#e5e7eb" },
  slotPlus: { fontSize: 28, color: "#9ca3af", height: 48, lineHeight: 48 },
  matName: { fontSize: 9, color: "#374151", marginTop: 4, textAlign: "center" },
  matDen: { fontSize: 8, color: "#9ca3af", marginTop: 1 },
  hint: {
    backgroundColor: "#eef2ff", borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: "#c7d2fe",
  },
  hintTitle: { fontSize: 13, fontWeight: "700", color: "#4f46e5", marginBottom: 6 },
  hintTxt: { fontSize: 12, color: "#4f46e5", lineHeight: 18 },
  overlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, maxHeight: "90%",
  },
  modalTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 12 },
  inpGrid2: { flexDirection: "row", gap: 10, marginBottom: 12 },
  inpWrap: { flex: 1 },
  inpLabel: { fontSize: 11, color: "#6b7280", fontWeight: "500", marginBottom: 4 },
  inp: {
    borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8,
    padding: 10, fontSize: 13, color: "#111827",
  },
  secLabel: {
    fontSize: 11, fontWeight: "600", color: "#9ca3af",
    textTransform: "uppercase", letterSpacing: 1,
    marginTop: 14, marginBottom: 8,
  },
  modalBtns: { flexDirection: "row", gap: 8, marginTop: 16 },
  btnCancel: {
    padding: 11, backgroundColor: "#f3f4f6",
    borderRadius: 8, borderWidth: 1, borderColor: "#e5e7eb",
  },
  btnCancelTxt: { color: "#374151", fontSize: 13 },
  btnClear: {
    padding: 11, backgroundColor: "#fee2e2",
    borderRadius: 8, borderWidth: 1, borderColor: "#fca5a5",
  },
  btnClearTxt: { color: "#dc2626", fontSize: 13 },
  btnSave: { flex: 1, padding: 11, backgroundColor: "#6366f1", borderRadius: 8, alignItems: "center" },
  btnSaveTxt: { color: "#fff", fontSize: 13, fontWeight: "600" },
});
