import { useEffect, useRef, useState, type FormEvent } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import {
  DIMENSION_VARIANT_LABELS,
  isGroupLockedTitle,
  LENGTH_DIMENSION_UNITS,
  LISTING_CATEGORIES,
  QUICK_SPEC_LABELS,
  SPEC_LABELS,
  SUSTAINABLE_MATERIAL_OPTIONS,
  VARIANT_AXIS_PRESETS,
} from "../../data/listingCatalog";
import { createSellerProduct, type SellerProduct } from "../../services/sellerAccount";
import {
  COLOR_PALETTE_CUSTOM_VALUE,
  COLOR_SWATCH_PRESETS,
  normalizeHex,
  paletteSelectValueForHex,
  resolveColorVariantFromHex,
} from "../../utils/colorNameFromHex";
import { formatBrl, formatPriceMaskFromDigits, parseMoneyBrl } from "../../utils/moneyBrl";
import { FormTextField } from "../forms/FormTextField";
import {
  AttributeLabelSelect,
  AttributeValueField,
  nextAttributeValue,
  sanitizeDecimalAmount,
} from "./ListingAttributeFields";

type Row = { id: string; label: string; value: string };
type SpecGroup = { id: string; group: string; locked: boolean; items: Row[] };
type VariantOption = {
  id: string;
  name: string;
  swatchColor: string;
  dimensionLabel?: string;
  dimensionAmount?: string;
  dimensionUnit?: string;
};
type PendingImage = { id: string; file: File; previewUrl: string };
type FieldErrors = Record<string, string>;

function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function isSustainable(category: string) {
  return category.toLowerCase().includes("sustent");
}

function withDimension(
  option: VariantOption,
  parts: { dimensionLabel: string; dimensionAmount: string; dimensionUnit: string }
): VariantOption {
  const amount = parts.dimensionAmount.trim();
  return {
    ...option,
    ...parts,
    name: amount ? `${parts.dimensionLabel} ${amount} ${parts.dimensionUnit}`.trim() : "",
  };
}

function createOption(axis: string, index = 0): VariantOption {
  if (axis === "Cor") {
    const preset = COLOR_SWATCH_PRESETS[index % COLOR_SWATCH_PRESETS.length];
    const resolved = resolveColorVariantFromHex(preset.hex);
    return { id: nextId("opt"), name: resolved.name, swatchColor: resolved.hex };
  }
  if (axis === "Dimensão") {
    return withDimension(
      { id: nextId("opt"), name: "", swatchColor: "#808080" },
      {
        dimensionLabel: DIMENSION_VARIANT_LABELS[0],
        dimensionAmount: "",
        dimensionUnit: LENGTH_DIMENSION_UNITS[0],
      }
    );
  }
  return { id: nextId("opt"), name: "", swatchColor: "#808080" };
}

function initialSpecGroup(): SpecGroup {
  return {
    id: nextId("grp"),
    group: "Especificações técnicas",
    locked: true,
    items: [{ id: nextId("spec"), label: "Material", value: "" }],
  };
}

export function SellerListingForm({
  token,
  suspended,
  onCreated,
}: {
  token?: string;
  suspended: boolean;
  onCreated: (product: SellerProduct) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryTag, setCategoryTag] = useState<string>(LISTING_CATEGORIES[0]);
  const [priceBrl, setPriceBrl] = useState("");
  const [promo, setPromo] = useState("");
  const [highlights, setHighlights] = useState("");
  const [images, setImages] = useState<PendingImage[]>([]);
  const [material, setMaterial] = useState("");
  const [materialOther, setMaterialOther] = useState("");
  const [materialOrigin, setMaterialOrigin] = useState("");
  const [packaging, setPackaging] = useState("");
  const [certification, setCertification] = useState("");
  const [hasVariants, setHasVariants] = useState(false);
  const [axis, setAxis] = useState<(typeof VARIANT_AXIS_PRESETS)[number]>("Cor");
  const [axisCustom, setAxisCustom] = useState("");
  const [options, setOptions] = useState<VariantOption[]>(() => [createOption("Cor")]);
  const [quickSpecs, setQuickSpecs] = useState<Row[]>([
    { id: nextId("qs"), label: "Material", value: "" },
  ]);
  const [specGroups, setSpecGroups] = useState<SpecGroup[]>(() => [initialSpecGroup()]);
  const [stock, setStock] = useState("");
  const [weightG, setWeightG] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [widthCm, setWidthCm] = useState("");
  const [lengthCm, setLengthCm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const sustainable = isSustainable(categoryTag);
  const disabled = suspended || sending;
  const variantLabel = axis === "Outro" ? axisCustom.trim() || "Variação" : axis;
  const imagesRef = useRef(images);
  imagesRef.current = images;

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  function clearField(key: string) {
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function inputClass(key: string) {
    return fieldErrors[key] ? "input error-input" : "input";
  }

  function validate() {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = "Informe o nome do produto.";
    if (!description.trim()) errors.description = "Informe a descrição.";
    if (!categoryTag.trim()) errors.categoryTag = "Selecione uma categoria.";

    const price = parseMoneyBrl(priceBrl);
    if (!priceBrl.trim() || price <= 0) {
      errors.priceBrl = "Informe um preço válido maior que zero.";
    }

    const promoValue = parseMoneyBrl(promo);
    if (promoValue < 0) errors.promoDiscountBrl = "Desconto promocional inválido.";
    if (promoValue > price) {
      errors.promoDiscountBrl = "O desconto promocional não pode exceder o preço.";
    }

    if (stock.trim() && !/^\d+$/.test(stock.trim())) {
      errors.stock = "Estoque deve ser um número inteiro.";
    }
    for (const field of [weightG, heightCm, widthCm, lengthCm]) {
      if (field.trim() && !/^\d+$/.test(field.trim())) {
        errors.dimensions = "Peso e dimensões aceitam somente números.";
        break;
      }
    }
    return errors;
  }

  function addImages(files: FileList | null) {
    if (!files?.length) return;
    const next = Array.from(files).map((file) => ({
      id: nextId("img"),
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((current) => {
      const room = Math.max(0, 8 - current.length);
      next.slice(room).forEach((image) => URL.revokeObjectURL(image.previewUrl));
      return [...current, ...next.slice(0, room)];
    });
  }

  function removeImage(id: string) {
    setImages((current) => {
      const target = current.find((image) => image.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((image) => image.id !== id);
    });
  }

  function resetForm() {
    setImages((current) => {
      current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      return [];
    });
    setName("");
    setDescription("");
    setCategoryTag(LISTING_CATEGORIES[0]);
    setPriceBrl("");
    setPromo("");
    setHighlights("");
    setMaterial("");
    setMaterialOther("");
    setMaterialOrigin("");
    setPackaging("");
    setCertification("");
    setHasVariants(false);
    setAxis("Cor");
    setAxisCustom("");
    setOptions([createOption("Cor")]);
    setQuickSpecs([{ id: nextId("qs"), label: "Material", value: "" }]);
    setSpecGroups([initialSpecGroup()]);
    setStock("");
    setWeightG("");
    setHeightCm("");
    setWidthCm("");
    setLengthCm("");
    setFieldErrors({});
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token || disabled) return;
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setError("Corrija os campos destacados antes de salvar.");
      return;
    }

    setSending(true);
    setError(null);
    void createSellerProduct(token, {
      name,
      description,
      categoryTag,
      priceBrl,
      creditsDiscount: promo,
      biocoinDiscountPercent: "0",
      stockAvailable: stock,
      weightG,
      heightCm,
      widthCm,
      lengthCm,
      images: images.map((image) => image.file),
      storefront: {
        highlights: highlights
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        sustainable,
        sustainability: sustainable
          ? { material, materialOther, materialOrigin, packaging, certification }
          : undefined,
        variant: hasVariants
          ? {
              id: "variant",
              label: variantLabel,
              options: options
                .filter((option) => option.name.trim())
                .map((option) => ({
                  id: option.id,
                  name: option.name.trim(),
                  ...(axis === "Cor" ? { swatchColor: option.swatchColor } : {}),
                })),
            }
          : undefined,
        quickSpecs: quickSpecs
          .filter((row) => row.label.trim() && row.value.trim())
          .map(({ label, value }) => ({ label, value })),
        specifications: specGroups
          .map((group) => ({
            group: group.group.trim(),
            items: group.items
              .filter((row) => row.label.trim() && row.value.trim())
              .map(({ label, value }) => ({ label, value })),
          }))
          .filter((group) => group.group && group.items.length),
      },
    })
      .then((product) => {
        onCreated(product);
        resetForm();
      })
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : "Não foi possível criar o anúncio.");
      })
      .finally(() => setSending(false));
  }

  return (
    <form className="mt-10 space-y-8" onSubmit={onSubmit}>
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text">Vitrine</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormTextField
              id="listing-name"
              label="Nome do produto"
              value={name}
              maxLength={255}
              error={fieldErrors.name}
              onChange={(event) => {
                setName(event.target.value);
                clearField("name");
              }}
              disabled={disabled}
            />
          </div>
          <div className="field-group sm:col-span-2">
            <label className="field-label" htmlFor="listing-description">
              Descrição
            </label>
            <textarea
              id="listing-description"
              className={`${inputClass("description")} input-area`}
              value={description}
              maxLength={4000}
              onChange={(event) => {
                setDescription(event.target.value);
                clearField("description");
              }}
              disabled={disabled}
            />
            {fieldErrors.description ? (
              <p className="error-legend">{fieldErrors.description}</p>
            ) : null}
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="listing-category">
              Categoria
            </label>
            <select
              id="listing-category"
              className={`${inputClass("categoryTag")} select-input`}
              value={categoryTag}
              onChange={(event) => {
                setCategoryTag(event.target.value);
                clearField("categoryTag");
              }}
              disabled={disabled}
            >
              {LISTING_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {fieldErrors.categoryTag ? (
              <p className="error-legend">{fieldErrors.categoryTag}</p>
            ) : null}
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="listing-price">
              Preço de venda (R$)
            </label>
            <input
              id="listing-price"
              className={inputClass("priceBrl")}
              inputMode="decimal"
              value={priceBrl}
              onChange={(event) => {
                setPriceBrl(formatPriceMaskFromDigits(event.target.value));
                clearField("priceBrl");
              }}
              disabled={disabled}
            />
            {fieldErrors.priceBrl ? (
              <p className="error-legend">{fieldErrors.priceBrl}</p>
            ) : (
              <p className="field-hint">Exibido no app: {formatBrl(parseMoneyBrl(priceBrl))}</p>
            )}
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="listing-promo">
              Desconto promocional (R$)
            </label>
            <input
              id="listing-promo"
              className={inputClass("promoDiscountBrl")}
              inputMode="decimal"
              value={promo}
              onChange={(event) => {
                setPromo(formatPriceMaskFromDigits(event.target.value));
                clearField("promoDiscountBrl");
              }}
              disabled={disabled}
            />
            {fieldErrors.promoDiscountBrl ? (
              <p className="error-legend">{fieldErrors.promoDiscountBrl}</p>
            ) : null}
            <p className="field-hint">
              Valor fixo já aplicado na vitrine, antes do checkout.
            </p>
          </div>
          <div className="field-group sm:col-span-2">
            <label className="field-label" htmlFor="listing-highlights">
              Destaques (um por linha)
            </label>
            <textarea
              id="listing-highlights"
              className="input input-area"
              value={highlights}
              onChange={(event) => setHighlights(event.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text">Fotos do produto</h2>
        <p className="field-hint mt-1">
          JPG, PNG ou WEBP. A primeira imagem vira a capa. Até 8 fotos.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative h-24 w-24 overflow-hidden rounded-lg border border-dashed border-accent"
            >
              <img src={image.previewUrl} alt="" className="h-full w-full object-cover" />
              <span className="absolute bottom-0 left-0 right-0 bg-accent/90 px-1 py-0.5 text-center text-[10px] font-semibold text-white">
                Pendente
              </span>
              <button
                type="button"
                className="absolute right-1 top-1 rounded bg-black/60 p-1 text-white"
                onClick={() => removeImage(image.id)}
                aria-label="Remover imagem"
                disabled={disabled}
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <label className="button button-outline mt-3 inline-flex w-auto cursor-pointer px-4 text-sm">
          Adicionar imagens
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            disabled={disabled || images.length >= 8}
            onChange={(event) => {
              addImages(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
      </section>

      {sustainable ? (
        <section className="rounded-[10px] border border-accent/30 bg-accent/5 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-title">
            Sustentabilidade
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="field-group">
              <label className="field-label" htmlFor="listing-material">
                Material principal
              </label>
              <select
                id="listing-material"
                className="input select-input"
                value={material}
                onChange={(event) => setMaterial(event.target.value)}
                disabled={disabled}
              >
                <option value="">Selecione</option>
                {SUSTAINABLE_MATERIAL_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {material === "Outro" ? (
              <FormTextField
                id="listing-material-other"
                label="Descreva o material"
                value={materialOther}
                onChange={(event) => setMaterialOther(event.target.value)}
                disabled={disabled}
              />
            ) : null}
            <div className="sm:col-span-2">
              <FormTextField
                id="listing-origin"
                label="Origem do material"
                value={materialOrigin}
                onChange={(event) => setMaterialOrigin(event.target.value)}
                disabled={disabled}
              />
            </div>
            <FormTextField
              id="listing-pack"
              label="Embalagem"
              value={packaging}
              onChange={(event) => setPackaging(event.target.value)}
              disabled={disabled}
            />
            <FormTextField
              id="listing-cert"
              label="Certificação / selo (opcional)"
              value={certification}
              onChange={(event) => setCertification(event.target.value)}
              disabled={disabled}
            />
          </div>
        </section>
      ) : null}

      <section>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text">Variações</h2>
          <label className="flex items-center gap-2 text-sm text-text">
            <input
              type="checkbox"
              checked={hasVariants}
              onChange={(event) => setHasVariants(event.target.checked)}
              disabled={disabled}
            />
            Produto tem variações
          </label>
        </div>
        {hasVariants ? (
          <div className="mt-3 space-y-3">
            <div className="field-group max-w-md">
              <label className="field-label" htmlFor="listing-axis">
                Tipo de variação
              </label>
              <select
                id="listing-axis"
                className="input select-input"
                value={axis}
                onChange={(event) => {
                  const next = event.target.value as (typeof VARIANT_AXIS_PRESETS)[number];
                  setAxis(next);
                  if (next !== "Outro") setAxisCustom("");
                  setOptions([createOption(next)]);
                }}
                disabled={disabled}
              >
                {VARIANT_AXIS_PRESETS.map((preset) => (
                  <option key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </select>
              {axis === "Outro" ? (
                <input
                  className="input mt-2"
                  placeholder="Ex.: Material, Acabamento"
                  value={axisCustom}
                  onChange={(event) => setAxisCustom(event.target.value)}
                  disabled={disabled}
                />
              ) : (
                <p className="field-hint mt-1">
                  Eixo salvo no app: <strong>{variantLabel}</strong>
                  {axis === "Dimensão" ? (
                    <> · Cada opção é uma medida (ex.: Diâmetro 1,75 mm).</>
                  ) : null}
                </p>
              )}
            </div>
            {options.map((option, index) => (
              <div key={option.id} className="flex min-w-0 flex-wrap items-end gap-2">
                {axis === "Cor" ? (
                  <>
                    <div className="field-group min-w-0 flex-1">
                      <label className="field-label">Paleta</label>
                      <select
                        className="input select-input"
                        value={paletteSelectValueForHex(option.swatchColor)}
                        disabled={disabled}
                        onChange={(event) => {
                          const value = event.target.value;
                          if (value === COLOR_PALETTE_CUSTOM_VALUE) return;
                          const resolved = resolveColorVariantFromHex(value);
                          setOptions((current) =>
                            current.map((row, rowIndex) =>
                              rowIndex === index
                                ? { ...row, swatchColor: resolved.hex, name: resolved.name }
                                : row
                            )
                          );
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
                        value={normalizeHex(option.swatchColor)}
                        disabled={disabled}
                        onChange={(event) => {
                          const resolved = resolveColorVariantFromHex(event.target.value);
                          setOptions((current) =>
                            current.map((row, rowIndex) =>
                              rowIndex === index
                                ? { ...row, swatchColor: resolved.hex, name: resolved.name }
                                : row
                            )
                          );
                        }}
                      />
                    </div>
                  </>
                ) : axis === "Dimensão" ? (
                  <div className="field-group min-w-0 flex-1">
                    <label className="field-label">Dimensão</label>
                    <div className="flex min-w-0 flex-wrap gap-2">
                      <select
                        className="input select-input input-axis"
                        value={option.dimensionLabel ?? DIMENSION_VARIANT_LABELS[0]}
                        disabled={disabled}
                        onChange={(event) =>
                          setOptions((current) =>
                            current.map((row, rowIndex) =>
                              rowIndex === index
                                ? withDimension(row, {
                                    dimensionLabel: event.target.value,
                                    dimensionAmount: row.dimensionAmount ?? "",
                                    dimensionUnit: row.dimensionUnit ?? LENGTH_DIMENSION_UNITS[0],
                                  })
                                : row
                            )
                          )
                        }
                      >
                        {DIMENSION_VARIANT_LABELS.map((label) => (
                          <option key={label} value={label}>
                            {label}
                          </option>
                        ))}
                      </select>
                      <input
                        className="input input-amount"
                        inputMode="decimal"
                        value={option.dimensionAmount ?? ""}
                        placeholder="1,75"
                        disabled={disabled}
                        onChange={(event) =>
                          setOptions((current) =>
                            current.map((row, rowIndex) =>
                              rowIndex === index
                                ? withDimension(row, {
                                    dimensionLabel: row.dimensionLabel ?? DIMENSION_VARIANT_LABELS[0],
                                    dimensionAmount: sanitizeDecimalAmount(event.target.value),
                                    dimensionUnit: row.dimensionUnit ?? LENGTH_DIMENSION_UNITS[0],
                                  })
                                : row
                            )
                          )
                        }
                      />
                      <select
                        className="input select-input input-unit"
                        value={option.dimensionUnit ?? LENGTH_DIMENSION_UNITS[0]}
                        disabled={disabled}
                        onChange={(event) =>
                          setOptions((current) =>
                            current.map((row, rowIndex) =>
                              rowIndex === index
                                ? withDimension(row, {
                                    dimensionLabel: row.dimensionLabel ?? DIMENSION_VARIANT_LABELS[0],
                                    dimensionAmount: row.dimensionAmount ?? "",
                                    dimensionUnit: event.target.value,
                                  })
                                : row
                            )
                          )
                        }
                      >
                        {LENGTH_DIMENSION_UNITS.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="field-group min-w-[160px] flex-1">
                    <label className="field-label">Nome da opção</label>
                    <input
                      className="input"
                      value={option.name}
                      placeholder="Ex.: Fosco, PLA+"
                      disabled={disabled}
                      onChange={(event) =>
                        setOptions((current) =>
                          current.map((row, rowIndex) =>
                            rowIndex === index ? { ...row, name: event.target.value } : row
                          )
                        )
                      }
                    />
                  </div>
                )}
                <button
                  type="button"
                  className="mb-0 flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-edge text-text disabled:opacity-40"
                  disabled={disabled || options.length <= 1}
                  aria-label="Remover opção"
                  onClick={() => setOptions((current) => current.filter((_, rowIndex) => rowIndex !== index))}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent"
              disabled={disabled}
              onClick={() => setOptions((current) => [...current, createOption(axis, current.length)])}
            >
              <FiPlus /> Adicionar opção
            </button>
          </div>
        ) : null}
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text">Ficha rápida</h2>
        <div className="mt-3 space-y-2">
          {quickSpecs.map((row) => (
            <div key={row.id} className="flex min-w-0 flex-wrap items-end gap-2">
              <AttributeLabelSelect
                value={row.label}
                presets={QUICK_SPEC_LABELS}
                disabled={disabled}
                onChange={(label) =>
                  setQuickSpecs((current) =>
                    current.map((item) => {
                      if (item.id !== row.id) return item;
                      return {
                        ...item,
                        label,
                        value: nextAttributeValue(item.label, label, item.value),
                      };
                    })
                  )
                }
              />
              <AttributeValueField
                label={row.label.trim() || "Material"}
                value={row.value}
                disabled={disabled}
                onChange={(value) =>
                  setQuickSpecs((current) =>
                    current.map((item) => (item.id === row.id ? { ...item, value } : item))
                  )
                }
              />
              <button
                type="button"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-edge"
                aria-label="Remover linha"
                disabled={disabled}
                onClick={() => setQuickSpecs((current) => current.filter((item) => item.id !== row.id))}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent"
            disabled={disabled}
            onClick={() =>
              setQuickSpecs((current) => [...current, { id: nextId("qs"), label: "Material", value: "" }])
            }
          >
            <FiPlus /> Linha da ficha rápida
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text">Especificações</h2>
        <div className="mt-3 space-y-4">
          {specGroups.map((group) => {
            const titleLocked = group.locked || isGroupLockedTitle(group.group);
            return (
              <div key={group.id} className="rounded-[10px] border border-edge p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  {titleLocked ? (
                    <p className="text-sm font-semibold text-text">{group.group}</p>
                  ) : (
                    <input
                      className="input"
                      value={group.group}
                      disabled={disabled}
                      onChange={(event) =>
                        setSpecGroups((current) =>
                          current.map((item) =>
                            item.id === group.id ? { ...item, group: event.target.value } : item
                          )
                        )
                      }
                    />
                  )}
                  <button
                    type="button"
                    className="shrink-0 text-sm font-semibold text-text hover:text-title"
                    disabled={disabled}
                    onClick={() =>
                      setSpecGroups((current) => current.filter((item) => item.id !== group.id))
                    }
                  >
                    Remover grupo
                  </button>
                </div>
                {group.items.map((row) => (
                  <div key={row.id} className="mb-2 flex min-w-0 flex-wrap items-end gap-2">
                    <AttributeLabelSelect
                      value={row.label}
                      presets={SPEC_LABELS}
                      disabled={disabled}
                      onChange={(label) =>
                        setSpecGroups((current) =>
                          current.map((item) =>
                            item.id === group.id
                              ? {
                                  ...item,
                                  items: item.items.map((spec) => {
                                    if (spec.id !== row.id) return spec;
                                    return {
                                      ...spec,
                                      label,
                                      value: nextAttributeValue(spec.label, label, spec.value),
                                    };
                                  }),
                                }
                              : item
                          )
                        )
                      }
                    />
                    <AttributeValueField
                      label={row.label.trim() || "Material"}
                      value={row.value}
                      disabled={disabled}
                      onChange={(value) =>
                        setSpecGroups((current) =>
                          current.map((item) =>
                            item.id === group.id
                              ? {
                                  ...item,
                                  items: item.items.map((spec) =>
                                    spec.id === row.id ? { ...spec, value } : spec
                                  ),
                                }
                              : item
                          )
                        )
                      }
                    />
                    <button
                      type="button"
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-edge"
                      aria-label="Remover item"
                      disabled={disabled}
                      onClick={() =>
                        setSpecGroups((current) =>
                          current.map((item) =>
                            item.id === group.id
                              ? { ...item, items: item.items.filter((spec) => spec.id !== row.id) }
                              : item
                          )
                        )
                      }
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-sm font-semibold text-accent"
                  disabled={disabled}
                  onClick={() =>
                    setSpecGroups((current) =>
                      current.map((item) =>
                        item.id === group.id
                          ? {
                              ...item,
                              items: [...item.items, { id: nextId("spec"), label: "Material", value: "" }],
                            }
                          : item
                      )
                    )
                  }
                >
                  + Item
                </button>
              </div>
            );
          })}
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent"
            disabled={disabled}
            onClick={() =>
              setSpecGroups((current) => [
                ...current,
                {
                  id: nextId("grp"),
                  group: "Informações gerais",
                  locked: true,
                  items: [{ id: nextId("spec"), label: "Material", value: "" }],
                },
              ])
            }
          >
            <FiPlus /> Grupo de especificações
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text">Estoque e frete</h2>
        <p className="field-hint mt-1">
          Peso e dimensões entram na cotação de frete. Se ainda forem estimados, pode deixar em branco.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="field-group">
            <label className="field-label" htmlFor="listing-stock">
              Estoque disponível
            </label>
            <input
              id="listing-stock"
              className={inputClass("stock")}
              inputMode="numeric"
              value={stock}
              onChange={(event) => {
                setStock(event.target.value.replace(/\D/g, ""));
                clearField("stock");
              }}
              disabled={disabled}
            />
            {fieldErrors.stock ? <p className="error-legend">{fieldErrors.stock}</p> : null}
          </div>
          <FormTextField
            id="listing-weight"
            label="Peso (g) — opcional"
            inputMode="numeric"
            value={weightG}
            onChange={(event) => setWeightG(event.target.value.replace(/\D/g, ""))}
            disabled={disabled}
          />
          <FormTextField
            id="listing-height"
            label="Altura (cm) — opcional"
            inputMode="numeric"
            value={heightCm}
            onChange={(event) => setHeightCm(event.target.value.replace(/\D/g, ""))}
            disabled={disabled}
          />
          <FormTextField
            id="listing-width"
            label="Largura (cm) — opcional"
            inputMode="numeric"
            value={widthCm}
            onChange={(event) => setWidthCm(event.target.value.replace(/\D/g, ""))}
            disabled={disabled}
          />
          <FormTextField
            id="listing-length"
            label="Comprimento (cm) — opcional"
            inputMode="numeric"
            value={lengthCm}
            onChange={(event) => setLengthCm(event.target.value.replace(/\D/g, ""))}
            disabled={disabled}
          />
          {fieldErrors.dimensions ? (
            <p className="error-legend sm:col-span-2">{fieldErrors.dimensions}</p>
          ) : null}
        </div>
      </section>

      {error ? (
        <p className="error-legend" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className="button button-accent" disabled={disabled}>
        {sending ? "Enviando…" : "Enviar para revisão"}
      </button>
    </form>
  );
}
