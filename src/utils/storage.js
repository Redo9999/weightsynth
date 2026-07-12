// ─────────────────────────────────────────────────────────────────────────────
// storage.js — AsyncStorage seguro com tratamento de erros e fallback
// WeightSynth
// ─────────────────────────────────────────────────────────────────────────────
import AsyncStorage from "@react-native-async-storage/async-storage";

const MAX_RETRIES = 2;

/**
 * Tenta ler um item do AsyncStorage com retry automático.
 * Retorna o valor parseado ou null em caso de falha.
 */
export async function safeGet(key) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.warn(`[WeightSynth] safeGet falhou (tentativa ${attempt + 1}):`, err);
      if (attempt === MAX_RETRIES) return null;
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
    }
  }
  return null;
}

/**
 * Tenta salvar um item no AsyncStorage com retry automático.
 * Retorna true em sucesso, false em falha definitiva.
 */
export async function safeSet(key, value) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const serialized = JSON.stringify(value);

      // Proteção contra dados muito grandes (AsyncStorage tem limite de ~2MB por item)
      if (serialized.length > 500000) {
        console.warn("[WeightSynth] Dado muito grande para salvar:", serialized.length);
        return false;
      }

      await AsyncStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      console.warn(`[WeightSynth] safeSet falhou (tentativa ${attempt + 1}):`, err);
      if (attempt === MAX_RETRIES) return false;
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
    }
  }
  return false;
}

/**
 * Remove um item do AsyncStorage com segurança.
 */
export async function safeRemove(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (err) {
    console.warn("[WeightSynth] safeRemove falhou:", err);
    return false;
  }
}

/**
 * Verifica se o AsyncStorage está disponível e funcional.
 * Útil para mostrar aviso ao usuário se o storage estiver com problema.
 */
export async function checkStorageHealth() {
  const TEST_KEY = "@weightsynth_health_check";
  try {
    await AsyncStorage.setItem(TEST_KEY, "ok");
    const val = await AsyncStorage.getItem(TEST_KEY);
    await AsyncStorage.removeItem(TEST_KEY);
    return val === "ok";
  } catch {
    return false;
  }
}
