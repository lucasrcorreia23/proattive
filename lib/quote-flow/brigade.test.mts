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
  splitByLevel,
} from "./brigade.ts";
import { COMPANY_OCCUPANCIES, OCCUPANCIES } from "./occupancies.ts";
import { buildQuoteResult } from "./result.ts";

describe("isenção", () => {
  it("é isento abaixo do limite da ocupação", () => {
    // D-1: isento < 10.
    assert.equal(computeCompanyBrigade("D-1", 9).exempt, true);
  });

  it("deixa de ser isento exatamente no limite", () => {
    const result = computeCompanyBrigade("D-1", 10);
    assert.equal(result.exempt, true, "no limite, (10-10)/15 = 0 brigadistas");
    assert.equal(result.total, 0);
  });

  it("J-1, M-4 e M-11 são isentos em qualquer população", () => {
    for (const code of ["J-1", "M-4", "M-11"]) {
      assert.equal(computeCompanyBrigade(code, 5000).exempt, true, code);
    }
  });
});

describe("razão teto((população − isenção) / N)", () => {
  it("D-1 com 40 funcionários → 2 Básico", () => {
    const result = computeCompanyBrigade("D-1", 40);
    assert.equal(result.total, 2); // teto((40-10)/15)
    assert.deepEqual(result.breakdown, [{ level: "basico", count: 2 }]);
  });

  it("arredonda para cima", () => {
    // M-3: isento < 5, 1 para cada 15 → teto((21-5)/15) = teto(1,07) = 2
    assert.equal(computeCompanyBrigade("M-3", 21).total, 2);
  });

  it("F-7 usa a razão mais severa (1 para cada 5)", () => {
    // teto((25-5)/5) = 4, nível Intermediário
    const result = computeCompanyBrigade("F-7", 25);
    assert.equal(result.total, 4);
    assert.deepEqual(result.breakdown, [{ level: "intermediario", count: 4 }]);
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
    // teto((30-10)/10) = 2
    const result = computeCompanyBrigade("I-2", 30);
    assert.equal(result.total, 2);
    assert.deepEqual(result.breakdown, [
      { level: "basico", count: 1 },
      { level: "intermediario", count: 1 },
    ]);
    assert.equal(result.requiresQuote, false);
  });

  it("I-3 divide 75/25 entre Intermediário e Avançado", () => {
    // teto((50-10)/10) = 4 → 3 + 1
    const result = computeCompanyBrigade("I-3", 50);
    assert.equal(result.total, 4);
    assert.deepEqual(result.breakdown, [
      { level: "intermediario", count: 3 },
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
  it("até 200 m é isento", () => {
    assert.equal(computeTunnelBrigade(200).exempt, true);
  });

  it("de 200 a 500 m → 2 brigadistas Básico", () => {
    const result = computeTunnelBrigade(400);
    assert.equal(result.total, 2);
    assert.deepEqual(result.breakdown, [{ level: "basico", count: 2 }]);
  });

  it("de 500 a 1.000 m → 2 brigadistas, metade Básico metade Intermediário", () => {
    const result = computeTunnelBrigade(800);
    assert.equal(result.total, 2);
    assert.deepEqual(result.breakdown, [
      { level: "basico", count: 1 },
      { level: "intermediario", count: 1 },
    ]);
  });

  it("acima de 1.000 m → 02 + 1 a cada 1.000 m, Intermediário", () => {
    assert.equal(computeTunnelBrigade(1500).total, 3);
    assert.equal(computeTunnelBrigade(2000).total, 3);
    assert.equal(computeTunnelBrigade(2001).total, 4);
    assert.deepEqual(computeTunnelBrigade(1500).breakdown, [
      { level: "intermediario", count: 3 },
    ]);
  });
});

describe("condomínio", () => {
  it("multiplica apartamentos × andares × blocos × fator de ocupação", () => {
    // 4 × 10 × 2 × 2 pessoas = 160 → teto((160-10)/20) = 8
    const result = computeCondoBrigade({
      apartamentosPorAndar: 4,
      andaresPorBloco: 10,
      blocos: 2,
    });
    assert.equal(result.population, 160);
    assert.equal(result.total, 8);
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

  it("Brigadista não vende pelo site: todo desfecho vai para o WhatsApp", () => {
    const result = buildQuoteResult({
      perfil: "empresa",
      ocupacao: "D-1",
      qtd_funcionarios: "40",
    });
    assert.equal(result.variant, "purchase");
    assert.match(result.ctaHref, /^https:\/\/wa\.me\//);
    // A quantidade calculada precisa chegar escrita na mensagem da Ariele.
    assert.match(decodeURIComponent(result.ctaHref), /2 brigadista\(s\): 2 Básico/);
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
