/* =========================================================
   ELEMENTOS
========================================================= */

const form =
  document.getElementById("imcForm");

const alturaInput =
  document.getElementById("altura");

const pesoInput =
  document.getElementById("peso");

const clearBtn =
  document.getElementById("clearBtn");

const emptyState =
  document.getElementById("emptyState");

const resultContent =
  document.getElementById("resultContent");

const imcValue =
  document.getElementById("imcValue");

const classification =
  document.getElementById("classification");

const recommendation =
  document.getElementById("recommendation");

const resultStatus =
  document.getElementById("resultStatus");

const healthyRange =
  document.getElementById("healthyRange");

const heightMetric =
  document.getElementById("heightMetric");

const weightMetric =
  document.getElementById("weightMetric");

const scaleMarker =
  document.getElementById("scaleMarker");


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

const LIMITES = {

  alturaMin: 50,
  alturaMax: 250,

  pesoMin: 20,
  pesoMax: 300

};


/* =========================================================
   FORMATAÇÃO
========================================================= */

function formatarNumero(
  valor,
  casas = 2
) {

  return valor.toLocaleString(
    "pt-BR",
    {
      minimumFractionDigits: casas,
      maximumFractionDigits: casas
    }
  );
}


/* =========================================================
   CLASSIFICAÇÃO
========================================================= */

function classificarIMC(imc) {

  if (imc < 18.5) {

    return {

      nome: "Abaixo do peso",

      recomendacao:
        "Considere conversar com um nutricionista para receber uma orientação personalizada.",

      cor: "underweight"

    };

  }


  if (imc <= 24.9) {

    return {

      nome:
        "Peso dentro da faixa considerada saudável",

      recomendacao:
        "Continue mantendo hábitos saudáveis de alimentação e atividade física.",

      cor: "normal"

    };

  }


  if (imc <= 29.9) {

    return {

      nome: "Acima do peso",

      recomendacao:
        "Um profissional de saúde pode ajudar a montar um plano adequado para você.",

      cor: "overweight"

    };

  }


  return {

    nome: "Obesidade",

    recomendacao:
      "Recomendamos conversar com um médico para uma avaliação completa.",

    cor: "obesity"

  };

}


/* =========================================================
   POSIÇÃO DO MARCADOR
========================================================= */

function calcularPosicaoMarcador(imc) {

  /*
    A escala visual representa:

    abaixo de 18.5
    18.5 — 24.9
    25.0 — 29.9
    acima de 30

    Limitamos o valor entre 15 e 40
    para evitar que o marcador saia da escala.
  */

  const minimo = 15;
  const maximo = 40;

  const valorLimitado =
    Math.max(
      minimo,
      Math.min(maximo, imc)
    );

  const porcentagem =
    ((valorLimitado - minimo) /
      (maximo - minimo)) * 100;

  return porcentagem;
}


/* =========================================================
   MOSTRAR RESULTADO
========================================================= */

function mostrarResultado(
  imc,
  altura,
  peso
) {

  const classificacao =
    classificarIMC(imc);


  /* IMC */

  imcValue.textContent =
    formatarNumero(imc);


  /* CLASSIFICAÇÃO */

  classification.textContent =
    classificacao.nome;


  /* RECOMENDAÇÃO */

  recommendation.textContent =
    classificacao.recomendacao;


  /* STATUS */

  resultStatus.textContent =
    "Calculado agora";


  /* MÉTRICAS */

  heightMetric.textContent =
    formatarNumero(altura, 1);

  weightMetric.textContent =
    formatarNumero(peso, 1);


  /* FAIXA DE PESO */

  const alturaMetros =
    altura / 100;

  const pesoMin =
    18.5 *
    alturaMetros *
    alturaMetros;

  const pesoMax =
    24.9 *
    alturaMetros *
    alturaMetros;


  healthyRange.textContent =
    `${formatarNumero(pesoMin, 1)} – ${formatarNumero(pesoMax, 1)} kg`;


  /* MARCADOR */

  const position =
    calcularPosicaoMarcador(imc);

  scaleMarker.style.left =
    `${position}%`;


  /* CORES */

  classification.style.background =
    getBackgroundColor(
      classificacao.cor
    );

  classification.style.color =
    getTextColor(
      classificacao.cor
    );


  /* MOSTRAR */

  emptyState.classList.add(
    "hidden"
  );

  resultContent.classList.remove(
    "hidden"
  );
}


/* =========================================================
   CORES
========================================================= */

function getBackgroundColor(
  tipo
) {

  const cores = {

    underweight: "#eff6ff",

    normal: "#ecfdf5",

    overweight: "#fefce8",

    obesity: "#fef2f2"

  };

  return cores[tipo];
}


function getTextColor(
  tipo
) {

  const cores = {

    underweight: "#2563eb",

    normal: "#16a34a",

    overweight: "#ca8a04",

    obesity: "#dc2626"

  };

  return cores[tipo];
}


/* =========================================================
   ERRO
========================================================= */

function mostrarErro(
  mensagem,
  input = null
) {

  if (input) {

    input.classList.add(
      "input-error"
    );

    input.focus();

  }

  alert(mensagem);
}


/* =========================================================
   LIMPAR ERROS
========================================================= */

function limparErros() {

  alturaInput.classList.remove(
    "input-error"
  );

  pesoInput.classList.remove(
    "input-error"
  );
}


/* =========================================================
   CALCULAR IMC
========================================================= */

function calcularIMC() {

  limparErros();


  const alturaCm =
    Number(alturaInput.value);

  const peso =
    Number(pesoInput.value);


  /* CAMPOS VAZIOS */

  if (!alturaInput.value) {

    mostrarErro(
      "Informe sua altura.",
      alturaInput
    );

    return;

  }


  if (!pesoInput.value) {

    mostrarErro(
      "Informe seu peso.",
      pesoInput
    );

    return;

  }


  /* VALORES VÁLIDOS */

  if (
    !Number.isFinite(alturaCm) ||
    !Number.isFinite(peso)
  ) {

    mostrarErro(
      "Informe valores numéricos válidos."
    );

    return;
  }


  /* ALTURA */

  if (
    alturaCm <
      LIMITES.alturaMin ||
    alturaCm >
      LIMITES.alturaMax
  ) {

    mostrarErro(
      `Informe uma altura entre ${LIMITES.alturaMin} e ${LIMITES.alturaMax} cm.`,
      alturaInput
    );

    return;
  }


  /* PESO */

  if (
    peso <
      LIMITES.pesoMin ||
    peso >
      LIMITES.pesoMax
  ) {

    mostrarErro(
      `Informe um peso entre ${LIMITES.pesoMin} e ${LIMITES.pesoMax} kg.`,
      pesoInput
    );

    return;
  }


  /* CÁLCULO */

  const alturaMetros =
    alturaCm / 100;

  const imc =
    peso /
    (alturaMetros * alturaMetros);


  mostrarResultado(
    imc,
    alturaCm,
    peso
  );
}


/* =========================================================
   LIMPAR
========================================================= */

function limparCampos() {

  alturaInput.value = "";

  pesoInput.value = "";

  limparErros();


  emptyState.classList.remove(
    "hidden"
  );

  resultContent.classList.add(
    "hidden"
  );


  resultStatus.textContent =
    "—";


  healthyRange.textContent =
    "—";


  heightMetric.textContent =
    "—";


  weightMetric.textContent =
    "—";


  scaleMarker.style.left =
    "50%";


  alturaInput.focus();
}


/* =========================================================
   EVENTOS
========================================================= */

form.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    calcularIMC();

  }
);


clearBtn.addEventListener(
  "click",
  limparCampos
);


/* =========================================================
   ENTER
========================================================= */

[alturaInput, pesoInput].forEach(
  (input) => {

    input.addEventListener(
      "keydown",
      (event) => {

        if (event.key === "Enter") {

          event.preventDefault();

          calcularIMC();

        }

      }
    );

  }
);


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

alturaInput.focus();
