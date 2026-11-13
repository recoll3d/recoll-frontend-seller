# Recoll — App do vendedor (`recoll-frontend-seller`)

Backlog vivo: ideias e compromissos que surgem no chat. **Marcar `[x]` ao entregar; não apagar itens — só atualizar status.**

---

## Decisões de produto (registradas)

- [ ] **Publicação de produto só após aprovação** da equipe/admin (nada visível ao comprador até aprovar).
- [ ] **Cadastro por etapas** (wizard), uma tela por vez — não um formulário único rolável.
- [ ] **Tipo vendedor cedo no fluxo:** pessoa física (CPF) vs empresa (CNPJ / MEI).
- [ ] **Conta vendedor** pode unificar login com app do usuário (mesmo e-mail) — detalhar na etapa “conta”.
- [ ] Marca **Recoll** (empresa); repos antigos com `3d` renomear **depois**, sem big-bang no meio do seller app.

---

## Fase 0 — Fundação (este projeto)

- [x] Repositório/pasta `recoll-frontend-seller` + stack Vite/React/Tailwind alinhada ao user.
- [x] Este arquivo de backlog.
- [x] Landing pública em `/` (referência Amazon/ML, visual Recoll).
- [x] Etapa 1 do cadastro: boas-vindas + termos (`/cadastro/termos`).
- [x] `.env.example` + README de dev (porta, API).
- [x] Entrar no `recoll-3d.code-workspace`.
- [ ] Deploy Vercel (subdomínio tipo `vendedores.recoll…` ou staging).

---

## Fase 1 — Cadastro vendedor (wizard, uma PR por tela)

| Etapa | Route (EN) | Status |
|-------|------------|--------|
| Termos + “vender na Recoll” | `/register/terms` | [x] UI |
| País (só Brasil) | `/register/country` | [ ] |
| PF vs empresa (CNPJ) | `/register/business-type` | [ ] |
| Conta (e-mail, senha) | `/register/account` | [ ] |
| Loja (nome público, slug) | `/register/store` | [ ] |
| Endereço de envio | `/register/shipping` | [ ] |
| Documento (CPF ou CNPJ) | `/register/tax-id` | [ ] |
| Revisão + enviar | `/register/review` | [ ] |

- [ ] **Backend:** `POST` cadastro vendedor + status `pending_approval`.
- [ ] **Verificar e-mail já existente** (usuário ou vendedor) na etapa conta.
- [ ] **Validação CPF/CNPJ** (dígitos + formato; consulta Receita/KYB depois).
- [ ] Persistir rascunho (sessionStorage → API depois).
- [ ] “Salvar e sair” (retomar cadastro).

---

## Fase 2 — Painel vendedor (pós-login)

- [ ] Dashboard `/painel` (substituir placeholder).
- [ ] Listar / criar / editar produtos.
- [ ] Pedidos do vendedor (somente leitura no MVP).
- [ ] Endereço de envio e dados fiscais (editar).
- [ ] Status da loja: rascunho | aguardando aprovação | ativa | suspensa.
- [ ] **Admin aprova loja** antes de primeiro produto ir ao ar (separado de aprovação por produto).

---

## Fase 3 — Marketplace / operações (já planejado em outros docs)

- [ ] Integração **Melhor Envio** self-service no painel vendedor (hoje só admin).
- [ ] Migração **Frenet** — aguardando `parcerias@frenet.com.br` ([plano backend](../recoll-3d-backend/docs/marketplace-frenet-migration.md)).
- [ ] `FRENET_PARTNER_TOKEN` no Render quando código + token existirem.
- [ ] `MARKETPLACE_SHIPPING_PROVIDER` só após flag no backend.

---

## Fase 4 — Landing e marketing (inspirado Amazon / Mercado Livre)

- [x] Hero + CTA “Começar a vender”.
- [ ] Bloco “3 motivos” (cards).
- [ ] FAQ em acordeão (PF/PJ, documentos, frete, aprovação).
- [ ] Prova social (depoimentos) — quando tiver cases reais.
- [ ] Link “Já vendo na Recoll” → login.
- [ ] Link para marketplace do **comprador** (app user).

---

## Fase 5 — Qualidade e padrões de formulário

Padrão igual ao app do usuário (`error-input`, `error-legend`, `field-group`, etc.):

- [x] Componente de campo reutilizável no seller app.
- [ ] Reaproveitar validadores compartilhados (extrair pacote ou copiar de user/admin).
- [ ] Testes e2e mínimos no wizard (opcional).
- [ ] A11y: labels, foco em erro, `aria-invalid`.

---

## Fase 6 — Renomeação GitHub / infra

- [ ] Renomear repos `recoll-3d-*` → `recoll-*` (checklist Vercel, Render, clones, CI).
- [ ] Atualizar URLs e documentação interna.

---

## Referências externas (onboarding)

- Amazon Seller Central BR — wizard PF/PJ, progresso, “Ignorar por enquanto”.
- Mercado Livre vendedores — landing + CTA + FAQ.
- [IdentiQ — onboarding marketplace](https://identiq.com.br/pt/blog/onboarding-marketplace-equilibrar-antifraude-e-conversao) — começar leve, KYC depois.

---

_Última atualização: iniciar seller app (landing + termos)._
