import { useMemo, useState, type FormEvent } from "react";

import { FormTextField } from "../forms/FormTextField";
import { createSellerProduct, type SellerProduct } from "../../services/sellerAccount";

const CATEGORIES = [
  "Produtos sustentáveis e reciclados",
  "Filamentos e materiais para impressão 3D",
] as const;

const MATERIALS = [
  "PLA reciclado",
  "PLA sustentável",
  "PETG reciclado",
  "Material compostável",
  "Outro",
] as const;

const QUICK_LABELS = ["Material", "Cor", "Peso", "Diâmetro", "Marca", "Condição", "Outro"] as const;
const SPEC_LABELS = [
  "Material",
  "Cor",
  "Peso",
  "Diâmetro",
  "Marca",
  "Condição",
  "Temperatura do bico",
  "Temperatura da mesa",
  "Compatibilidade",
  "Embalagem",
  "Outro",
] as const;

type Row = { id: string; label: string; value: string };
type SpecGroup = { id: string; group: string; items: Row[] };
type VariantOption = { id: string; name: string; swatchColor: string };

function nextId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseMoney(value: string) {
  const raw = value.trim().replace(/\s/g, "");
  if (!raw) return 0;
  const comma = raw.lastIndexOf(",");
  const dot = raw.lastIndexOf(".");
  let numeric = raw;
  if (comma > dot) numeric = raw.replace(/\./g, "").replace(",", ".");
  else if (comma !== -1) numeric = raw.replace(",", ".");
  const price = Number(numeric);
  return Number.isFinite(price) ? price : 0;
}

function isSustainable(category: string) {
  return category.toLowerCase().includes("sustent");
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
  const [categoryTag, setCategoryTag] = useState<string>(CATEGORIES[0]);
  const [priceBrl, setPriceBrl] = useState("");
  const [promo, setPromo] = useState("");
  const [biocoinPercent, setBiocoinPercent] = useState("0");
  const [highlights, setHighlights] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [material, setMaterial] = useState("");
  const [materialOther, setMaterialOther] = useState("");
  const [materialOrigin, setMaterialOrigin] = useState("");
  const [packaging, setPackaging] = useState("");
  const [certification, setCertification] = useState("");
  const [hasVariants, setHasVariants] = useState(false);
  const [axis, setAxis] = useState("Cor");
  const [axisCustom, setAxisCustom] = useState("");
  const [options, setOptions] = useState<VariantOption[]>([
    { id: nextId("opt"), name: "", swatchColor: "#05f283" },
  ]);
  const [quickSpecs, setQuickSpecs] = useState<Row[]>([
    { id: nextId("qs"), label: "Material", value: "" },
  ]);
  const [specGroups, setSpecGroups] = useState<SpecGroup[]>([
    {
      id: nextId("grp"),
      group: "Especificações técnicas",
      items: [{ id: nextId("spec"), label: "Material", value: "" }],
    },
  ]);
  const [stock, setStock] = useState("");
  const [weightG, setWeightG] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [widthCm, setWidthCm] = useState("");
  const [lengthCm, setLengthCm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const sustainable = isSustainable(categoryTag);
  const disabled = suspended || sending;
  const biocoinPreview = useMemo(() => {
    const price = Math.max(0, parseMoney(priceBrl) - parseMoney(promo));
    const percent = Math.min(100, Math.max(0, Number(biocoinPercent) || 0));
    const biocoins = Math.floor(price * percent);
    return biocoins;
  }, [biocoinPercent, priceBrl, promo]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token || disabled) return;
    const price = parseMoney(priceBrl);
    const discount = parseMoney(promo);
    if (name.trim().length < 2) {
      setError("Informe o nome do produto.");
      return;
    }
    if (description.trim().length < 10) {
      setError("Informe a descrição.");
      return;
    }
    if (price <= 0) {
      setError("Informe um preço válido maior que zero.");
      return;
    }
    if (discount > price) {
      setError("O desconto promocional não pode exceder o preço.");
      return;
    }
    const percent = Number(biocoinPercent);
    if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
      setError("Use um percentual de biocoins entre 0 e 100.");
      return;
    }

    setSending(true);
    setError(null);
    const variantLabel = axis === "Outro" ? axisCustom.trim() || "Variação" : axis;
    void createSellerProduct(token, {
      name,
      description,
      categoryTag,
      priceBrl,
      creditsDiscount: promo,
      biocoinDiscountPercent: biocoinPercent,
      stockAvailable: stock,
      weightG,
      heightCm,
      widthCm,
      lengthCm,
      images,
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
        setName("");
        setDescription("");
        setPriceBrl("");
        setPromo("");
        setHighlights("");
        setImages([]);
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
              onChange={(event) => setName(event.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="field-group sm:col-span-2">
            <label className="field-label" htmlFor="listing-description">
              Descrição
            </label>
            <textarea
              id="listing-description"
              className="input input-area"
              value={description}
              maxLength={4000}
              onChange={(event) => setDescription(event.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="listing-category">
              Categoria
            </label>
            <select
              id="listing-category"
              className="input select-input"
              value={categoryTag}
              onChange={(event) => setCategoryTag(event.target.value)}
              disabled={disabled}
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <FormTextField
            id="listing-price"
            label="Preço de venda (R$)"
            inputMode="decimal"
            placeholder="0,00"
            value={priceBrl}
            onChange={(event) => setPriceBrl(event.target.value)}
            disabled={disabled}
          />
          <FormTextField
            id="listing-promo"
            label="Desconto promocional (R$)"
            inputMode="decimal"
            hint="Valor fixo já aplicado na vitrine, antes das biocoins no checkout."
            value={promo}
            onChange={(event) => setPromo(event.target.value)}
            disabled={disabled}
          />
          <FormTextField
            id="listing-biocoin"
            label="Desconto máximo com biocoins (%)"
            inputMode="numeric"
            hint={`1 biocoin = R$ 0,01 · até ${biocoinPreview} biocoins sobre o preço após a promoção.`}
            value={biocoinPercent}
            onChange={(event) => setBiocoinPercent(event.target.value.replace(/[^\d]/g, ""))}
            disabled={disabled}
          />
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
        <p className="field-hint mt-1">JPG, PNG ou WEBP. A primeira imagem vira a capa.</p>
        <input
          className="mt-3 block text-sm text-text"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={disabled}
          onChange={(event) => setImages(Array.from(event.target.files ?? []).slice(0, 8))}
        />
        {images.length ? (
          <p className="mt-2 text-sm text-text">{images.length} imagem(ns) pronta(s) para envio.</p>
        ) : null}
      </section>

      {sustainable ? (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-text">Sustentabilidade</h2>
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
                {MATERIALS.map((option) => (
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
            <div className="field-group max-w-xs">
              <label className="field-label" htmlFor="listing-axis">
                Eixo
              </label>
              <select
                id="listing-axis"
                className="input select-input"
                value={axis}
                onChange={(event) => setAxis(event.target.value)}
                disabled={disabled}
              >
                <option value="Cor">Cor</option>
                <option value="Dimensão">Dimensão</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            {axis === "Outro" ? (
              <FormTextField
                id="listing-axis-custom"
                label="Nome da variação"
                value={axisCustom}
                onChange={(event) => setAxisCustom(event.target.value)}
                disabled={disabled}
              />
            ) : null}
            {options.map((option) => (
              <div key={option.id} className="flex flex-wrap items-end gap-3">
                <div className="min-w-[12rem] flex-1">
                  <FormTextField
                    id={`opt-${option.id}`}
                    label="Nome da opção"
                    value={option.name}
                    onChange={(event) =>
                      setOptions((current) =>
                        current.map((item) =>
                          item.id === option.id ? { ...item, name: event.target.value } : item
                        )
                      )
                    }
                    disabled={disabled}
                  />
                </div>
                {axis === "Cor" ? (
                  <label className="field-group">
                    <span className="field-label">Amostra</span>
                    <input
                      type="color"
                      className="h-14 w-14 cursor-pointer rounded-[9px] border border-edge bg-body"
                      value={option.swatchColor}
                      onChange={(event) =>
                        setOptions((current) =>
                          current.map((item) =>
                            item.id === option.id
                              ? { ...item, swatchColor: event.target.value }
                              : item
                          )
                        )
                      }
                      disabled={disabled}
                    />
                  </label>
                ) : null}
              </div>
            ))}
            <button
              type="button"
              className="text-sm font-semibold text-accent"
              onClick={() =>
                setOptions((current) => [
                  ...current,
                  { id: nextId("opt"), name: "", swatchColor: "#05f283" },
                ])
              }
              disabled={disabled}
            >
              Adicionar opção
            </button>
          </div>
        ) : null}
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text">Ficha rápida</h2>
        <div className="mt-3 space-y-3">
          {quickSpecs.map((row) => (
            <div key={row.id} className="grid gap-3 sm:grid-cols-[12rem_1fr_auto]">
              <select
                className="input select-input"
                value={row.label}
                onChange={(event) =>
                  setQuickSpecs((current) =>
                    current.map((item) =>
                      item.id === row.id ? { ...item, label: event.target.value } : item
                    )
                  )
                }
                disabled={disabled}
              >
                {QUICK_LABELS.map((label) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                className="input"
                value={row.value}
                onChange={(event) =>
                  setQuickSpecs((current) =>
                    current.map((item) =>
                      item.id === row.id ? { ...item, value: event.target.value } : item
                    )
                  )
                }
                disabled={disabled}
              />
              <button
                type="button"
                className="text-sm text-text"
                onClick={() => setQuickSpecs((current) => current.filter((item) => item.id !== row.id))}
                disabled={disabled}
              >
                Remover
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-sm font-semibold text-accent"
            onClick={() =>
              setQuickSpecs((current) => [...current, { id: nextId("qs"), label: "Material", value: "" }])
            }
            disabled={disabled}
          >
            Linha da ficha rápida
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text">Especificações</h2>
        <div className="mt-3 space-y-5">
          {specGroups.map((group) => (
            <div key={group.id} className="space-y-3">
              <FormTextField
                id={`group-${group.id}`}
                label="Grupo"
                value={group.group}
                onChange={(event) =>
                  setSpecGroups((current) =>
                    current.map((item) =>
                      item.id === group.id ? { ...item, group: event.target.value } : item
                    )
                  )
                }
                disabled={disabled}
              />
              {group.items.map((row) => (
                <div key={row.id} className="grid gap-3 sm:grid-cols-[12rem_1fr]">
                  <select
                    className="input select-input"
                    value={row.label}
                    onChange={(event) =>
                      setSpecGroups((current) =>
                        current.map((item) =>
                          item.id === group.id
                            ? {
                                ...item,
                                items: item.items.map((spec) =>
                                  spec.id === row.id ? { ...spec, label: event.target.value } : spec
                                ),
                              }
                            : item
                        )
                      )
                    }
                    disabled={disabled}
                  >
                    {SPEC_LABELS.map((label) => (
                      <option key={label} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <input
                    className="input"
                    value={row.value}
                    onChange={(event) =>
                      setSpecGroups((current) =>
                        current.map((item) =>
                          item.id === group.id
                            ? {
                                ...item,
                                items: item.items.map((spec) =>
                                  spec.id === row.id ? { ...spec, value: event.target.value } : spec
                                ),
                              }
                            : item
                        )
                      )
                    }
                    disabled={disabled}
                  />
                </div>
              ))}
              <button
                type="button"
                className="text-sm font-semibold text-accent"
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
                disabled={disabled}
              >
                Linha de especificação
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text">Estoque e frete</h2>
        <p className="field-hint mt-1">
          Peso e dimensões entram na cotação de frete. Se ainda forem estimados, pode deixar em branco.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <FormTextField
            id="listing-stock"
            label="Estoque disponível"
            inputMode="numeric"
            value={stock}
            onChange={(event) => setStock(event.target.value.replace(/\D/g, ""))}
            disabled={disabled}
          />
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
