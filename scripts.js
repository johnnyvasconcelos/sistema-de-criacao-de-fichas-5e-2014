{
  const data = {};
  const steps = document.querySelectorAll(".step");
  const inputs = document.querySelectorAll(".etapa");
  const exoticRaces = document.querySelectorAll('option[data-tipo="exotica"]');
  const activeRaces = document.querySelector("#ativa-racas");
  let base = 8;
  const totalEquips = document.querySelector(".equips-escolhidos");
  const dinheiroFooter = document.querySelector(".dinheiro-footer");
  const moedas = document.querySelector(".moedas");
  // mostra ou esconde as raças fora do ldj
  exoticRaces.forEach((race) => {
    race.hidden = true;
  });
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

        // raça
        if (dado === "raca") {
          if (data.raca === "Humano Variante") {
            steps[index + 1].classList.add("on");
          } else if (steps[index + 2]) {
            steps[index + 2].classList.add("on");
          }
        }

        // classe
        else if (dado === "classe") {
          const categoria = document.querySelector(".categoria");
          const categoriaOption = categoria.querySelectorAll("option");

          for (let c = 0; c < categoriaOption.length; c++) {
            if (categoriaOption[c].dataset.classe === data.classe) {
              categoriaOption[c].hidden = false;
              categoriaOption[c].disabled = false;
            } else {
              categoriaOption[c].hidden = true;
              categoriaOption[c].disabled = true;
            }
          }

          if (
            !["Feiticeiro", "Clérigo", "Bruxo", "Guerreiro"].includes(
              data.classe,
            ) &&
            steps[index + 2]
          ) {
            steps[index + 2].classList.add("on");
          } else {
            steps[index + 1].classList.add("on");
          }
        }

        // restante
        else {
          steps[index + 1].classList.add("on");
        }
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
  // *** aumentando os atributos finais, caso a raça ofereça
  const buttonFinal = document.querySelectorAll(".alt-final");
  let adicionaEmUm = 0;
  let adicionaEmOutro = 0;
  const bonusExibido1 = document.querySelector(".pontos-um-atributo");
  const bonusExibido2 = document.querySelector(".pontos-dois-atributo");
  let bonusCar = 1;
  const selecionaBonus = () => {
    switch (data.raca) {
      case "Humano Variante":
        adicionaEmUm = 1;
        adicionaEmOutro = 1;
        break;
      case "Meio-Elfo":
        adicionaEmUm = 1;
        adicionaEmOutro = 1;
        break;
      default:
        adicionaEmUm = 2;
        adicionaEmOutro = 1;
    }
  };
  bonusExibido1.innerText = adicionaEmUm;
  bonusExibido2.innerText = adicionaEmOutro;
  let idAtivo = "";
  for (let i = 0; i < buttonFinal.length; i++) {
    buttonFinal[i].addEventListener("click", (ev) => {
      const atualSkill = ev.target.closest(".area-label");
      const input = atualSkill.querySelector(".atributo-final");
      const id = input.id.replace("-final", "");
      if (adicionaEmUm > 0) {
        if (!(data.raca === "Meio-Elfo" && id === "car")) {
          idAtivo = id;
          input.value++;
          adicionaEmUm--;
        }
      } else if (adicionaEmOutro > 0 && id !== idAtivo) {
        if (!(data.raca === "Meio-Elfo" && id === "car")) {
          input.value++;
          adicionaEmOutro--;
        }
      }
      bonusExibido1.innerText = adicionaEmUm;
      bonusExibido2.innerText = adicionaEmOutro;
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
  // perícias
  let bonusAdd = 0;
  const mostrarPericiasEMagias = async () => {
    try {
      bonusAdd =
        data.raca === "Humano Variante"
          ? bonusPericias(data.classe) + 1
          : bonusPericias(data.classe);

      const [pericias, antecedentes, classes] = await Promise.all([
        carregarJSON("./pericias.json"),
        carregarJSON("./antecedentes.json"),
        carregarJSON("./classes.json"),
      ]);
      const antecedenteEscolhido = antecedentes.find(
        (ant) => ant.nome === data.antecedente,
      );
      const classeEscolhida = classes.find((c) => {
        return c.nome === data.classe;
      });
      const periciasClasse = classeEscolhida.pericias;
      const periciasCampo = document.querySelector(".pericias");
      periciasCampo.innerHTML = "";
      for (let i = 0; i < pericias.length; i++) {
        const periciaElfica =
          (data.raca === "Alto Elfo" ||
            data.raca === "Elfo Negro" ||
            data.raca === "Elfo da Floresta") &&
          pericias[i].nome === "Percepção";

        const check =
          antecedenteEscolhido.pericias.includes(pericias[i].nome) ||
          periciaElfica
            ? "checked disabled"
            : "";

        periciasCampo.innerHTML += `<label class="label-area" for="${pericias[i].nome}"><input type="checkbox" class="pericia-checkbox" id="${pericias[i].nome}" value="${pericias[i].nome}" ${check} ${periciasClasse.includes(pericias[i].nome) && !antecedenteEscolhido.pericias.includes(pericias[i].nome) && !periciaElfica ? "" : "disabled"}/>${pericias[i].nome}</label>`;
      }
      // limita a quantidade de pericias, de acordo com a classe
      const checkboxes = document.querySelectorAll(".pericia-checkbox");
      for (let ch = 0; ch < checkboxes.length; ch++) {
        checkboxes[ch].addEventListener("change", () => {
          const marcadas = document.querySelectorAll(
            ".pericia-checkbox:not(:disabled):checked",
          ).length;
          if (marcadas > bonusAdd) {
            checkboxes[ch].checked = false;
          }
        });
      }
      // mostra as perícias que o usuário pode adicionar
      const periciasReferencia = document.querySelector(".pericias-referencia");
      periciasReferencia.innerHTML = `Escolha <b>${bonusAdd}</b> entre: ${periciasClasse.join(", ")}`;
      // envia dinheiro total ao data
      const dinheiroFooter = document.querySelector(".dinheiro-footer");
      data.pos = antecedenteEscolhido.pos + classeEscolhida.pos;
      dinheiroFooter.innerText = data.pos;
    } catch (error) {
      console.error("Erro em mostrarPericiasEMagias:", error);
    }
  };
  const bonusPericias = (classe) => {
    if (classe === "Bardo" || classe === "Patrulheiro") return 3;
    if (classe === "Ladino") return 4;
    return 2;
  };
  const carregarJSON = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro FETCH: ${url}: ${response.status}`);
    }
    return response.json();
  };
  // botao avançar
  const avancar = document.querySelectorAll(".avanca-step");
  const atributos = document.querySelectorAll(".atributo-view");
  const atributoFinal = document.querySelectorAll(".atributo-final");
  for (let i = 0; i < avancar.length; i++) {
    avancar[i].addEventListener("click", (ev) => {
      const atualStep = ev.target.closest(".step").dataset.step;
      const index = Array.from(steps).indexOf(ev.target.closest(".step"));
      // step dos atributos
      if (atualStep === "atributos" || atualStep === "atributos-bonus") {
        if (total == 0) {
          for (let a = 0; a < atributos.length; a++) {
            if (atributoFinal[a].value == "") {
              atributoFinal[a].value = atributos[a].value;
            }

            data[atributos[a].id.replace("-view", "")] = Number(
              atributoFinal[a].value,
            );

            if (
              data.raca == "Meio-Elfo" &&
              atributoFinal[a].id == "car-final" &&
              bonusCar > 0
            ) {
              data[atributos[a].id.replace("-view", "")] =
                Number(atributoFinal[a].value) + 2;
              bonusCar = 0;
            }
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
            if (steps[index + 2]) {
              steps[index].classList.remove("on");
              steps[index + 2].classList.add("on");
            }
          }
        } else {
          alert("Distribua todos os pontos!");
        }

        selecionaBonus();
        bonusExibido1.innerText = adicionaEmUm;
        bonusExibido2.innerText = adicionaEmOutro;
        mostrarPericiasEMagias();
      }
      // step das perícias
      else if (atualStep === "pericias") {
        const periciasMarcadas = document.querySelectorAll(
          ".pericia-checkbox:checked",
        );

        data.pericias = Array.from(periciasMarcadas).map((item) => item.value);

        console.log(data);

        if (steps[index + 1]) {
          steps[index].classList.remove("on");
          steps[index + 1].classList.add("on");
        }
        // coloca dinheiro do personagem na tela
        dinheiroFooter.classList.add("active");
        moedas.innerText = data.pos;
      }
      // step dos equipamentos
      else if (atualStep === "equipamentos") {
        data.equipamentos = totalEquips.value
          .replaceAll(",", " ")
          .split("  ")
          .slice(0, -1);
        if (steps[index + 1]) {
          steps[index].classList.remove("on");
          steps[index + 1].classList.add("on");
        }
        dinheiroFooter.classList.remove("active");
      }
    });
  }
  // equipamentos
  const addItem = document.querySelectorAll(".add-item");
  for (let i = 0; i < addItem.length; i++) {
    addItem[i].addEventListener("click", (ev) => {
      // equipamento
      const pai = ev.target.closest("tr");
      const nomeEquip = pai.querySelector(".equip").innerText;
      // dinheiro
      const valorEquip = pai.querySelector(".preco").innerText;
      if (Number(valorEquip) <= data.pos) {
        data.pos = Number((data.pos - Number(valorEquip)).toFixed(2));
        dinheiroFooter.innerText = data.pos;
        totalEquips.value += nomeEquip + ", ";
      } else {
        dinheiroFooter.classList.add("no-money");
        setTimeout(() => {
          dinheiroFooter.classList.remove("no-money");
        }, 1000);
      }
    });
  }
}
