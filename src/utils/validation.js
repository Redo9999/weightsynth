// ─────────────────────────────────────────────────────────────────────────────
// validation.js — validações de entrada e constantes de segurança
// WeightSynth
// ─────────────────────────────────────────────────────────────────────────────

// Limites máximos e mínimos para evitar overflow e valores absurdos
export const LIMITS = {
  DIM_MIN:       0.01,      // mm — menor dimensão aceita
  DIM_MAX:       99999,     // mm — ~100 metros, limite razoável
  DENSITY_MIN:   0.1,       // kg/m³ — menor densidade conhecida (aerogel)
  DENSITY_MAX:   25000,     // kg/m³ — maior densidade de material sólido (ósmio ~22590)
  MASS_MAX:      1e9,       // kg — 1 milhão de toneladas, limite de exibição
  CIRC_MIN:      1,         // mm — circunferência mínima para cálculo de raio
  CIRC_MAX:      99999,     // mm — ~100 metros de circunferência
  THICKNESS_MIN: 0.01,      // mm — espessura mínima
};

// Mensagens de erro padronizadas
export const ERRORS = {
  FIELD_EMPTY:    "Preencha todos os campos antes de calcular.",
  VALUE_NEGATIVE: "Os valores devem ser maiores que zero.",
  VALUE_TOO_BIG:  (field, max) => `${field} não pode ser maior que ${max.toLocaleString()} mm.`,
  INNER_GTE_OUTER:"O diâmetro interno deve ser menor que o externo.",
  THICKNESS_BIG:  "A espessura é maior que o raio externo. Verifique os valores.",
  DENSITY_RANGE:  `A densidade deve estar entre ${LIMITS.DENSITY_MIN} e ${LIMITS.DENSITY_MAX.toLocaleString()} kg/m³.`,
  RESULT_OVERFLOW:"O resultado é muito grande para ser exibido. Verifique as dimensões.",
  NAN:            "Valor inválido. Use apenas números.",
};

/**
 * Valida e retorna um número seguro a partir de uma string de input.
 * Retorna null se inválido.
 */
export function parseSecure(str) {
  if (str === null || str === undefined || str.trim() === "") return null;
  const v = parseFloat(str.replace(",", "."));
  if (isNaN(v) || !isFinite(v)) return null;
  return v;
}

/**
 * Valida uma dimensão (mm) dentro dos limites seguros.
 * Retorna { ok: true, value } ou { ok: false, error }
 */
export function validateDim(str, fieldName = "Dimensão") {
  const v = parseSecure(str);
  if (v === null) return { ok: false, error: ERRORS.NAN };
  if (v <= 0) return { ok: false, error: ERRORS.VALUE_NEGATIVE };
  if (v < LIMITS.DIM_MIN) return { ok: false, error: `${fieldName} mínima: ${LIMITS.DIM_MIN} mm.` };
  if (v > LIMITS.DIM_MAX) return { ok: false, error: ERRORS.VALUE_TOO_BIG(fieldName, LIMITS.DIM_MAX) };
  return { ok: true, value: v };
}

/**
 * Valida densidade inserida pelo usuário para materiais customizados.
 */
export function validateDensity(str) {
  const v = parseSecure(str);
  if (v === null) return { ok: false, error: ERRORS.NAN };
  if (v <= 0) return { ok: false, error: ERRORS.VALUE_NEGATIVE };
  if (v < LIMITS.DENSITY_MIN || v > LIMITS.DENSITY_MAX) {
    return { ok: false, error: ERRORS.DENSITY_RANGE };
  }
  return { ok: true, value: v };
}

/**
 * Valida resultado de massa — protege contra overflow de exibição.
 */
export function validateMassResult(massa) {
  if (!isFinite(massa) || isNaN(massa)) return { ok: false, error: ERRORS.RESULT_OVERFLOW };
  if (massa > LIMITS.MASS_MAX) return { ok: false, error: ERRORS.RESULT_OVERFLOW };
  return { ok: true };
}

/**
 * Formata a massa com unidade automática.
 */
export function formatMass(massa) {
  if (massa >= 1000000) return { str: (massa / 1000000).toFixed(4), unit: "kt" };
  if (massa >= 1000)    return { str: (massa / 1000).toFixed(4),    unit: "t"  };
  if (massa < 0.001)    return { str: (massa * 1000).toFixed(3),    unit: "g"  };
  return { str: massa.toFixed(4), unit: "kg" };
}

/**
 * Sanitiza string de nome de material — remove caracteres perigosos.
 */
export function sanitizeName(str) {
  return str
    .replace(/[<>{}[\]\\\/]/g, "")   // remove caracteres especiais
    .replace(/\s+/g, " ")             // normaliza espaços
    .trim()
    .slice(0, 40);                    // limite de 40 caracteres
}
