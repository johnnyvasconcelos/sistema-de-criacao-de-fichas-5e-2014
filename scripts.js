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
      const magiasCampo = document.querySelector(".magias");
      const truquesCampo = document.querySelector(".truques");
      const magiasQuantity = document.querySelector(".magia-quantidade");
      const truquesQuantity = document.querySelector(".truque-quantidade");
      magiasQuantity.innerText = classeEscolhida.magiasQuantidade;
      truquesQuantity.innerText =
        data.raca === "Alto Elfo"
          ? classeEscolhida.truquesQuantidade + 1
          : classeEscolhida.truquesQuantidade;
      periciasCampo.innerHTML = "";
      magiasCampo.innerHTML = "";
      truquesCampo.innerHTML = "";
      // invoca as perícias
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
      // invoca os truques
      let truquesAtivos = [];
      if (data.raca === "Elfo Negro") {
        truquesAtivos.push("Globos de Luz");
      } else if (data.raca === "Alto Elfo") {
        truquesAtivos.push(
          "Amizade",
          "Ataque Certeiro",
          "Consertar",
          "Espirro Ácido",
          "Globos de Luz",
          "Ilusão Menor",
          "Raio de Gelo",
          "Rajada de Veneno",
          "Toque Arrepiante",
          "Toque Chocante",
          "Luz",
          "Mãos Mágicas",
          "Mensagem",
          "Prestidigitação",
          "Proteção contra Lâminas",
          "Raio de Fogo",
        );
        truquesCampo.innerHTML =
          "<label class='label-area' for='Amizade'><input type='checkbox' class='truque' id='Amizade' value='Amizade'/><span>Amizade</span></label><label class='label-area' for='Ataque Certeiro'><input type='checkbox' class='truque' id='Ataque Certeiro' value='Ataque Certeiro'/><span>Ataque Certeiro</span></label><label class='label-area' for='Consertar'><input type='checkbox' class='truque' id='Consertar' value='Consertar'/><span>Consertar</span></label><label class='label-area' for='Espirro Ácido'><input type='checkbox' class='truque' id='Espirro Ácido' value='Espirro Ácido'/><span>Espirro Ácido</span></label><label class='label-area' for='Globos de Luz'><input type='checkbox' class='truque' id='Globos de Luz' value='Globos de Luz'/><span>Globos de Luz</span></label><label class='label-area' for='Ilusão Menor'><input type='checkbox' class='truque' id='Ilusão Menor' value='Ilusão Menor'/><span>Ilusão Menor</span></label><label class='label-area' for='Raio de Gelo'><input type='checkbox' class='truque' id='Raio de Gelo' value='Raio de Gelo'/><span>Raio de Gelo</span></label><label class='label-area' for='Rajada de Veneno'><input type='checkbox' class='truque' id='Rajada de Veneno' value='Rajada de Veneno'/><span>Rajada de Veneno</span></label><label class='label-area' for='Toque Arrepiante'><input type='checkbox' class='truque' id='Toque Arrepiante' value='Toque Arrepiante'/><span>Toque Arrepiante</span></label><label class='label-area' for='Toque Chocante'><input type='checkbox' class='truque' id='Toque Chocante' value='Toque Chocante'/><span>Toque Chocante</span></label><label class='label-area' for='Luz'><input type='checkbox' class='truque' id='Luz' value='Luz'/><span>Luz</span></label><label class='label-area' for='Mãos Mágicas'><input type='checkbox' class='truque' id='Mãos Mágicas' value='Mãos Mágicas'/><span>Mãos Mágicas</span></label><label class='label-area' for='Mensagem'><input type='checkbox' class='truque' id='Mensagem' value='Mensagem'/><span>Mensagem</span></label><label class='label-area' for='Prestidigitação'><input type='checkbox' class='truque' id='Prestidigitação' value='Prestidigitação'/><span>Prestidigitação</span></label><label class='label-area' for='Proteção contra Lâminas'><input type='checkbox' class='truque' id='Proteção contra Lâminas' value='Proteção contra Lâminas'/><span>Proteção contra Lâminas</span></label><label class='label-area' for='Raio de Fogo'><input type='checkbox' class='truque' id='Raio de Fogo' value='Raio de Fogo'/><span>Raio de Fogo</span></label>";
      }
      for (let i = 0; i < classeEscolhida.truques.length; i++) {
        if (truquesAtivos.includes(classeEscolhida.truques[i])) continue;
        truquesCampo.innerHTML += `<label class="label-area" for="${classeEscolhida.truques[i]}"><input type="checkbox" class="truque" id="${classeEscolhida.truques[i]}" value="${classeEscolhida.truques[i]}" /><span>${classeEscolhida.truques[i]}</span></label>`;
      }
      // invoca as magias
      let magiasAtivas = [];
      if (classeEscolhida.nome === "Bruxo") {
        if (data.categoria === "Arquifada") {
          magiasAtivas = ["Fogo das Fadas", "Sono"];
          magiasCampo.innerHTML =
            "<label for='Fogo das Fadas' class='label-area'><input type='checkbox' class='magia' id='Fogo das Fadas' value='Fogo das Fadas' checked disabled /><span>Fogo das Fadas</span></label><label for='Sono' class='label-area'><input type='checkbox' class='magia' id='Sono' value='Sono' checked disabled /><span>Sono</span></label>";
        } else if (data.categoria === "Corruptor") {
          magiasAtivas = ["Mãos Flamejantes", "Comando"];
          magiasCampo.innerHTML =
            "<label for='Mãos Flamejantes' class='label-area'><input type='checkbox' class='magia' id='Mãos Flamejantes' value='Mãos Flamejantes' checked disabled /><span>Mãos Flamejantes</span></label><label for='Comando' class='label-area'><input type='checkbox' class='magia' id='Comando' value='Comando' checked disabled /><span>Comando</span></label>";
        } else if (data.categoria === "Grande Antigo") {
          magiasAtivas = ["Sussurros Dissonantes", "Riso Histérico de Tasha"];
          magiasCampo.innerHTML =
            "<label for='Sussurros Dissonantes' class='label-area'><input type='checkbox' class='magia' id='Sussurros Dissonantes' value='Sussurros Dissonantes' checked disabled /><span>Sussurros Dissonantes</span></label><label for='Riso Histérico de Tasha' class='label-area'><input type='checkbox' class='magia' id='Riso Histérico de Tasha' value='Riso Histérico de Tasha' checked disabled /><span>Riso Histérico de Tasha</span></label>";
        }
      }
      for (let i = 0; i < classeEscolhida.magias.length; i++) {
        if (magiasAtivas.includes(classeEscolhida.magias[i])) continue;
        magiasCampo.innerHTML += `<label class="label-area" for="${classeEscolhida.magias[i]}"><input type="checkbox" class="magia" id="${classeEscolhida.magias[i]}" value="${classeEscolhida.magias[i]}" ${classeEscolhida.magiasQuantidade > 10 ? "disabled checked" : ""} /><span>${classeEscolhida.magias[i]}</span></label>`;
      }
      // limita a quantidade de magias e truques, de acordo com a classe
      const magia = document.querySelectorAll(".magia");
      const truque = document.querySelectorAll(".truque");
      for (let m = 0; m < magia.length; m++) {
        magia[m].addEventListener("change", () => {
          const marcadas = document.querySelectorAll(
            ".magia:not(:disabled):checked",
          );
          if (marcadas.length > classeEscolhida.magiasQuantidade) {
            magia[m].checked = false;
          }
        });
      }
      for (let t = 0; t < truque.length; t++) {
        truque[t].addEventListener("change", () => {
          const marcadas = document.querySelectorAll(".truque:checked");
          if (data.raca === "Alto Elfo") {
            if (marcadas.length > classeEscolhida.truquesQuantidade + 1) {
              truque[t].checked = false;
            }
          } else {
            if (marcadas.length > classeEscolhida.truquesQuantidade) {
              truque[t].checked = false;
            }
          }
        });
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
        // classes não-mágicas
        const classesNaoMagicas = [
          "Guerreiro",
          "Ladino",
          "Patrulheiro",
          "Paladino",
          "Bárbaro",
          "Monge",
        ];
        data.equipamentos = totalEquips.value
          .replaceAll(",", " ")
          .split("  ")
          .slice(0, -1);
        if (steps[index + 1] && !classesNaoMagicas.includes(data.classe)) {
          steps[index].classList.remove("on");
          steps[index + 1].classList.add("on");
        } else if (steps[index + 1]) {
          steps[index].classList.remove("on");
          steps[index + 2].classList.add("on");
        }
        dinheiroFooter.classList.remove("active");
      }
      // step das magias
      else if (atualStep === "magias") {
        const truquesMarcados = document.querySelectorAll(".truque:checked");
        const magiasMarcadas = document.querySelectorAll(".magia:checked");
        data.magias = Array.from(magiasMarcadas).map((item) => item.value);
        data.truques = Array.from(truquesMarcados).map((item) => item.value);

        console.log(data);
        if (steps[index + 1]) {
          steps[index].classList.remove("on");
          steps[index + 2].classList.add("on");
        }
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
