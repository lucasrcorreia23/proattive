# Filtro do site — perguntas para a Ariele

O filtro do Curso Brigadista já está funcionando com as regras do seu fluxo.
Abaixo, o que o fluxo não deixou claro. Cada item tem o que assumimos por
enquanto — se estiver certo, é só confirmar.

---

## Resolvido pelo fluxograma (board do Figma)

**1. Condomínio: qual é a regra? — RESOLVIDO.** O fluxograma fecha o ramo
Condomínio com *"Todo residencial é isento"* e *"Informar isenção, porém oferecer
link com desconto / Calcular uma pessoa por andar por torre"*. Então: condomínio
é **sempre** isento (não existe faixa de isenção nem população mínima) e a
quantidade que mostramos é uma **sugestão** de andares × torres, tudo no nível
Básico. Seu post-it confirma: 5 torres de 10 andares → 50 brigadistas sugeridos.

No site, o condomínio agora vê que está dispensado por lei, vê a quantidade
sugerida com o aviso de que é sugestão nossa (não exigência), e o botão continua
levando ao seu WhatsApp com a condição especial.

**2. Quantas pessoas contar por apartamento? — RESOLVIDO: não se conta.** Como a
conta do fluxograma é andares × torres, o filtro deixou de estimar população de
condomínio e o fator "pessoas por apartamento" saiu do código. A pergunta
"quantos apartamentos por andar" continua na tela — o fluxograma anota
*"(pode remover)"*, mas essa decisão é sua —; ela só não influencia mais o
resultado.

**3. O prédio horizontal tem regra diferente do vertical? — RESOLVIDO: não.** O
fluxograma diz *"todo residencial é isento"*, sem separar horizontal de vertical.
Não precisamos perguntar A-1 ou A-2; o filtro segue registrando o condomínio
como A-2.

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
