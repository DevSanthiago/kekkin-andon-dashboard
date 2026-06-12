# Indicadores do Kekkin Andon

> Referência de todos os indicadores do dashboard: o que cada um mede, como é calculado e como interpretar. Os exemplos de leitura usam dados ilustrativos.

## Conceitos base

Antes dos indicadores, quatro conceitos que aparecem em quase todas as fórmulas:

| Conceito | Definição |
|---|---|
| **Dia de ausência** | Uma linha da aba `BD FALTAS` = um colaborador ausente em um dia. É a unidade básica de tudo. |
| **Período** | Intervalo entre a primeira e a última ausência do recorte filtrado (mês/turno). Aparece no rodapé dos filtros. |
| **Dias úteis** | Segundas a sextas dentro do período. Sábados e domingos ficam fora; feriados **não** são descontados. |
| **Efetivo (headcount)** | Total de colaboradores da fábrica. **Não vem da planilha** — vem da configuração `Workforce:Headcount` ou do campo "Efetivo total" do dashboard (persiste no navegador). |

A **capacidade** do período = efetivo × dias úteis — o total de dias-pessoa que a fábrica teria se ninguém faltasse. É o denominador da taxa de absenteísmo.

---

## KPIs (cards do topo)

### Taxa de absenteísmo

```
taxa = dias de ausência ÷ (efetivo × dias úteis do período) × 100
```

Percentual da capacidade da fábrica perdido com ausências. É o indicador principal do dashboard e ganha um selo de severidade andon:

| Selo | Faixa | Cor |
|---|---|---|
| SAUDÁVEL | < 2% | verde |
| ATENÇÃO | 2% a 3,5% | âmbar |
| CRÍTICO | ≥ 3,5% | vermelho |

**Leitura:** taxa de 3% com efetivo de 600 e 20 dias úteis = 360 dias-pessoa perdidos no mês.

**Atenção:** o número é tão bom quanto o efetivo informado. Com o efetivo errado, a taxa inteira desloca — confira o valor usado no rodapé dos filtros.

### Dias de ausência

Contagem bruta de linhas da `BD FALTAS` no recorte filtrado. O detalhe do card traz os **colaboradores distintos** envolvidos e a **média de dias por colaborador** (total ÷ distintos) — média alta com poucos distintos indica reincidência concentrada; média baixa com muitos distintos indica ausências pulverizadas.

### Sem justificativa

Dias de ausência cujo TIPO contém `SEM JUSTIFICATIVA` ou `ABANDONO`, com o percentual sobre o total. É o subconjunto mais crítico — são essas faltas que geram medida disciplinar (ver [comparativo](#comparativo-faltas-injustificadas--medidas-disciplinares)).

### Atestados médicos

Dias de ausência cujo TIPO contém `ATESTADO`, com o percentual sobre o total. Ausência justificada e legalmente abonada — não gera medida, mas o volume importa para a gestão (saúde ocupacional, epidemias, setores com sobrecarga).

---

## Gráficos e visões

### Tendência mensal

Barras com o total de ausências e o subconjunto sem justificativa, mês a mês, mais a linha da **taxa mensal** (eixo direito). A taxa de cada mês usa os dias úteis do mês inteiro como denominador.

**Nuance:** este gráfico mostra sempre **todos os meses** disponíveis — os filtros de mês/turno não o recortam (ele existe justamente para comparar meses). Na visão individual, passa a mostrar só os meses do colaborador.

### Por tipo (donut)

Distribuição percentual das ausências por TIPO (atestado, declaração de horas, sem justificativa, atraso, abandono…). Responde "de que natureza são as nossas ausências?".

### Série diária

Ausências dia a dia do período filtrado. Útil para enxergar padrões: picos em segundas/sextas, efeito de feriados prolongados, dias atípicos.

### Por turno

Participação de cada turno (ADM × 2ºT) nas ausências do recorte. Compare com a proporção real de pessoas por turno — um turno com 30% do efetivo e 50% das faltas merece investigação.

### Por gestor

Ranking dos gestores com mais dias de ausência nas suas equipes (top 12). Aponta onde concentrar a atuação — mas times maiores naturalmente somam mais ausências; o ranking é absoluto, não relativo ao tamanho da equipe.

### Reincidências

Top 10 colaboradores com mais dias de ausência no recorte, com turno e gestor. É a ponte para a ação individual: os primeiros nomes da lista são candidatos a acompanhamento, e a busca do header abre a visão individual de cada um.

---

## Comparativo: faltas injustificadas × medidas disciplinares

Cruza duas abas da planilha: as faltas sem justificativa da `BD FALTAS` e as medidas registradas na `RELATÓRIO SEMANAL - MEDIDAS` (advertência, suspensão, justa causa).

### Cobertura

```
cobertura = medidas aplicadas ÷ faltas injustificadas × 100
```

Mede se a gestão está **reagindo** às faltas sem justificativa — a regra da fábrica é que falta injustificada gera medida disciplinar; a cobertura mostra quanto disso está sendo cumprido.

- Medidas com STATUS `CANCELADO` ficam **fora** do cálculo (ex.: colaborador apresentou atestado fora do prazo e a medida foi revogada). O painel mostra quantas foram canceladas.
- "Faltas injustificadas" usa a mesma definição do KPI: TIPO contém `SEM JUSTIFICATIVA` ou `ABANDONO`.

| Cobertura | Leitura |
|---|---|
| ~100% | Processo disciplinar em dia: cada falta gerou medida. |
| Baixa | Faltas acumulando sem tratativa — gestão atrasada **ou** aba MEDIDAS desatualizada. |
| > 100% | Mais medidas que faltas no recorte. Normal em volumes pequenos: a medida é lançada com a data da ausência, mas a falta pode ter sido reclassificada depois na `BD FALTAS` (ex.: virou atestado), ou os registros das abas não batem 1:1. |

### Gráfico comparativo mensal

Barras de faltas injustificadas × medidas aplicadas por mês, com a linha de cobertura no eixo direito. Como a tendência mensal, mostra todos os meses (união dos meses das duas abas) — só a visão individual o recorta.

### Painel de medidas

Cobertura do recorte em destaque + distribuição das medidas aplicadas por tipo (advertência / suspensão / justa causa) + nota com as canceladas.

### Limitações deste indicador

- Depende da **disciplina de preenchimento** da aba MEDIDAS — medidas lançadas com atraso derrubam a cobertura do mês corrente artificialmente.
- Não há vínculo registro-a-registro entre as abas: a comparação é por contagem no período, não por rastreio de cada falta à sua medida.

---

## Visão individual

A busca do header (nome ou matrícula) recorta **todo o dashboard** para um colaborador:

- Matrícula casa por igualdade exata; nome casa por "contém", sem distinguir acentos.
- O efetivo do denominador vira 1, mas os **dias úteis continuam sendo os do período global** — a taxa individual responde "de quantos dias úteis do período essa pessoa faltou?", e não colapsa para 100% quando todas as faltas caem num intervalo curto.
- A FilterBar esconde o campo de efetivo e indica a base de cálculo.

---

## Filtros e atualização

- **Mês** e **turno** recortam tudo server-side, exceto os dois gráficos mensais (que sempre comparam meses).
- Os dados se renovam sozinhos: o front consulta a API a cada 60s e a API mantém cache de 60s sobre a planilha — uma edição na planilha aparece no dashboard em até ~2 minutos.
