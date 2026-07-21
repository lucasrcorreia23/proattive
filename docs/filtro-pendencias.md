# Filtro do Curso Brigadista — o que falta confirmar

O filtro está implementado a partir do `fluxo de filtro.pdf`. As 63 ocupações, os
limites de isenção, as razões de cálculo e os três níveis foram extraídos do
diagrama e conferidos pela geometria do arquivo (não por leitura visual).

O que está abaixo é o que o diagrama **não** responde. Cada item diz onde está no
código, o que assumimos provisoriamente e o risco de manter a suposição.

---

## 🔴 Bloqueia o ramo Condomínio

### 1. Regra da ocupação A-2 (multifamiliar vertical)

O ramo Condomínio do fluxo faz 3 perguntas (apartamentos por andar, blocos,
andares por bloco) e **termina sem regra**. A-1 e A-2 também não aparecem na
tabela de Empresas — o fluxo começa em A-3.

- **Precisamos de**: a partir de qual população o condomínio é isento, a razão
  (1 para cada quantos) e em que nível entra (Básico?).
- **Assumimos**: isento < 10, 1 para cada 20, Básico.
- **Onde**: `lib/quote-flow/occupancies.ts` → `CONDO_RULE`.
- **Risco**: hoje o número de brigadistas de condomínio é um chute. É o único
  desfecho do filtro que pode estar numericamente errado.

### 2. Quantas pessoas contar por apartamento

Para chegar na população usamos
`apartamentos × andares × blocos × pessoas por apartamento`.

- **Assumimos**: 2 pessoas por apartamento.
- **Onde**: `lib/quote-flow/occupancies.ts` → `PEOPLE_PER_APARTMENT`.

### 3. Condomínio horizontal (A-1) vs. vertical (A-2)

Hoje todo condomínio é tratado como **A-2**. Se a regra de A-1 for diferente, o
filtro precisa de mais uma pergunta para distinguir os dois.

---

## 🟡 Afetam o texto que o cliente lê

### 4. Descrições das ocupações

A captura do sistema do Corpo de Bombeiros cobre de **A-1 até F-1**. Essas estão
no ar com o texto exato. As outras 44 aparecem como
`"F-2 [local de reunião de público] descrição a confirmar"`.

Isso foi proposital: o cliente escolhe a ocupação **pela descrição**, e uma
descrição errada faz ele comprar o curso errado. Preferimos o placeholder.

- **Precisamos de**: o print (ou a lista) do restante do dropdown do sistema.
- **Onde**: `lib/quote-flow/occupancies.ts` → `LABELS`. É só preencher as strings.

### 5. Grupo K

O fluxo tem **K-1 e K-2**, mas o grupo K não existe na tabela de classificação
que conhecemos. Confirmar o que são — pode ser particularidade do CBMSC.

---

## 🟡 Confirmações do cálculo (respondidas, mas vale bater com a Ariele)

### 6. Fórmula acima da isenção

- **Implementado**: `teto((população − isenção) / N)`.
- Exemplo: D-1 (isento < 10, 1 para cada 15) com 40 funcionários →
  `teto((40−10)/15)` = **2 brigadistas**.
- A alternativa seria `teto(40/15)` = 3. Vale confirmar num caso real.

### 7. O que significam "50% / 50%" e "75% / 25%"

Aparecem em três ocupações e o diagrama não explica.

- **Implementado**: divide entre o nível do grupo e o **imediatamente superior**,
  seguindo a convenção do nó explícito do M-1 ("50% básico / 50% Intermediário"):
  - **I-2** → 50% Básico + 50% Intermediário
  - **I-3** → 75% Intermediário + 25% Avançado
  - **J-4** → 50% Intermediário + 50% Avançado
- **Consequência prática**: como I-3 e J-4 passam a envolver Avançado, esses dois
  casos **deixam de vender online** e vão para o WhatsApp (ver item 9). Se a
  interpretação estiver errada, são duas vendas indo para o atendimento à toa.
- **Onde**: `lib/quote-flow/occupancies.ts`.

### 8. Sobra do arredondamento

Numa brigada de 3 pessoas com divisão 75/25, quem fica com a sobra?

- **Implementado**: o nível de maior participação (3 Intermediário, 0 Avançado).

---

## 🟢 Decisões de negócio já aplicadas

### 9. Avançado não vende online

Conforme a sua nota no fluxo, qualquer resultado que envolva Avançado mostra
"Falar com a equipe" e abre o WhatsApp com ocupação e quantidade já na mensagem —
não oferece o link de compra.

### 10. Isento oferece desconto

Conforme o fluxo ("informar isenção, porém oferecer link com desconto"), o
resultado isento abre o WhatsApp.

- **Falta**: existe um link/cupom de desconto real para usar no lugar do WhatsApp?

### 11. Guia pós-compra

Sua nota no fluxo: *"após a compra do produto, enviar um guia com instruções e
dicas para seleção dos funcionários credenciados"*. Isso é entrega pós-venda,
fora do site — só registrando para não se perder.

---

## 🟢 Hotmart

### 12. Quantidade no checkout

O fluxo pede "apresentar link para a quantidade de acordo com o cálculo". O link
sai como `https://go.hotmart.com/R106034478B?quantity=N`.

- **Confirmar**: o produto está configurado na Hotmart para aceitar quantidade
  maior que 1? Se não estiver, o parâmetro é ignorado e o cliente compra 1 vaga
  quando precisava de 5.
- **Onde**: `lib/constants.ts` → `hotmartBrigadistaHref`.

### 13. Link de Carros Elétricos

`HOTMART_CARROS_ELETRICOS_HREF` continua vazio — o link novo é do Brigadista. O
CTA de Carros Elétricos ainda aponta para o WhatsApp.

### 14. Pessoa Física

A compra individual usa o mesmo link do Brigadista. Confirmar se é isso mesmo ou
se existe uma oferta separada para pessoa física.
