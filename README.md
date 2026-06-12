# Kekkin Andon（欠勤行灯）

> Dashboard de absenteísmo da fábrica em tempo quase-real, alimentado por uma planilha do Google Sheets. **Versionamento automático por commits** (v1.0.x — o patch é a contagem de commits do repositório).

**Kekkin** (欠勤) = ausência ao trabalho. **Andon** (行灯) = o painel luminoso do Sistema Toyota de Produção que torna o status da fábrica visível a todos. Este projeto é literalmente um *andon* de absenteísmo: KPIs, percentuais e gráficos das ausências dos colaboradores, atualizados automaticamente a partir da planilha de controle do RH/gestão.

---

## Como funciona

```
Google Sheets (BD FALTAS)                 ← planilha de controle (link restrito)
        │ export CSV (a cada 60s, com cache)
        ▼
backend/  KekkinAndon.API (ASP.NET Core 8) — porta 5050
        │ lê, normaliza e calcula os KPIs · esconde o link da planilha
        ▼ GET /api/dashboard?month=&shift=
frontend/ React 19 + TypeScript + Vite + Tailwind — porta 5173
        polling 60s · KPIs · gráficos (Recharts) · estética andon dark
```

- O **link da planilha nunca chega ao navegador** — só o backend o conhece (`appsettings.json`, fora do git).
- "Tempo real" = polling: o front consulta a API a cada 60s e a API mantém cache de 60s sobre a planilha (configurável).

## KPIs e visões

> 📊 **Cada indicador — fórmula, leitura e limitações — está detalhado em [INDICADORES.md](INDICADORES.md).**

| Visão | Conteúdo |
|---|---|
| KPIs | Taxa de absenteísmo (com selo saudável/atenção/crítico), dias de ausência, colaboradores distintos, sem justificativa, atestados, média de dias por colaborador |
| Tendência mensal | Barras de ausências (total + sem justificativa) e linha da taxa mensal |
| Por tipo | Donut da distribuição (atestado, declaração de horas, sem justificativa…) |
| Série diária | Área com as ausências dia a dia do período filtrado |
| Por turno | Participação ADM × 2ºT |
| Faltas injustificadas × medidas | Comparativo mensal com a **cobertura** de medidas disciplinares (advertência/suspensão/justa causa) sobre as faltas sem justificativa |
| Por gestor | Ranking horizontal |
| Reincidências | Top 10 colaboradores com mais dias de ausência |

Filtros: **mês**, **turno** e **colaborador** (visão individual via busca do header) — todos server-side.

### Taxa de absenteísmo — como é calculada

`taxa = dias de ausência ÷ (efetivo × dias úteis do período) × 100`

A planilha só registra **ausências** — o **efetivo total** (headcount) vem da configuração `Workforce:Headcount` do backend (default 600) ou do campo "Efetivo total" do próprio dashboard. **Ajuste para o número real da fábrica**; o valor usado aparece no rodapé dos filtros do dashboard.

## Como rodar

Pré-requisitos: .NET 8 SDK, Node 20+.

```bash
# Backend (porta 5050; Swagger em /swagger)
cd backend/KekkinAndon.API
dotnet run

# Frontend (porta 5173)
cd frontend
npm install
npm run dev
```

### Configuração do backend (`appsettings.json` — fora do git)

```json
"GoogleSheet": {
  "SpreadsheetId": "<id da planilha>",
  "Gid": "0",
  "DisciplinaryGid": "<gid da aba de medidas>",
  "CacheSeconds": 60
},
"Workforce": { "Headcount": 600 }
```

Modelo em `appsettings.example.json`. A planilha precisa estar compartilhada como **"qualquer pessoa com o link — leitor"** (o backend lê o CSV export sem credencial; o link é o segredo). Evolução futura: trocar por service account do Google para planilha 100% restrita — basta substituir o `GoogleSheetAbsenceClient`.

### Planilha esperada

**Aba de ausências (`BD FALTAS`, `Gid`)** — colunas, na ordem: `DATA DE PREENCHIMENTO · Matrícula · NOME · DATA AUSENCIA · TIPO · JUSTIFICATIVA · TURNO · GESTOR SISTEMA · LINHAS HOJE · DEVOLUTIVA · OBS: · MÊS ABREVIADO`. Uma linha = um dia de ausência de um colaborador. Datas em `dd/MM/yyyy`.

**Aba de medidas disciplinares (`RELATÓRIO SEMANAL - MEDIDAS`, `DisciplinaryGid`)** — colunas, na ordem: `DATA DA AUSÊNCIA · MATRI · NOME · TIPO · JUSTIFICATIVA · STATUS · OBS: · TURNO`. Uma linha = uma medida (advertência/suspensão/justa causa na coluna JUSTIFICATIVA); STATUS `CANCELADO` exclui a medida do cálculo de cobertura.

## Arquitetura

**Backend — Clean Architecture enxuta** (`backend/KekkinAndon.API`):

```
Controllers/  DashboardController            → GET /api/dashboard (month, shift, headcount, employee)
Services/     GoogleSheetAbsenceClient       → baixa e parseia o CSV da aba de ausências
              GoogleSheetDisciplinaryClient  → baixa e parseia o CSV da aba de medidas
              AbsenteeismAnalyticsService    → KPIs, tendências, rankings, cobertura (cache 60s)
              CsvLineParser                  → parser CSV com suporte a aspas
Models/       AbsenceRecord                  → domínio (IsUnjustified, IsMedical)
              DisciplinaryRecord             → domínio (IsApplied)
Dtos/         DashboardDto e satélites       → contrato da API (camelCase)
```

**Frontend — lógica em hooks, JSX só renderiza** (`frontend/src`):

```
hooks/dashboard/useDashboard.ts    → estado, filtros e polling
services/api/dashboardService.ts   → Axios
components/dashboard/              → header, filtros, KPIs, gráficos, tabela
components/ui/                     → Panel, Select
helpers/ · constants/ · types/     → formatação pt-BR, cores andon, contratos
animations/                        → variants do Framer Motion isolados
```

Convenções: TypeScript estrito sem `any`, sem comentários no código, pastas por domínio.

### Versionamento automático por commits

A versão exibida no footer **não é mantida manualmente** — é derivada do git a cada build/dev:

```
versão = {major}.{minor} (package.json) + {patch} = git rev-list --count HEAD
```

Implementação: o `vite.config.ts` resolve a versão e a injeta como a constante global `__APP_VERSION__` (via `define`), declarada em `src/vite-env.d.ts` e consumida pelo `Footer`. Sem git disponível (ex.: build a partir de um zip), cai no `version` do `package.json`. Cada commit incrementa o patch automaticamente; bumps de `major.minor` são feitos no `package.json`. Em dev, o número atualiza no próximo restart do `npm run dev`; no build de produção sai sempre exato.

## Limitações conhecidas (v1)

- Headcount é configuração manual, não vem da planilha.
- Aba `SPM HOJE` ainda não é consumida.
- Sem autenticação — pensado para rede interna/TV; não expor à internet sem proteção.
