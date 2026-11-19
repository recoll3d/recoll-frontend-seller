import {
  DIAMETER_UNITS,
  LENGTH_SPEC_UNITS,
  SPEC_VALUE_OPTIONS,
  WEIGHT_UNITS,
} from "../../data/listingCatalog";

const LENGTH_SPEC_LABELS = new Set(["Altura", "Largura", "Profundidade", "Comprimento"]);

export function specLabelValueKind(label: string) {
  if (label === "Peso") return "weight";
  if (label === "Diâmetro" || LENGTH_SPEC_LABELS.has(label)) return "length";
  return "text";
}

export function shouldClearSpecValueOnLabelChange(prevLabel: string, nextLabel: string) {
  return specLabelValueKind(prevLabel) !== specLabelValueKind(nextLabel);
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
      <div className="flex min-w-[200px] flex-1 flex-col gap-2 sm:flex-row">
        <select
          className="input select-input flex-1"
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
            className="input flex-1"
            placeholder="Descreva a opção"
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : null}
      </div>
    );
  }

  return (
    <input
      className="input min-w-[160px] flex-1"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
    />
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
    <div className="flex min-w-[200px] flex-1 gap-2">
      <input
        className="input flex-1"
        value={parsed.amount}
        disabled={disabled}
        onChange={(event) => onChange(`${event.target.value.trim()} ${parsed.unit}`.trim())}
      />
      <select
        className="input select-input w-24 shrink-0"
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
    <div className="flex w-full flex-col gap-2 sm:w-52 sm:shrink-0">
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
