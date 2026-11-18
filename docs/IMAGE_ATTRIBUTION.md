# Imagens na landing (vendedor)

## Hero e seções com foto

As fotos padrão vêm do **[Pexels](https://www.pexels.com/license/)**: uso gratuito, inclusive comercial, **sem obrigação de creditar o fotógrafo** (atribuição é opcional).

IDs atuais (referência interna):

| Uso | Pexels photo ID |
|-----|-----------------|
| Hero | `4065156` |
| “No dia a dia da loja” | `7688336` |

## Substituir por arquivo próprio

Defina no Vercel ou `.env.local`:

- `VITE_LANDING_HERO_URL` — URL absoluta da imagem do hero
- `VITE_LANDING_WORK_URL` — imagem da seção operacional

Ou coloque arquivos em `public/landing/` e aponte as variáveis para `/landing/hero.jpg`.

## Ilustração SVG

`SellerHeroArt` é arte Recoll (sem terceiros).