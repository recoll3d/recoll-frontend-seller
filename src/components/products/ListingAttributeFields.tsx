import {
  DIAMETER_UNITS,
  LENGTH_SPEC_UNITS,
  SPEC_VALUE_OPTIONS,
  WEIGHT_UNITS,
} from "../../data/listingCatalog";
import {
  COLOR_PALETTE_CUSTOM_VALUE,
  COLOR_SWATCH_PRESETS,
  normalizeHex,
  paletteSelectValueForHex,
  resolveColorVariantFromHex,
} from "../../utils/colorNameFromHex";

const LENGTH_SPEC_LABELS = new Set(["Altura", "Largura", "Profundidade", "Comprimento"]);

export function specLabelValueKind(label: string) {
  if (label === "Cor") return "color";
  if (label === "Peso") return "weight";
  if (label === "Diâmetro" || LENGTH_SPEC_LABELS.has(label)) return "length";
  return "text";
}

export function nextAttributeValue(prevLabel: string, nextLabel: string, prevValue: string) {
  if (nextLabel.trim() === "Cor") {
    return prevLabel.trim() === "Cor" && prevValue.trim() ? prevValue : "Preto";
  }
  if (shouldClearSpecValueOnLabelChange(prevLabel, nextLabel)) return "";
  return prevValue;
}

export function shouldClearSpecValueOnLabelChange(prevLabel: string, nextLabel: string) {
  return specLabelValueKind(prevLabel) !== specLabelValueKind(nextLabel);
}

export function sanitizeDecimalAmount(raw: string) {
  const match = raw.replace(/[^\d,.]/g, "").match(/^(\d*)([,.])?(\d*)/);
  if (!match) return "";
  const separator = match[2] ?? "";
  if (!separator) return match[1];
  return `${match[1]}${separator}${match[3] ?? ""}`;
}

function splitValueWithUnit(value: string, units: readonly string[]) {
  for (const unit of units) {
    const re = new RegExp(`\\s*${unit.replace(".", "\\.")}\\s*$`, "i");
    if (re.test(value)) {
      return { amount: value.replace(re, "").trim(), unit };
    }
  }
  return { amount: value.trim(), unit: units[0] };
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function AttributeValueField({ label, value, onChange, disabled }: FieldProps) {
  const options = SPEC_VALUE_OPTIONS[label];

  if (label === "Cor") {
    return <ColorValueField value={value} onChange={onChange} disabled={disabled} />;
  }

  if (LENGTH_SPEC_LABELS.has(label)) {
    return <UnitValueField value={value} units={LENGTH_SPEC_UNITS} onChange={onChange} disabled={disabled} />;
  }

  if (label === "Diâmetro") {
    return <UnitValueField value={value} units={DIAMETER_UNITS} onChange={onChange} disabled={disabled} />;
  }

  if (label === "Peso") {
    return <UnitValueField value={value} units={WEIGHT_UNITS} onChange={onChange} disabled={disabled} />;
  }

  if (options?.length) {
    const inList = options.includes(value);
    const showCustom = !inList && value !== "";
    const selectValue = inList ? value : showCustom || value === "" ? "Outro" : value;

    return (
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
        <select
          className="input select-input input-grow"
          value={selectValue}
          disabled={disabled}
          onChange={(event) => {
            const next = event.target.value;
            onChange(next === "Outro" ? "" : next);
          }}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {selectValue === "Outro" ? (
          <input
            className="input input-grow"
            placeholder="Descreva a opção"
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : null}
      </div>
    );
  }

  const numeric = label === "Temperatura do bico" || label === "Temperatura da mesa";
  return (
    <input
      className="input input-grow"
      inputMode={numeric ? "decimal" : undefined}
      value={value}
      disabled={disabled}
      onChange={(event) =>
        onChange(numeric ? sanitizeDecimalAmount(event.target.value) : event.target.value)
      }
    />
  );
}

function storedColor(value: string) {
  const named = COLOR_SWATCH_PRESETS.find((entry) => entry.name === value.trim());
  if (named) {
    const hex = normalizeHex(named.hex);
    return { hex, select: hex };
  }
  if (/^#[0-9a-fA-F]{6}$/.test(value.trim())) {
    const resolved = resolveColorVariantFromHex(value);
    return { hex: resolved.hex, select: paletteSelectValueForHex(resolved.hex) };
  }
  const fallback = normalizeHex(COLOR_SWATCH_PRESETS[0].hex);
  return { hex: fallback, select: fallback };
}

function commitColor(hex: string, onChange: (value: string) => void) {
  const resolved = resolveColorVariantFromHex(hex);
  onChange(resolved.name === "Personalizada" ? resolved.hex : resolved.name);
}

function ColorValueField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const color = storedColor(value);
  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-end gap-2">
      <div className="field-group min-w-0 flex-1">
        <label className="field-label">Paleta</label>
        <select
          className="input select-input"
          value={color.select}
          disabled={disabled}
          onChange={(event) => {
            const next = event.target.value;
            if (next === COLOR_PALETTE_CUSTOM_VALUE) return;
            commitColor(next, onChange);
          }}
        >
          <option value={COLOR_PALETTE_CUSTOM_VALUE}>Personalizada…</option>
          {COLOR_SWATCH_PRESETS.map((preset) => (
            <option key={preset.name} value={normalizeHex(preset.hex)}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field-group w-28 shrink-0">
        <label className="field-label">Amostra</label>
        <input
          type="color"
          className="block h-14 w-28 cursor-pointer rounded-lg border border-edge bg-body"
          value={color.hex}
          disabled={disabled}
          onChange={(event) => commitColor(event.target.value, onChange)}
        />
      </div>
    </div>
  );
}

function UnitValueField({
  value,
  units,
  onChange,
  disabled,
}: {
  value: string;
  units: readonly string[];
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const parsed = splitValueWithUnit(value, units);
  return (
    <div className="flex min-w-0 flex-1 gap-2">
      <input
        className="input input-grow"
        inputMode="decimal"
        value={parsed.amount}
        disabled={disabled}
        onChange={(event) =>
          onChange(`${sanitizeDecimalAmount(event.target.value)} ${parsed.unit}`.trim())
        }
      />
      <select
        className="input select-input input-unit"
        value={parsed.unit}
        disabled={disabled}
        onChange={(event) => onChange(`${parsed.amount} ${event.target.value}`.trim())}
      >
        {units.map((unit) => (
          <option key={unit} value={unit}>
            {unit}
          </option>
        ))}
      </select>
    </div>
  );
}

type LabelSelectProps = {
  value: string;
  presets: readonly string[];
  onChange: (label: string) => void;
  disabled?: boolean;
};

export function AttributeLabelSelect({ value, presets, onChange, disabled }: LabelSelectProps) {
  const selectValue = presets.includes(value) ? value : "Outro";

  return (
    <div className="flex w-full shrink-0 flex-col gap-2 sm:w-52">
      <select
        className="input select-input"
        value={selectValue}
        disabled={disabled}
        onChange={(event) => {
          const next = event.target.value;
          onChange(next === "Outro" ? "" : next);
        }}
      >
        {presets.map((preset) => (
          <option key={preset} value={preset}>
            {preset}
          </option>
        ))}
      </select>
      {selectValue === "Outro" ? (
        <input
          className="input"
          placeholder="Nome do atributo"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : null}
    </div>
  );
}
