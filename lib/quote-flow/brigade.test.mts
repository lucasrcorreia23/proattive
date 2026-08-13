/**
 * Testes das regras do fluxo de filtro.
 *
 * Rodar com: npm test
 * (Node 24 executa TypeScript direto, sem build nem dependência extra.)
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  computeCompanyBrigade,
  computeCondoBrigade,
  computeTunnelBrigade,
  MINIMUM_BRIGADE_MEMBERS,
  splitByLevel,
} from "./brigade.ts";
import { FLOW_STEPS } from "./config.ts";
import { COMPANY_OCCUPANCIES, OCCUPANCIES } from "./occupancies.ts";
import {
  buildPessoaFisicaResult,
  buildQuoteResult,
  MINIMUM_BRIGADE_NOTICE,
} from "./result.ts";
import { HOTMART_BRIGADISTA_HREF } from "../constants.ts";

describe("isenção", () => {
  it("é isento abaixo do limite da ocupação", () => {
    // D-1: isento ≤ 10.
    assert.equal(computeCompanyBrigade("D-1", 9).exempt, true);
  });

  it("é isento exatamente no limite da ocupação", () => {
    // O número do Figma é a população máxima para isenção (inclusiva).
    const result = computeCompanyBrigade("D-1", 10);
    assert.equal(result.exempt, true, "no limite ainda é isento");
    assert.equal(result.total, 0);
    assert.equal(result.minimumApplied, false);
  });

  it("deixa de ser isento acima do limite", () => {
    // D-1: isento ≤ 10 → com 11 já há exigência de brigada.
    const result = computeCompanyBrigade("D-1", 11);
    assert.equal(result.exempt, false, "acima do limite há exigência de brigada");
    // teto(11/15) = 1, elevado ao piso legal de 3 (Art. 16 da IN 28, § 2º).
    assert.equal(result.total, 3);
    assert.equal(result.minimumApplied, true);
  });

  it("J-1, M-4 e M-11 são isentos em qualquer população", () => {
    for (const code of ["J-1", "M-4", "M-11"]) {
      assert.equal(computeCompanyBrigade(code, 5000).exempt, true, code);
    }
  });
});

describe("razão teto(população / N) — a isenção não é subtraída", () => {
  it("caso da Ariele: D-1 com 40 funcionários → 3 Básico", () => {
    // "1 a cada 15 funcionários daria 2,66 brigadista, arredondando para 3."
    const result = computeCompanyBrigade("D-1", 40);
    assert.equal(result.total, 3); // teto(40/15) = teto(2,66)
    assert.deepEqual(result.breakdown, [{ level: "basico", count: 3 }]);
    assert.equal(result.minimumApplied, false, "a conta já deu 3 sozinha");
  });

  it("caso da Ariele: I-2 com 80 funcionários → 8 (4 Básico + 4 Intermediário)", () => {
    // "vai precisar de um brigadista a cada 10 ou seja, vai precisar de 8 brigadistas"
    const result = computeCompanyBrigade("I-2", 80);
    assert.equal(result.total, 8); // teto(80/10)
    assert.deepEqual(result.breakdown, [
      { level: "basico", count: 4 },
      { level: "intermediario", count: 4 },
    ]);
    assert.equal(result.requiresQuote, false);
    assert.equal(result.minimumApplied, false);
  });

  it("arredonda para cima", () => {
    // M-3: isento ≤ 5, 1 para cada 15 → teto(46/15) = teto(3,06) = 4.
    // Acima do piso de 3, para o arredondamento aparecer sozinho no resultado.
    assert.equal(computeCompanyBrigade("M-3", 46).total, 4);
    assert.equal(computeCompanyBrigade("M-3", 46).minimumApplied, false);
  });

  it("F-7 usa a razão mais severa (1 para cada 5)", () => {
    // teto(25/5) = 5, nível Intermediário
    const result = computeCompanyBrigade("F-7", 25);
    assert.equal(result.total, 5);
    assert.deepEqual(result.breakdown, [{ level: "intermediario", count: 5 }]);
  });
});

describe("percentual da população fixa", () => {
  it("L-1 → 50% da população, sem isenção", () => {
    const result = computeCompanyBrigade("L-1", 40);
    assert.equal(result.exempt, false);
    assert.equal(result.total, 20);
    assert.deepEqual(result.breakdown, [{ level: "basico", count: 20 }]);
  });

  it("M-2 → 75% da população", () => {
    assert.equal(computeCompanyBrigade("M-2", 40).total, 30);
  });

  it("L-2 é Avançado e exige orçamento à parte", () => {
    const result = computeCompanyBrigade("L-2", 20);
    assert.equal(result.total, 15);
    assert.equal(result.requiresQuote, true);
    assert.deepEqual(result.breakdown, [{ level: "avancado", count: 15 }]);
  });
});

describe("divisão entre níveis", () => {
  it("I-2 divide 50/50 entre Básico e Intermediário", () => {
    // teto(30/10) = 3 → a sobra ímpar fica com o Básico
    const result = computeCompanyBrigade("I-2", 30);
    assert.equal(result.total, 3);
    assert.deepEqual(result.breakdown, [
      { level: "basico", count: 2 },
      { level: "intermediario", count: 1 },
    ]);
    assert.equal(result.requiresQuote, false);
  });

  it("I-3 divide 75/25 entre Intermediário e Avançado", () => {
    // teto(50/10) = 5 → 4 + 1
    const result = computeCompanyBrigade("I-3", 50);
    assert.equal(result.total, 5);
    assert.deepEqual(result.breakdown, [
      { level: "intermediario", count: 4 },
      { level: "avancado", count: 1 },
    ]);
    assert.equal(result.requiresQuote, true);
  });

  it("a sobra do arredondamento vai para o nível de maior participação", () => {
    assert.deepEqual(splitByLevel(3, [
      { level: "intermediario", share: 0.75 },
      { level: "avancado", share: 0.25 },
    ]), [
      { level: "intermediario", count: 3 },
      { level: "avancado", count: 0 },
    ].filter((entry) => entry.count > 0));
  });

  it("a soma da divisão sempre fecha com o total", () => {
    for (let total = 1; total <= 50; total += 1) {
      const breakdown = splitByLevel(total, [
        { level: "intermediario", share: 0.5 },
        { level: "avancado", share: 0.5 },
      ]);
      const sum = breakdown.reduce((acc, entry) => acc + entry.count, 0);
      assert.equal(sum, total, `total ${total}`);
    }
  });
});

describe("M-1 (túnel)", () => {
  it("até 200 m é isento — e isento não recebe piso", () => {
    const result = computeTunnelBrigade(200);
    assert.equal(result.exempt, true);
    assert.equal(result.total, 0);
    assert.equal(result.minimumApplied, false);
  });

  it("de 200 a 500 m: a faixa prevê 02, mas o piso legal leva a 3 Básico", () => {
    const result = computeTunnelBrigade(400);
    assert.equal(result.total, 3);
    assert.deepEqual(result.breakdown, [{ level: "basico", count: 3 }]);
    assert.equal(result.minimumApplied, true);
    assert.equal(result.exempt, false);
  });

  it("de 500 a 1.000 m: 02 da faixa viram 3, divididos 50/50", () => {
    const result = computeTunnelBrigade(800);
    assert.equal(result.total, 3);
    // Mesma regra de divisão de sempre: a sobra ímpar fica com o Básico.
    assert.deepEqual(result.breakdown, [
      { level: "basico", count: 2 },
      { level: "intermediario", count: 1 },
    ]);
    assert.equal(result.minimumApplied, true);
  });

  it("acima de 1.000 m → 02 + 1 a cada 1.000 m, Intermediário", () => {
    assert.equal(computeTunnelBrigade(1500).total, 3);
    assert.equal(computeTunnelBrigade(2000).total, 3);
    assert.equal(computeTunnelBrigade(2001).total, 4);
    assert.deepEqual(computeTunnelBrigade(1500).breakdown, [
      { level: "intermediario", count: 3 },
    ]);
    // A conta já dá 3 nessa faixa: o piso não entra, logo não há aviso.
    assert.equal(computeTunnelBrigade(1500).minimumApplied, false);
    assert.equal(computeTunnelBrigade(2001).minimumApplied, false);
  });
});

describe("condomínio", () => {
  it("é sempre isento e sugere 1 brigadista por andar, por torre", () => {
    // Fluxograma: "Todo residencial é isento" + "calcular uma pessoa por andar
    // por torre" → 10 andares × 2 torres = 20 sugeridos, tudo Básico.
    const result = computeCondoBrigade({ andaresPorBloco: 10, blocos: 2 });
    assert.equal(result.exempt, true);
    assert.equal(result.total, 20);
    assert.deepEqual(result.breakdown, [{ level: "basico", count: 20 }]);
    assert.equal(result.requiresQuote, false);
    assert.equal(result.occupancyCode, "A-2");
    assert.equal(result.population, undefined, "o fluxo não estima moradores");
  });

  it("caso da Ariele: 5 torres de 10 andares → 50 brigadistas sugeridos", () => {
    const result = computeCondoBrigade({ andaresPorBloco: 10, blocos: 5 });
    assert.equal(result.exempt, true);
    assert.equal(result.total, 50);
    assert.deepEqual(result.breakdown, [{ level: "basico", count: 50 }]);
    assert.equal(result.minimumApplied, false);
  });

  it("o piso legal de 3 não vale para condomínio: a sugestão pode ser menor", () => {
    // 1 torre de 1 andar = 1 sugerido. Não há exigência de brigada aqui, então
    // o piso do Art. 16 ("quando houver a exigência") não se aplica.
    const result = computeCondoBrigade({ andaresPorBloco: 1, blocos: 1 });
    assert.equal(result.exempt, true);
    assert.equal(result.total, 1, "sugestão comercial, não exigência legal");
    assert.equal(result.minimumApplied, false);
    assert.equal(
      buildQuoteResult({
        perfil: "condominio",
        andares_por_bloco: "1",
        blocos_por_torre: "1",
      }).notice,
      undefined,
      "condomínio nunca recebe o aviso normativo",
    );
  });

  it("o passo do condomínio só pergunta blocos e andares", () => {
    // A pergunta de apartamentos por andar foi removida a pedido do cliente:
    // não entrava na conta (1 brigadista por andar, por torre).
    const ids = FLOW_STEPS["step-2-condominio"].fields.map((field) => field.id);
    assert.deepEqual(ids, ["perfil", "blocos_por_torre", "andares_por_bloco"]);
  });

  it("desfecho mostra a isenção e a sugestão ao mesmo tempo", () => {
    const result = buildQuoteResult({
      perfil: "condominio",
      andares_por_bloco: "10",
      blocos_por_torre: "5",
    });
    assert.equal(result.variant, "exemption");
    assert.equal(result.brigade?.total, 50);
    // O modal só exibe a contagem de um isento com este flag.
    assert.equal(result.showBrigadeCount, true);
    assert.match(result.info ?? "", /dispensado de constituir brigada/);
    assert.match(result.text ?? "", /sugestão nossa, não uma exigência legal/);
    assert.equal(
      result.summary.some((item) => item.label === "População estimada"),
      false,
      "não inventamos população de condomínio",
    );
    // Isento compra avulso: link de inscrição única da Hotmart, não WhatsApp.
    assert.equal(result.ctaHref, HOTMART_BRIGADISTA_HREF);
    // Isento não tem exigência nenhuma: nada de aviso de mínimo de 3.
    assert.equal(result.notice, undefined);
  });
});

describe("resultado exibido ao cliente", () => {
  it("ocupação sempre isenta não inventa população nem fala em população", () => {
    const result = buildQuoteResult({ perfil: "empresa", ocupacao: "J-1" });
    assert.equal(result.variant, "exemption");
    assert.equal(
      result.summary.some((item) => item.label === "Funcionários"),
      false,
      "J-1 nunca pergunta funcionários, então não pode exibir o campo",
    );
    assert.match(result.info ?? "", /independente da população/);
  });

  it("isenção por limite menciona a população informada", () => {
    const result = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "D-1",
      qtd_funcionarios: "9",
    });
    assert.equal(result.variant, "exemption");
    assert.deepEqual(
      result.summary.find((item) => item.label === "Funcionários"),
      { label: "Funcionários", value: "9" },
    );
  });

  it("isento de empresa vai para o link de compra única da Hotmart", () => {
    const result = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "D-1",
      qtd_funcionarios: "9",
    });
    assert.equal(result.ctaHref, HOTMART_BRIGADISTA_HREF);
    assert.equal(result.notice, undefined, "isento não recebe aviso de mínimo");
  });

  it("Pessoa Física vai direto para o link de compra única da Hotmart", () => {
    const result = buildPessoaFisicaResult();
    assert.equal(result.ctaHref, HOTMART_BRIGADISTA_HREF);
    assert.equal(result.variant, "purchase");
  });

  it("turma obrigatória continua no WhatsApp da Ariele", () => {
    const result = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "D-1",
      qtd_funcionarios: "40",
    });
    assert.equal(result.variant, "purchase");
    assert.match(result.ctaHref, /^https:\/\/wa\.me\//);
    // A quantidade calculada precisa chegar escrita na mensagem da Ariele.
    assert.match(decodeURIComponent(result.ctaHref), /3 brigadista\(s\): 3 Básico/);
  });

  it("a mensagem da Ariele leva o número JÁ com o piso aplicado", () => {
    // D-1 com 11: a conta dá 1, a tela mostra 3 — a mensagem tem que dizer 3.
    const compra = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "D-1",
      qtd_funcionarios: "11",
    });
    const compraText = decodeURIComponent(compra.ctaHref);
    assert.match(compraText, /preciso de 3 brigadista\(s\): 3 Básico/);
    assert.equal(/preciso de 1 brigadista/.test(compraText), false);

    // Mesma coisa no desfecho de orçamento (Avançado): M-9 com 12 dá 2 → 3.
    const orcamento = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "M-9",
      qtd_funcionarios: "12",
    });
    assert.equal(orcamento.variant, "quote");
    assert.match(
      decodeURIComponent(orcamento.ctaHref),
      /preciso de 3 brigadista\(s\): 3 Avançado/,
    );

    // E no túnel de 400 m, que a faixa dimensionava em 02.
    const tunel = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "M-1",
      metros_tunel: "400",
    });
    assert.match(decodeURIComponent(tunel.ctaHref), /preciso de 3 brigadista\(s\): 3 Básico/);
  });

  it("Avançado não vende online: cai no WhatsApp", () => {
    const result = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "L-2",
      qtd_funcionarios: "20",
    });
    assert.equal(result.variant, "quote");
    assert.match(result.ctaHref, /^https:\/\/wa\.me\//);
  });
});

describe("piso legal de 3 brigadistas (Art. 16, § 2º da IN 28)", () => {
  it("o piso é 3", () => {
    assert.equal(MINIMUM_BRIGADE_MEMBERS, 3);
  });

  it("cálculo que dá 1 vira 3 e carrega o aviso", () => {
    // D-1 com 11 funcionários: teto(11/15) = 1 brigadista.
    const result = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "D-1",
      qtd_funcionarios: "11",
    });
    assert.equal(result.brigade?.exempt, false);
    assert.equal(result.brigade?.total, 3, "o número exibido é o mínimo legal");
    assert.deepEqual(result.brigade?.breakdown, [{ level: "basico", count: 3 }]);
    assert.equal(result.brigade?.minimumApplied, true);
    assert.equal(result.notice, MINIMUM_BRIGADE_NOTICE);
    assert.match(result.notice ?? "", /Art\. 16 da IN 28, § 2º/);
    assert.match(result.notice ?? "", /independente do previsto no caput/);
  });

  it("cálculo que dá 2 vira 3 e carrega o aviso", () => {
    // M-3: isento ≤ 5, 1 a cada 15 → teto(21/15) = 2.
    const result = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "M-3",
      qtd_funcionarios: "21",
    });
    assert.equal(result.brigade?.exempt, false);
    assert.equal(result.brigade?.total, 3);
    assert.deepEqual(result.brigade?.breakdown, [{ level: "basico", count: 3 }]);
    assert.equal(result.brigade?.minimumApplied, true);
    assert.equal(result.notice, MINIMUM_BRIGADE_NOTICE);
  });

  it("o piso também vale para a regra de percentual", () => {
    // L-1: 50% da população fixa, sem isenção → teto(4 × 0,5) = 2.
    const result = computeCompanyBrigade("L-1", 4);
    assert.equal(result.exempt, false);
    assert.equal(result.total, 3);
    assert.equal(result.minimumApplied, true);
  });

  it("cálculo que já dá exatamente 3 continua 3, sem aviso", () => {
    const result = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "D-1",
      qtd_funcionarios: "40",
    });
    assert.equal(result.brigade?.total, 3);
    assert.equal(result.brigade?.minimumApplied, false);
    assert.equal(result.notice, undefined);
  });

  it("cálculo que dá 8 continua 8, sem aviso", () => {
    const result = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "I-2",
      qtd_funcionarios: "80",
    });
    assert.equal(result.brigade?.total, 8, "o piso não mexe em quem já passa dele");
    assert.deepEqual(result.brigade?.breakdown, [
      { level: "basico", count: 4 },
      { level: "intermediario", count: 4 },
    ]);
    assert.equal(result.brigade?.minimumApplied, false);
    assert.equal(result.notice, undefined);
  });

  it("isento continua com 0, sem piso e sem aviso", () => {
    // O piso só existe "quando houver a exigência de brigadista orgânico".
    const porLimite = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "D-1",
      qtd_funcionarios: "9",
    });
    assert.equal(porLimite.variant, "exemption");
    assert.equal(porLimite.brigade?.total, 0);
    assert.deepEqual(porLimite.brigade?.breakdown, []);
    assert.equal(porLimite.brigade?.minimumApplied, false);
    assert.equal(porLimite.notice, undefined);

    const sempreIsento = buildQuoteResult({ perfil: "empresa", ocupacao: "J-1" });
    assert.equal(sempreIsento.variant, "exemption");
    assert.equal(sempreIsento.brigade?.total, 0);
    assert.equal(sempreIsento.notice, undefined);

    // Túnel curto também é isento: nada de piso.
    const tunelCurto = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "M-1",
      metros_tunel: "150",
    });
    assert.equal(tunelCurto.variant, "exemption");
    assert.equal(tunelCurto.brigade?.total, 0);
    assert.equal(tunelCurto.notice, undefined);
  });

  it("condomínio 5 torres × 10 andares continua 50, isento e sem aviso", () => {
    const result = buildQuoteResult({
      perfil: "condominio",
      andares_por_bloco: "10",
      blocos_por_torre: "5",
    });
    assert.equal(result.brigade?.exempt, true);
    assert.equal(result.brigade?.total, 50);
    assert.equal(result.brigade?.minimumApplied, false);
    assert.equal(result.notice, undefined);
  });

  it("túnel de 400 m (faixa de 02) sobe para 3", () => {
    const result = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "M-1",
      metros_tunel: "400",
    });
    assert.equal(result.brigade?.exempt, false);
    assert.equal(result.brigade?.total, 3);
    assert.equal(result.brigade?.minimumApplied, true);
    assert.equal(result.notice, MINIMUM_BRIGADE_NOTICE);
  });

  it("redistribui os níveis sobre o total elevado, somando 3", () => {
    // I-2 com 11 funcionários: teto(11/10) = 2 → piso eleva a 3, divididos
    // pelos MESMOS shares (50/50).
    const result = computeCompanyBrigade("I-2", 11);
    assert.equal(result.total, 3);
    assert.deepEqual(result.breakdown, [
      { level: "basico", count: 2 },
      { level: "intermediario", count: 1 },
    ]);
    const soma = result.breakdown.reduce((acc, entry) => acc + entry.count, 0);
    assert.equal(soma, 3, "o breakdown precisa fechar com o total exibido");
    assert.equal(result.minimumApplied, true);
  });

  it("também avisa no desfecho de orçamento (nível Avançado)", () => {
    // M-9: isento ≤ 5, 1 a cada 10, tudo Avançado → teto(12/10) = 2 → 3.
    const result = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "M-9",
      qtd_funcionarios: "12",
    });
    assert.equal(result.variant, "quote");
    assert.equal(result.brigade?.total, 3);
    assert.deepEqual(result.brigade?.breakdown, [{ level: "avancado", count: 3 }]);
    assert.equal(result.notice, MINIMUM_BRIGADE_NOTICE);
  });

  it("o piso pode fazer surgir o nível Avançado e mandar o caso para orçamento", () => {
    // J-4 (isento ≤ 5, 1 a cada 10, 50% Intermediário / 50% Avançado) com 10
    // funcionários: a conta dava 1, que caía todo no Intermediário e vendia
    // online. Com 3, a metade Avançado aparece — e Avançado é presencial.
    const result = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "J-4",
      qtd_funcionarios: "10",
    });
    assert.equal(result.brigade?.total, 3);
    assert.deepEqual(result.brigade?.breakdown, [
      { level: "intermediario", count: 2 },
      { level: "avancado", count: 1 },
    ]);
    assert.equal(result.brigade?.requiresQuote, true);
    assert.equal(result.variant, "quote");
    assert.equal(result.notice, MINIMUM_BRIGADE_NOTICE);
  });

  it("o aviso explica o número exibido, sem contradizê-lo", () => {
    // Regressão do bug que motivou a mudança: o texto não pode mandar formar um
    // número diferente do que está na tela.
    assert.match(
      MINIMUM_BRIGADE_NOTICE,
      /A quantidade foi definida como 3 pois a norma estabelece este número como o mínimo exigido/,
    );
    assert.match(
      MINIMUM_BRIGADE_NOTICE,
      /“Quando houver a exigência de brigadista orgânico, o número mínimo a ser implementado será de 03 \(três\) brigadistas orgânicos, independente do previsto no caput deste artigo\.”/,
    );
  });
});

describe("integridade da tabela", () => {
  it("cobre as 63 ocupações do fluxo, sem código repetido", () => {
    assert.equal(OCCUPANCIES.length, 63);
    assert.equal(new Set(OCCUPANCIES.map((item) => item.code)).size, 63);
  });

  it("o ramo Empresas não oferece A-1/A-2", () => {
    const codes = COMPANY_OCCUPANCIES.map((item) => item.code);
    assert.equal(codes.includes("A-1"), false);
    assert.equal(codes.includes("A-2"), false);
    assert.equal(codes.includes("A-3"), true);
  });

  it("toda divisão de níveis soma 100%", () => {
    for (const item of OCCUPANCIES) {
      if (item.rule.kind !== "ratio" && item.rule.kind !== "percent") continue;
      const sum = item.rule.levels.reduce((acc, entry) => acc + entry.share, 0);
      assert.equal(sum, 1, item.code);
    }
  });
});
