const NAMED = [
  { name: "Preto", hex: "#1f1f1f" },
  { name: "Branco", hex: "#f4f4f0" },
  { name: "Branco gelo", hex: "#eef2f3" },
  { name: "Cinza", hex: "#808080" },
  { name: "Cinza claro", hex: "#bdbdbd" },
  { name: "Cinza escuro", hex: "#616161" },
  { name: "Grafite", hex: "#4a4a4a" },
  { name: "Prata", hex: "#c0c0c0" },
  { name: "Vermelho", hex: "#e53935" },
  { name: "Vermelho escuro", hex: "#b71c1c" },
  { name: "Vermelho cereja", hex: "#c62828" },
  { name: "Laranja", hex: "#fb8c00" },
  { name: "Laranja queimado", hex: "#e65100" },
  { name: "Amarelo", hex: "#fdd835" },
  { name: "Amarelo ouro", hex: "#fbc02d" },
  { name: "Verde", hex: "#04c168" },
  { name: "Verde Recoll", hex: "#05f283" },
  { name: "Verde escuro", hex: "#2e7d32" },
  { name: "Verde lima", hex: "#aed581" },
  { name: "Verde menta", hex: "#81c784" },
  { name: "Azul", hex: "#1e88e5" },
  { name: "Azul claro", hex: "#64b5f6" },
  { name: "Azul marinho", hex: "#1565c0" },
  { name: "Azul petróleo", hex: "#006064" },
  { name: "Azul royal", hex: "#2962ff" },
  { name: "Roxo", hex: "#8e24aa" },
  { name: "Roxo claro", hex: "#ba68c8" },
  { name: "Lilás", hex: "#9575cd" },
  { name: "Rosa", hex: "#ec407a" },
  { name: "Rosa claro", hex: "#f48fb1" },
  { name: "Rosa pink", hex: "#ff4081" },
  { name: "Magenta", hex: "#d81b60" },
  { name: "Marrom", hex: "#6d4c41" },
  { name: "Marrom claro", hex: "#8d6e63" },
  { name: "Bege", hex: "#d7ccc8" },
  { name: "Areia", hex: "#d8cbb8" },
  { name: "Caramelo", hex: "#bf8f60" },
  { name: "Dourado", hex: "#c9a227" },
  { name: "Ciano", hex: "#00acc1" },
  { name: "Turquesa", hex: "#26a69a" },
  { name: "Translúcido", hex: "#dfe8ef" },
  { name: "Transparente", hex: "#e8f4fc" },
  { name: "Neon", hex: "#ccff00" },
  { name: "Bronze", hex: "#a97142" },
  { name: "Cobre", hex: "#b87333" },
  { name: "Vinho", hex: "#722f37" },
  { name: "Bordô", hex: "#880e4f" },
  { name: "Oliva", hex: "#808000" },
  { name: "Musgo", hex: "#558b2f" },
  { name: "Nude", hex: "#e3bc9a" },
  { name: "Off-white", hex: "#faf9f6" },
  { name: "Creme", hex: "#fff8e1" },
  { name: "Ice", hex: "#e0f7fa" },
  { name: "Lavanda", hex: "#e1bee7" },
  { name: "Salmão", hex: "#ff8a65" },
  { name: "Coral", hex: "#ff7043" },
  { name: "Mostarda", hex: "#f9a825" },
  { name: "Petroleo", hex: "#37474f" },
  { name: "Carvão", hex: "#263238" },
] as const;

export const COLOR_SWATCH_PRESETS = NAMED;
export const COLOR_PALETTE_CUSTOM_VALUE = "__custom__";

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  if (h.length !== 6) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function normalizeHex(hex: string) {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    h = h
      .split("")
      .map((char) => char + char)
      .join("");
  }
  if (h.length !== 6 || !/^[0-9a-fA-F]+$/.test(h)) {
    return "#808080";
  }
  return `#${h.toLowerCase()}`;
}

export function findPresetByExactHex(hex: string) {
  const normalized = normalizeHex(hex);
  return NAMED.find((entry) => normalizeHex(entry.hex) === normalized) ?? null;
}

function findPresetByName(name: string) {
  return NAMED.find((entry) => entry.name === name) ?? null;
}

export function suggestColorNameFromHex(hex: string) {
  const target = hexToRgb(normalizeHex(hex));
  if (!target) return "";

  let best = "";
  let bestDist = Number.POSITIVE_INFINITY;

  for (const entry of NAMED) {
    const rgb = hexToRgb(normalizeHex(entry.hex));
    if (!rgb) continue;
    const dist =
      (target.r - rgb.r) ** 2 + (target.g - rgb.g) ** 2 + (target.b - rgb.b) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = entry.name;
    }
  }

  const maxDistSq = 120 ** 2;
  return bestDist <= maxDistSq ? best : "";
}

export function resolveColorVariantFromHex(hex: string) {
  const normalized = normalizeHex(hex);
  const exact = findPresetByExactHex(normalized);
  if (exact) {
    return { hex: normalizeHex(exact.hex), name: exact.name };
  }

  const suggested = suggestColorNameFromHex(normalized);
  if (suggested) {
    const preset = findPresetByName(suggested);
    if (preset) {
      return { hex: normalizeHex(preset.hex), name: preset.name };
    }
  }

  return { hex: normalized, name: "Personalizada" };
}

export function paletteSelectValueForHex(hex: string) {
  const resolved = resolveColorVariantFromHex(hex);
  if (resolved.name === "Personalizada") {
    return COLOR_PALETTE_CUSTOM_VALUE;
  }
  const preset = findPresetByName(resolved.name);
  return preset ? normalizeHex(preset.hex) : COLOR_PALETTE_CUSTOM_VALUE;
}
