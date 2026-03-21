{
  const data = {};
  const steps = document.querySelectorAll(".step");
  const inputs = document.querySelectorAll(".etapa");
  const exoticRaces = document.querySelectorAll('option[data-tipo="exotica"]');
  const activeRaces = document.querySelector("#ativa-racas");
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
    Humano: "+1 em todos os atributos.",
    "Humano Variante": "+1 em dois atributos à sua escolha.",
    "Alto Elfo": "+2 DES, +1 INT",
    "Elfo da Floresta": "+2 DES, +1 SAB",
    "Elfo Negro": "+2 DES, +1 CAR",
    "Anão da Colina": "+2 CON, +1 SAB",
    "Anão da Montanha": "+2 CON, +2 FOR",
    "Meio-Elfo": "+2 CAR, +1 em outros dois atributos.",
    "Meio-Orc": "+2 FOR, +1 CON",
    "Halfling Pé Leve": "+2 DES, +1 CAR",
    "Halfling Robusto": "+2 DES, +1 CON",
    "Gnomo da Floresta": "+2 INT, +1 DES",
    "Gnomo das Rochas": "+2 INT, +1 CON",
    Tiefling: "+2 CAR, +1 INT",
    "Draconato Vermelho": "+2 FOR, +1 CAR",
    "Draconato Verde": "+2 FOR, +1 CAR",
    "Draconato Azul": "+2 FOR, +1 CAR",
    "Draconato Negro": "+2 FOR, +1 CAR",
    "Draconato Branco": "+2 FOR, +1 CAR",
    "Draconato Dourado": "+2 FOR, +1 CAR",
    "Draconato Prateado": "+2 FOR, +1 CAR",
    "Draconato Cobre": "+2 FOR, +1 CAR",
    "Draconato Latão": "+2 FOR, +1 CAR",
    "Draconato Bronze": "+2 FOR, +1 CAR",
  };
  mostraReferencia = (raca) => {
    const atributosReferencia = document.querySelector(".atributos-referencia");
    if (bonusRacas.hasOwnProperty(raca)) {
      atributosReferencia.innerText = bonusRacas[raca];
    } else {
      atributosReferencia.innerText = "+2 em um, +1 em outro.";
    }
  };
  // interface de aumento e diminuição de atributos
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
      atributoView.value = input.value;

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
      atributoView.value = input.value;
    });
  }
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
    });
  }
}
