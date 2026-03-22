{
  const data = {};
  const steps = document.querySelectorAll(".step");
  const inputs = document.querySelectorAll(".etapa");
  const exoticRaces = document.querySelectorAll('option[data-tipo="exotica"]');
  const activeRaces = document.querySelector("#ativa-racas");
  let base = 8;
  // mostra ou esconde as raças fora do ldj
  for (let i = 0; i < exoticRaces.length; i++) {
    exoticRaces[i].hidden = true;
  }
  activeRaces.addEventListener("change", (ev) => {
    if (ev.target.checked) {
      for (let i = 0; i < exoticRaces.length; i++) {
        exoticRaces[i].hidden = false;
      }
    } else {
      for (let i = 0; i < exoticRaces.length; i++) {
        exoticRaces[i].hidden = true;
      }
    }
  });
  // aviso de quais atributos aumentar a depender da raça
  const bonusRacas = {
    Humano: { for: 1, des: 1, con: 1, int: 1, sab: 1, car: 1 },
    "Alto Elfo": { des: 2, int: 1 },
    "Elfo da Floresta": { des: 2, sab: 1 },
    "Elfo Negro": { des: 2, car: 1 },
    "Anão da Colina": { con: 2, sab: 1 },
    "Anão da Montanha": { for: 2, con: 2 },
    "Meio-Orc": { for: 2, con: 1 },
    "Halfling Pé Leve": { des: 2, car: 1 },
    "Halfling Robusto": { des: 2, con: 1 },
    "Gnomo da Floresta": { int: 2, des: 1 },
    "Gnomo das Rochas": { int: 2, con: 1 },
    Tiefling: { int: 1, car: 2 },
    "Draconato Vermelho": { for: 2, car: 1 },
    "Draconato Verde": { for: 2, car: 1 },
    "Draconato Azul": { for: 2, car: 1 },
    "Draconato Negro": { for: 2, car: 1 },
    "Draconato Branco": { for: 2, car: 1 },
    "Draconato Dourado": { for: 2, car: 1 },
    "Draconato Prateado": { for: 2, car: 1 },
    "Draconato Cobre": { for: 2, car: 1 },
    "Draconato Latão": { for: 2, car: 1 },
    "Draconato Bronze": { for: 2, car: 1 },
    "Humano Variante": { dois_atributos: 1 },
    "Meio-Elfo": { car: 2, dois_atributos: 1 },
    Alternativo: { dois_atributos: 1, um_atributo: 2 },
  };
  mostraReferencia = (raca) => {
    const atributosReferencia = document.querySelectorAll(
      ".atributos-referencia",
    );
    if (
      bonusRacas.hasOwnProperty(raca) &&
      raca !== "Meio-Elfo" &&
      raca !== "Humano Variante"
    ) {
      atributosReferencia[0].innerText =
        `${raca}: ` +
        JSON.stringify(bonusRacas[raca])
          .replace(/[{}"]/g, "")
          .replaceAll(":", " +")
          .replaceAll(",", " | ")
          .replaceAll("_", " ")
          .toUpperCase();
    } else {
      atributosReferencia[1].innerText =
        `${raca}: ` +
        JSON.stringify(bonusRacas.Alternativo)
          .replace(/[{}"]/g, "")
          .replaceAll(":", " +")
          .replaceAll(",", " | ")
          .replaceAll("_", " ")
          .toUpperCase();
    }
  };
  // envia todas as opções selecionadas para o data
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", (ev) => {
      const dado = ev.target.name;
      data[dado] = ev.target.value;
      const atualStep = ev.target.closest(".step");
      const index = Array.from(steps).indexOf(atualStep);
      if (steps[index + 1]) {
        steps[index].classList.remove("on");
        steps[index + 1].classList.add("on");
      }
      console.log(data);
      mostraReferencia(data.raca);
      aumentaBonus(data.raca);
    });
  }
  // interface de aumento e diminuição de atributos
  // *** aumentando pontos
  const button = document.querySelectorAll(".alt");
  const pontos = document.querySelector(".pontos");
  let total = 27;
  pontos.innerText = total;
  for (let i = 0; i < button.length; i++) {
    button[i].addEventListener("click", (ev) => {
      const isPlus = ev.target.innerText == "+";
      const atualSkill = ev.target.closest(".label-area");
      const input = atualSkill.querySelector(".atributo");
      const atributoView = atualSkill.querySelector(".atributo-view");
      const bonus =
        (bonusRacas[data.raca] && bonusRacas[data.raca][input.id]) || 0;
      atributoView.value = Number(input.value) + bonus;
      if (isPlus) {
        if (Number(input.value) < 15 && total > 0) {
          if (Number(input.value) === 13 || Number(input.value) === 14) {
            if (total > 1) {
              input.value++;
              total -= 2;
            }
          } else {
            input.value++;
            total--;
          }
        }
      } else {
        if (Number(input.value) > 8 && total >= 0) {
          if (Number(input.value) === 14 || Number(input.value) === 15) {
            input.value--;
            total += 2;
          } else {
            input.value--;
            total++;
          }
        }
      }
      pontos.innerText = total;
      atributoView.value = Number(input.value) + bonus;
    });
  }
  // *** aumentando os bonus raciais
  const aumentaBonus = (raca) => {
    for (let atributo in bonusRacas[raca]) {
      const atributoParaEditar = document.querySelector(`#${atributo}-view`);
      if (!atributoParaEditar) continue;
      atributoParaEditar.value = 8 + bonusRacas[raca][atributo];
    }
  };
  // *** botao avancar
  const avancar = document.querySelectorAll(".avanca-step");
  const atributos = document.querySelectorAll(".atributo-view");
  const atributoFinal = document.querySelectorAll(".atributo-final");
  for (let i = 0; i < avancar.length; i++) {
    avancar[i].addEventListener("click", (ev) => {
      if (total == 0) {
        const atualStep = ev.target.closest(".step");
        const index = Array.from(steps).indexOf(atualStep);
        // adiciona os atributos para serem modificados e envia eles ao data
        for (let a = 0; a < atributos.length; a++) {
          if (atributoFinal[a].value == "") {
            atributoFinal[a].value = atributos[a].value;
          }
          data[atributos[a].id.replace("-view", "")] = Number(
            atributoFinal[a].value,
          );
        }
        console.log(data);
        if (
          !bonusRacas.hasOwnProperty(data.raca) ||
          data.raca == "Humano Variante" ||
          data.raca == "Meio-Elfo"
        ) {
          if (steps[index + 1]) {
            steps[index].classList.remove("on");
            steps[index + 1].classList.add("on");
          }
        } else {
          if (steps[index + 1]) {
            steps[index].classList.remove("on");
            steps[index + 2].classList.add("on");
          }
        }
      } else {
        alert("Distribua todos os pontos!");
      }
    });
  }
}
