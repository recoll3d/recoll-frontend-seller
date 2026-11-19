export const LISTING_CATEGORIES = [
  "Produtos sustentáveis e reciclados",
  "Filamentos e materiais para impressão 3D",
] as const;

export const SUSTAINABLE_MATERIAL_OPTIONS = [
  "PLA reciclado",
  "PLA sustentável",
  "PETG reciclado",
  "Material compostável",
  "Outro",
] as const;

export const VARIANT_AXIS_PRESETS = ["Cor", "Dimensão", "Outro"] as const;

export const DIMENSION_VARIANT_LABELS = ["Diâmetro", "Comprimento"] as const;

export const LENGTH_DIMENSION_UNITS = ["cm", "mm"] as const;

export const SPEC_GROUP_LOCKED_TITLES = [
  "Especificações técnicas",
  "Logística",
  "Informações gerais",
  "Sustentabilidade",
  "Compatibilidade",
  "Material e acabamento",
  "Instalação",
  "Dimensões",
] as const;

export const QUICK_SPEC_LABELS = [
  "Material",
  "Cor",
  "Peso",
  "Marca",
  "Condição",
  "Diâmetro",
  "Outro",
] as const;

export const SPEC_LABELS = [
  "Material",
  "Cor",
  "Peso",
  "Diâmetro",
  "Marca",
  "Condição",
  "Compatibilidade",
  "Temperatura do bico",
  "Temperatura da mesa",
  "Embalagem",
  "Validade recomendada",
  "Outro",
] as const;

export const SPEC_VALUE_OPTIONS: Record<string, readonly string[]> = {
  Compatibilidade: [
    'Smartphones 4,7" a 6,8"',
    "Tablets",
    "Headsets over-ear",
    "Impressoras 3D FDM",
    "Uso interno",
    "Uso externo",
    "Outro",
  ],
  Condição: ["Novo", "Usado", "Recondicionado"],
  Material: ["PLA", "PLA reciclado", "PETG", "ABS", "TPU", "Outro"],
  Embalagem: ["Papelão reciclado", "Vacuum + caixa", "Plástico reciclável", "Outro"],
};

export const DIAMETER_UNITS = ["mm", "cm", "pol"] as const;
export const WEIGHT_UNITS = ["g", "kg"] as const;
export const LENGTH_SPEC_UNITS = ["cm", "mm"] as const;

export function isGroupLockedTitle(title: string) {
  return SPEC_GROUP_LOCKED_TITLES.includes(
    title as (typeof SPEC_GROUP_LOCKED_TITLES)[number]
  );
}
