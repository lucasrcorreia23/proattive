# Filtro do site — perguntas para a Ariele

O filtro do Curso Brigadista já está funcionando com as regras do seu fluxo.
Abaixo, o que o fluxo não deixou claro. Cada item tem o que assumimos por
enquanto — se estiver certo, é só confirmar.

---

## Precisa responder antes de publicar

**1. Condomínio: qual é a regra?**
No seu fluxo, o caminho do Condomínio faz as três perguntas (apartamentos por
andar, blocos, andares) e termina ali, sem dizer o que fazer com o resultado.

Precisamos de três coisas:
- Condomínio é isento até quantos moradores?
- Depois disso, 1 brigadista para cada quantos?
- Qual nível — Básico?

*Enquanto isso:* isento até 10, 1 para cada 20, nível Básico.
*Se estiver errado:* o número de brigadistas de todo condomínio sai errado.

**2. Quantas pessoas contar por apartamento?**
Para saber a população do condomínio, multiplicamos
apartamentos × andares × blocos × pessoas por apartamento.

*Enquanto isso:* 2 pessoas por apartamento.

**3. O prédio horizontal tem regra diferente do vertical?**
Hoje todo condomínio é tratado como vertical (A-2). Se casa geminada e
condomínio horizontal (A-1) tiverem regra diferente, o filtro precisa perguntar
qual dos dois é.

---

## Precisa da lista do sistema

**4. Faltam as descrições das ocupações.**
No print que você mandou, aparecem as descrições de A-1 até F-1 — essas já estão
no site com o texto exato. As outras 44 estão aparecendo como
*"F-2 — descrição a confirmar"*.

Deixamos assim de propósito: o cliente escolhe a ocupação pela descrição, e se a
gente escrever errado ele compra o curso errado. Melhor aparecer "a confirmar"
do que aparecer errado.

*Precisamos:* o print do dropdown inteiro do sistema do Corpo de Bombeiros.

**5. O que é o grupo K?**
Seu fluxo tem K-1 e K-2, mas esse grupo não aparece na tabela de classificação
que conhecemos. É alguma coisa específica de Santa Catarina?

---

## Confirmar a conta

**6. O cálculo está batendo?**
Fazemos assim: tira o número isento da população e divide o que sobra.

Exemplo — escritório (D-1), que é isento até 10 e pede 1 para cada 15:
uma empresa com **40 funcionários** dá **2 brigadistas**.
(40 − 10 = 30, dividido por 15 = 2)

A outra leitura possível seria dividir os 40 direto por 15, o que daria 3.
Confirma num caso real qual é o certo?

**7. O que significa "50% / 50%" e "75% / 25%"?**
Aparece em três ocupações e o fluxo não explica. Entendemos que é a divisão
entre o nível daquele grupo e o nível de cima:

| Ocupação | Entendemos que é |
|---|---|
| I-2 | metade Básico, metade Intermediário |
| I-3 | 75% Intermediário, 25% Avançado |
| J-4 | metade Intermediário, metade Avançado |

**Atenção:** por causa disso, I-3 e J-4 passaram a envolver Avançado — e
Avançado não vende pelo site, vai para o WhatsApp. Se a leitura estiver errada,
são duas ocupações caindo no seu atendimento sem precisar.

**8. Sobrou um brigadista na divisão — vai para qual nível?**
Se der 3 brigadistas numa divisão 75/25, hoje ficam 3 no Intermediário e nenhum
no Avançado. Está certo?

---

## Já está aplicado como você pediu

**9. Avançado não vende pelo site.** Conforme seu bilhete no fluxo, quando o
resultado envolve Avançado o botão vira "Falar com a equipe" e abre seu WhatsApp
com a ocupação e a quantidade já escritas na mensagem.

**10. Isento recebe oferta com desconto.** Conforme o fluxo, quem é isento vê
que está dispensado, mas recebe o convite para treinar mesmo assim.
*Pergunta:* existe um cupom ou link de desconto real para usar aí? Hoje abre o
WhatsApp.

**11. Guia pós-compra.** Seu bilhete diz para enviar um guia com instruções de
seleção dos funcionários depois da compra. Isso é fora do site — só anotando
para não se perder.

---

## Como está a venda de cada curso

| Curso | Para onde vai o botão |
|---|---|
| Brigadista | WhatsApp |
| Carros Elétricos | Hotmart (checkout direto) |
| Projeto Preventivo | WhatsApp |

**12. O Brigadista continua fechando no WhatsApp mesmo?**
Todo desfecho do filtro — isento, compra normal e Avançado — abre sua conversa
com a ocupação e a quantidade de brigadistas já escritas na mensagem. Você não
precisa perguntar nada, é só responder com o valor.

*Se um dia o Brigadista ganhar checkout próprio*, é só nos passar o link.

**13. Pessoa Física também vai para o WhatsApp.** Quem escolhe "Pessoa Física"
no filtro cai direto na sua conversa, sem responder as perguntas. Confirma que
é assim que você quer?
