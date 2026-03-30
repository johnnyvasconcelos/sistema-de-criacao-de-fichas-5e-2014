{
  const data = {};
  const steps = document.querySelectorAll(".step");
  const inputs = document.querySelectorAll(".etapa");
  const exoticRaces = document.querySelectorAll('option[data-tipo="exotica"]');
  const activeRaces = document.querySelector("#ativa-racas");
  const totalEquips = document.querySelector(".equips-escolhidos");
  const dinheiroFooter = document.querySelector(".dinheiro-footer");
  const moedas = document.querySelector(".moedas");
  const classesNaoMagicas = [
    "Guerreiro",
    "Ladino",
    "Patrulheiro",
    "Paladino",
    "Bárbaro",
    "Monge",
  ];
  const classesMagicas = [
    "Clérigo",
    "Druida",
    "Mago",
    "Bardo",
    "Feiticeiro",
    "Bruxo",
    "Artífice",
  ];
  const racasMagicas = [
    "Alto Elfo",
    "Elfo Negro",
    "Gnomo da Floresta",
    "Yuan-Ti",
    "Tiefling",
    "Aasimar",
    "Fada",
    "Genasi do Ar",
    "Genasi da Terra",
    "Genasi do Fogo",
    "Genasi da Água",
    "Githyanki",
    "Githzerai",
  ];
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
    Draconato: { for: 2, car: 1 },
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
          } else if (data.raca === "Draconato") {
            steps[index + 2].classList.add("on");
          } else if (data.raca === "Genasi") {
            steps[index + 3].classList.add("on");
          } else if (steps[index + 2]) {
            steps[index + 4].classList.add("on");
          }
        }

        // talento
        else if (dado === "talento") {
          steps[index + 3].classList.add("on");
        }

        // linhagem
        else if (dado === "linhagem") {
          steps[index + 2].classList.add("on");
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
  // perícias e magias
  let bonusAdd = 0;
  const mostrarDetalhesMagias = async () => {
    // enviar descrição das magias ao data
    try {
      const [truques, magias] = await Promise.all([
        carregarJSON("./truques.json"),
        carregarJSON("./magias.json"),
      ]);
      const truquesDescricao = [];
      const magiasDescricao = [];
      const magiasAtaque = [];
      for (let i = 0; i < data.magias.length; i++) {
        const ataque = magias.find((a) => a.nome === data.magias[i]);
        if (!ataque) continue;
        if (ataque && ataque.ataque) {
          magiasAtaque.push({
            nome: data.magias[i],
            ataque: ataque.ataque,
          });
        }
      }
      for (let i = 0; i < data.truques.length; i++) {
        const ataque = truques.find((t) => t.nome === data.truques[i]);
        if (!ataque) continue;
        if (ataque && ataque.ataque) {
          magiasAtaque.push({
            nome: data.truques[i],
            ataque: ataque.ataque,
          });
        }
      }
      for (let i = 0; i < data.truques.length; i++) {
        const truque = truques.find((t) => t.nome === data.truques[i]);
        truquesDescricao.push({
          nome: data.truques[i],
          descricao: truque.descricao,
        });
      }
      for (let i = 0; i < data.magias.length; i++) {
        const magia = magias.find((m) => m.nome === data.magias[i]);
        magiasDescricao.push({
          nome: data.magias[i],
          descricao: magia.descricao,
        });
      }
      data.magiasAtaque = magiasAtaque;
      data.truquesDescricoes = truquesDescricao;
      data.magiasDescricoes = magiasDescricao;
    } catch (error) {
      console.error("Erro em mostrarDetalhesMagias:", error);
    }
  };
  const mostrarArmasEArmaduras = async () => {
    // envia as armas ao data com base nos equipamentos
    try {
      const [ataques, armaduras] = await Promise.all([
        carregarJSON("./armas.json"),
        carregarJSON("./armaduras.json"),
      ]);
      // calcula a CA
      let armaduraAtual;
      for (let i = 0; i < data.equipamentos.length; i++) {
        armaduraAtual = armaduras.find(
          (item) => item.nome === data.equipamentos[i],
        );
        if (armaduraAtual) break;
      }
      const modDes = Math.floor((data.des - 10) / 2);
      const temEscudo = data.equipamentos.includes("Escudo");

      let caBase;
      if (armaduraAtual) {
        caBase = armaduraAtual.base
          ? armaduraAtual.ca + modDes
          : armaduraAtual.ca;
      } else {
        caBase = 10 + modDes;
      }

      data.ca = caBase + (temEscudo ? 2 : 0);

      // separa as armas
      const armas = [];

      for (let i = 0; i < data.equipamentos.length; i++) {
        const armaEncontrada = ataques.find(
          (item) => item.nome === data.equipamentos[i],
        );

        if (armaEncontrada) {
          armas.push(armaEncontrada);
        }
      }
      data.armas = armas;
    } catch (error) {
      console.error("Erro em mostrarArmasEArmaduras:", error);
    }
  };
  const mostrarPericiasEMagias = async () => {
    try {
      bonusAdd =
        data.raca === "Humano Variante"
          ? bonusPericias() + 1
          : data.raca === "Meio-Elfo" || data.raca === "Kenku"
            ? bonusPericias() + 2
            : bonusPericias();
      const [pericias, antecedentes, classes, racas, categorias, talentos] =
        await Promise.all([
          carregarJSON("./pericias.json"),
          carregarJSON("./antecedentes.json"),
          carregarJSON("./classes.json"),
          carregarJSON("./racas.json"),
          carregarJSON("./categorias.json"),
          carregarJSON("./talentos.json"),
        ]);
      const antecedenteEscolhido = antecedentes.find(
        (ant) => ant.nome === data.antecedente,
      );
      const classeEscolhida = classes.find((c) => {
        return c.nome === data.classe;
      });
      const racaEscolhida = racas.find((r) => {
        return r.nome === data.raca;
      });
      const talentoEscolhido = talentos.find((t) => {
        return t.nome === data.talento;
      });
      const categoriaEscolhida =
        categorias.find(
          (ct) =>
            ct.nome === data.categoria ||
            ct.nome === data.linhagem ||
            ct.nome === data.elemento,
        ) || [];
      data.slots = classeEscolhida.slots;
      let todasProf = []
        .concat(
          categoriaEscolhida?.proficiencias || [],
          racaEscolhida.proficiencias || [],
          classeEscolhida.proficiencias || [],
          antecedenteEscolhido.proficiencias || [],
        )
        .filter((item) => item)
        .filter((item, index, arr) => arr.indexOf(item) === index);
      let todasHab = []
        .concat(
          categoriaEscolhida?.habilidades || [],
          racaEscolhida.habilidades || [],
          classeEscolhida.habilidades || [],
          antecedenteEscolhido.habilidades || [],
          talentoEscolhido?.habilidades || [],
        )
        .filter((item) => item)
        .filter((item, index, arr) => arr.indexOf(item) === index);
      data.proficiencias = todasProf;
      data.habilidades = todasHab;
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
      // mostra idiomas
      const idiomas = document.querySelectorAll(".idioma");
      for (let id = 0; id < idiomas.length; id++) {
        if (racaEscolhida.idiomas.includes(idiomas[id].id)) {
          idiomas[id].checked = true;
          idiomas[id].disabled = true;
        }
        idiomas[id].addEventListener("change", () => {
          const idiomaQuantity = document.querySelectorAll(
            ".idioma:not(:disabled):checked",
          );
          let limiteMaximo = 1;

          if (
            data.talento === "Poliglota" &&
            data.categoria === "Conhecimento"
          ) {
            limiteMaximo = 7;
          } else if (data.talento === "Poliglota") {
            limiteMaximo = 4;
          } else if (data.categoria === "Conhecimento") {
            limiteMaximo = 3;
          }

          if (idiomaQuantity.length > limiteMaximo) {
            idiomas[id].checked = false;
          }
        });
      }

      // invoca as perícias
      for (let i = 0; i < pericias.length; i++) {
        const periciaElfica =
          (data.raca === "Alto Elfo" ||
            data.raca === "Elfo Negro" ||
            data.raca === "Elfo Marinho" ||
            data.raca === "Eladrin" ||
            data.raca === "Laparlonj" ||
            data.raca === "Shadar-Kai" ||
            data.raca === "Elfo da Floresta") &&
          pericias[i].nome === "Percepção";

        const check =
          antecedenteEscolhido.pericias.includes(pericias[i].nome) ||
          racaEscolhida.pericias.includes(pericias[i].nome) ||
          periciaElfica
            ? "checked disabled"
            : "";

        periciasCampo.innerHTML += `<label class="label-area" for="${pericias[i].nome}"><input type="checkbox" class="pericia-checkbox" id="${pericias[i].nome}" value="${pericias[i].nome}" ${check} ${periciasClasse.includes(pericias[i].nome) && !racaEscolhida.pericias.includes(pericias[i].nome) && !antecedenteEscolhido.pericias.includes(pericias[i].nome) && !periciaElfica ? "" : "disabled"}/>${pericias[i].nome}</label>`;
      }
      // invoca os truques
      let truquesAtivos = [];
      if (data.categoria === "Luz") {
        truquesAtivos.push("Luz");
        truquesCampo.innerHTML +=
          "<label class='label-area' for='Luz'><input type='checkbox' class='truque' id='Luz' value='Luz' disabled checked/><span>Luz</span></label>";
      }
      if (data.raca === "Elfo Negro") {
        truquesAtivos.push("Globos de Luz");
        truquesCampo.innerHTML +=
          "<label class='label-area' for='Globos de Luz'><input type='checkbox' class='truque' id='Globos de Luz' value='Globos de Luz' disabled checked/><span>Globos de Luz</span></label>";
      } else if (data.raca === "Gnomo da Floresta") {
        truquesAtivos.push("Ilusão Menor");
        truquesCampo.innerHTML +=
          "<label class='label-area' for='Ilusão Menor'><input type='checkbox' class='truque' id='Ilusão Menor' value='Ilusão Menor' disabled checked/><span>Ilusão Menor</span></label>";
      } else if (data.raca === "Yuan-Ti") {
        truquesAtivos.push("Rajada de Veneno");
        truquesCampo.innerHTML +=
          "<label class='label-area' for='Rajada de Veneno'><input type='checkbox' class='truque' id='Rajada de Veneno' value='Rajada de Veneno' disabled checked/><span>Rajada de Veneno</span></label>";
      } else if (data.raca === "Tiefling") {
        truquesAtivos.push("Taumaturgia");
        truquesCampo.innerHTML +=
          "<label class='label-area' for='Taumaturgia'><input type='checkbox' class='truque' id='Taumaturgia' value='Taumaturgia' disabled checked/><span>Taumaturgia</span></label>";
      } else if (data.raca === "Aasimar") {
        truquesAtivos.push("Luz");
        truquesCampo.innerHTML +=
          "<label class='label-area' for='Luz'><input type='checkbox' class='truque' id='Luz' value='Luz' disabled checked/><span>Luz</span></label>";
      } else if (data.raca === "Fada") {
        truquesAtivos.push("Druidismo");
        truquesCampo.innerHTML +=
          "<label class='label-area' for='Druidismo'><input type='checkbox' class='truque' id='Druidismo' value='Druidismo' disabled checked/><span>Druidismo</span></label>";
      } else if (data.raca === "Genasi" && data.elemento === "Ar") {
        truquesAtivos.push("Toque Chocante");
        truquesCampo.innerHTML +=
          "<label class='label-area' for='Toque Chocante'><input type='checkbox' class='truque' id='Toque Chocante' value='Toque Chocante' disabled checked/><span>Toque Chocante</span></label>";
      } else if (data.raca === "Genasi" && data.elemento === "Terra") {
        truquesAtivos.push("Proteção contra Lâminas");
        truquesCampo.innerHTML +=
          "<label class='label-area' for='Proteção contra Lâminas'><input type='checkbox' class='truque' id='Proteção contra Lâminas' value='Proteção contra Lâminas' disabled checked/><span>Proteção contra Lâminas</span></label>";
      } else if (data.raca === "Genasi" && data.elemento === "Fogo") {
        truquesAtivos.push("Criar Chamas");
        truquesCampo.innerHTML +=
          "<label class='label-area' for='Criar Chamas'><input type='checkbox' class='truque' id='Criar Chamas' value='Criar Chamas' disabled checked/><span>Criar Chamas</span></label>";
      } else if (data.raca === "Genasi" && data.elemento === "Água") {
        truquesAtivos.push("Espirro  Ácido");
        truquesCampo.innerHTML +=
          "<label class='label-area' for='Espirro Ácido'><input type='checkbox' class='truque' id='Espirro Ácido' value='Espirro Ácido' disabled checked/><span>Espirro Ácido</span></label>";
      } else if (data.raca === "Githyanki") {
        truquesAtivos.push("Mãos Mágicas");
        truquesCampo.innerHTML +=
          "<label class='label-area' for='Mãos Mágicas'><input type='checkbox' class='truque' id='Mãos Mágicas' value='Mãos Mágicas' disabled checked/><span>Mãos Mágicas</span></label>";
      } else if (data.raca === "Githzerai") {
        truquesAtivos.push("Mãos Mágicas");
        truquesCampo.innerHTML +=
          "<label class='label-area' for='Mãos Mágicas'><input type='checkbox' class='truque' id='Mãos Mágicas' value='Mãos Mágicas' disabled checked/><span>Mãos Mágicas</span></label>";
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
        truquesCampo.innerHTML +=
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
          const marcadas = document.querySelectorAll(
            ".truque:not(:disabled):checked",
          );
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
      // envia os equipamentos do antecedente
      data.equipamentos = antecedenteEscolhido.equipamentos;
    } catch (error) {
      console.error("Erro em mostrarPericiasEMagias:", error);
    }
  };
  const bonusPericias = () => {
    if (data.classe === "Bardo" || data.classe === "Patrulheiro") return 3;
    if (data.classe === "Clérigo" && data.categoria === "Conhecimento")
      return 4;
    if (data.classe === "Ladino") return 4;
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
        data.equipamentos.push(
          ...totalEquips.value.replaceAll(",", " ").split("  ").slice(0, -1),
        );
        if (
          (steps[index + 1] && !classesNaoMagicas.includes(data.classe)) ||
          (steps[index + 1] && racasMagicas.includes(data.raca))
        ) {
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
        if (steps[index + 1]) {
          steps[index].classList.remove("on");
          steps[index + 1].classList.add("on");
        }
      }
      // step dos idiomas
      else if (atualStep === "idiomas") {
        const idiomasMarcados = document.querySelectorAll(".idioma:checked");
        data.idiomas = Array.from(idiomasMarcados).map((item) => item.value);
        if (steps[index + 1]) {
          steps[index].classList.remove("on");
          steps[index + 1].classList.add("on");
        }
        if (
          !classesNaoMagicas.includes(data.classe) ||
          racasMagicas.includes(data.raca)
        ) {
          mostrarDetalhesMagias();
        }
      }
      // step de nome e história
      else if (atualStep === "historia") {
        const nome = document.querySelector("#nome_personagem");
        const historia = document.querySelector("#historia_personagem");
        data.nome = nome.value;
        data.historia = historia.value;
        data.proficiencias = [...data.proficiencias, ...data.idiomas];
        // loading
        const historySection = document.querySelector(".history-content");
        historySection.classList.add("desactive");
        const loading = document.querySelector(".loading");
        loading.classList.add("active-loading");
        const textoFinal = document.querySelector(".texto-final");
        setTimeout(() => {
          loading.style.display = "none";
          textoFinal.innerText = `Ficha do ${data.raca} ${data.classe} criada!`;
        }, 10000);
        // calcula o dinheiro
        let poInteiro = Math.floor(data.pos);
        let parteDecimal = data.pos - poInteiro;
        data.pps = Math.round(parteDecimal * 10);
        data.pos = poInteiro;
        // outros detalhes e talentos
        mostrarArmasEArmaduras();
        data.nivel = 1;
        data.defeito = "Impulsivo. Prefere atacar antes de pensar.";
        data.ideal = "Poder é conquistado pela força e mantido sem piedade.";
        data.personalidade = "Desconfiado demora a confiar nos outros.";
        data.vinculo = "Defendo minha terra natal custe o que custar.";
        data.tendencia = "Neutro";
        data.for =
          (data.raca === "Humano Variante" && data.talento === "Atleta") ||
          (data.raca === "Humano Variante" &&
            data.talento === "Especialista em Briga") ||
          (data.raca === "Humano Variante" &&
            data.talento === "Maestria em Armadura Pesada") ||
          data.raca === "Humano Variante" ||
          data.talento === "Proteção Pesada"
            ? data.for + 1
            : data.for;
        data.car =
          data.raca === "Humano Variante" && data.talento === "Ator"
            ? data.car + 1
            : data.car;
        data.int =
          (data.raca === "Humano Variante" &&
            data.talento === "Mente Afiada") ||
          (data.raca === "Humano Variante" && data.talento === "Poliglota")
            ? data.int + 1
            : data.int;
        data.sab =
          data.raca === "Humano Variante" && data.talento === "Observador"
            ? data.sab + 1
            : data.sab;
        data.des =
          (data.raca === "Humano Variante" &&
            data.talento === "Mestre das Armas") ||
          (data.raca === "Humano Variante" &&
            data.talento === "Proteção Leve") ||
          (data.raca === "Humano Variante" &&
            data.talento === "Proteção Moderada")
            ? data.des + 1
            : data.des;
        data.con =
          data.raca === "Humano Variante" && data.talento === "Resiliente"
            ? data.con + 1
            : data.con;
        data.iniciativa =
          data.raca === "Humano Variante" && data.talento === "Alerta"
            ? Math.floor((data.des - 10) / 2) + 5
            : Math.floor((data.des - 10) / 2);
        const conMod = Math.floor((data.con - 10) / 2);

        if (
          data.raca === "Humano Variante" &&
          data.talento === "Conjurador de Ritual"
        ) {
          if (classesMagicas.includes(data.classe)) {
            data.magiasDescricoes.push({
              nome: "Cerimônia",
              descricao:
                "Você realiza um ritual em um alvo a 3m escolhendo um dos seguintes efeitos: restaurar o alinhamento original de uma criatura com um teste de Intuição CD 20, transformar um frasco de água em água benta, conceder +1d4 em testes de habilidade para um jovem por 24h, conceder +1d4 em testes de resistência para um fiel por 24h ou dar +2 na CA por 7 dias para um casal que esteja a 9m um do outro.",
            });
            if (
              data.magiasDescricoes.some(
                (magia) => magia.nome === "Detectar Magia",
              )
            ) {
              data.magiasDescricoes.push({
                nome: "Escrita Ilusória",
                descricao:
                  "Ritual. Você escreve num pergaminho e o texto parece normal, mas apenas criaturas designadas conseguem ler o conteúdo verdadeiro (outros leem uma mensagem falsa).",
              });
            } else {
              data.magiasDescricoes.push({
                nome: "Detectar Magia",
                descricao:
                  "Ritual. Você sente a presença de magia a até 9m. Sabe qual a escola de magia, se houver.",
              });
            }
          }
        } else if (
          data.raca === "Humano Variante" &&
          data.talento === "Iniciado em Magia"
        ) {
          if (
            data.magiasDescricoes.some(
              (magia) => magia.nome === "Armadura de Agathys",
            )
          ) {
            data.magiasDescricoes.push({
              nome: "Braços de Hadar",
              descricao:
                "Tentáculos de energia golpeiam quem estiver a até 3m de você, exigindo um teste de For. para não sofrer 2d6 de dano necrótico e perder reações.",
            });
          } else {
            data.magiasDescricoes.push({
              nome: "Armadura de Agathys",
              descricao:
                "Você ganha 5 PVs temporários (1h). Se uma criatura atingir você com um ataque corpo-a-corpo enquanto estiver com esses pontos de vida, a criatura sofrerá 5 de dano de frio.",
            });
          }
          data.truquesDescricoes.push(
            {
              nome: "Infestação",
              descricao:
                "Você faz surgir parasitas temporários em uma criatura a até 9m. O alvo deve passar em um teste de Res. de Con. ou sofre 1d6 de dano de veneno e se move 1,5m em uma direção aleatória.",
            },
            {
              nome: "Toque do Túmulo",
              descricao:
                "Você desfere um ataque mágico à distância que causa 1d8 de dano necrótico. O alvo não pode recuperar pontos de vida e, se for um morto-vivo, tem desvantagem em ataques contra você até o seu próximo turno.",
            },
          );
        } else if (
          data.raca === "Humano Variante" &&
          data.talento === "Atirador de Magia"
        ) {
          data.truquesDescricoes.push({
            nome: "Lâmina Trovejante",
            descricao:
              "Você realiza um ataque corpo a corpo com arma como parte da magia. Se acertar, causa o dano normal e envolve o alvo em energia trovejante. Se ele se mover voluntariamente antes do próximo turno, sofre dano extra.",
          });
        }

        switch (data.classe) {
          case "Bárbaro":
            data.pvs = 12 + conMod;
            break;

          case "Guerreiro":
          case "Paladino":
          case "Patrulheiro":
            data.pvs = 10 + conMod;
            break;

          case "Bardo":
          case "Clérigo":
          case "Druida":
          case "Monge":
          case "Ladino":
          case "Bruxo":
          case "Artífice":
            data.pvs = 8 + conMod;
            break;

          case "Feiticeiro":
          case "Mago":
            data.pvs = 6 + conMod;
            break;

          default:
            data.pvs = 0;
        }
        if (data.raca === "Humano Variante" && data.talento === "Robusto") {
          data.pvs = data.pvs + 2;
        }
        switch (data.raca) {
          case "Centauro":
            data.deslocamento = 12;
            break;

          case "Elfo da Floresta":
          case "Leonino":
            data.deslocamento = 10.5;
            break;

          case "Anão da Colina":
          case "Anão da Montanha":
          case "Duergar":
          case "Halfling Pé Leve":
          case "Halfling Robusto":
          case "Gnomo da Floresta":
          case "Gnomo das Rochas":
          case "Gnomo das Profundezas":
            data.deslocamento = 7.5;
            break;

          default:
            data.deslocamento = 9;
        }
        if (data.raca === "Humano Variante" && data.talento === "Mobilidade") {
          data.deslocamento = data.deslocamento + 3;
        }
        data.deslocamento = data.deslocamento + "m";
        data.prof = "2";
        let atributoBase = 0;

        switch (data.classe) {
          case "Mago":
          case "Artífice":
            atributoBase = data.int;
            break;

          case "Clérigo":
          case "Druida":
          case "Ranger":
            atributoBase = data.sab;
            break;

          case "Bardo":
          case "Feiticeiro":
          case "Bruxo":
          case "Paladino":
            atributoBase = data.car;
            break;

          default:
            atributoBase = 0;
        }

        data.cd = 10 + Math.floor((atributoBase - 10) / 2);

        data.resfor = Math.floor((data.for - 10) / 2);
        data.resdes = Math.floor((data.des - 10) / 2);
        data.rescon = Math.floor((data.con - 10) / 2);
        data.resint = Math.floor((data.int - 10) / 2);
        data.ressab = Math.floor((data.sab - 10) / 2);
        data.rescar = Math.floor((data.car - 10) / 2);

        switch (data.classe) {
          case "Bárbaro":
            data.resfor += 2;
            data.rescon += 2;
            break;

          case "Bardo":
            data.resdes += 2;
            data.rescar += 2;
            break;

          case "Bruxo":
            data.ressab += 2;
            data.rescar += 2;
            break;

          case "Clérigo":
            data.ressab += 2;
            data.rescar += 2;
            break;

          case "Druida":
            data.resint += 2;
            data.ressab += 2;
            break;

          case "Feiticeiro":
            data.rescon += 2;
            data.rescar += 2;
            break;

          case "Guerreiro":
            data.resfor += 2;
            data.rescon += 2;
            break;

          case "Ladino":
            data.resdes += 2;
            data.resint += 2;
            break;

          case "Mago":
            data.resint += 2;
            data.ressab += 2;
            break;

          case "Monge":
            data.resfor += 2;
            data.resdes += 2;
            break;

          case "Paladino":
            data.ressab += 2;
            data.rescar += 2;
            break;

          case "Patrulheiro":
            data.resfor += 2;
            data.resdes += 2;
            break;

          case "Artífice":
            data.rescon += 2;
            data.resint += 2;
            break;
        }

        let preparadas = 0;

        switch (data.classe) {
          case "Clérigo":
          case "Druida":
            preparadas = 1 + Math.floor((data.sab - 10) / 2);
            break;

          case "Mago":
            preparadas = 1 + Math.floor((data.int - 10) / 2);
            break;

          case "Paladino":
            preparadas = 1 + Math.floor((data.car - 10) / 2);
            break;

          case "Artífice":
            preparadas = 1 + Math.floor((data.int - 10) / 2);
            break;

          default:
            preparadas = 0;
        }

        data.preparadas = preparadas;
        // edita pdf
        editaPdf();
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
  // função para editar a ficha pdf com todas as informações
  const editaPdf = async () => {
    const { PDFDocument } = PDFLib;
    // carrega pdf
    const existingPdfBytes = await fetch("ficha.pdf").then((res) =>
      res.arrayBuffer(),
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();
    const nome = form.getTextField("nome");
    const armas = form.getTextField("arma_1");
    const tendencia = form.getTextField("tendencia");
    const raca = form.getTextField("raca");
    const classe = form.getTextField("classe");
    const antecedente = form.getTextField("antecedente");
    const equipamentos = form.getTextField("equipamentos");
    const ca = form.getTextField("classe_armadura");
    const proficiencias = form.getTextField("proficiencias");
    const vida = form.getTextField("total_vida");
    const atualVida = form.getTextField("atual_vida");
    const magic0 = form.getTextField("magia_1");
    const magic1 = form.getTextField("magia_2");
    const gps = form.getTextField("gps");
    const sp = form.getTextField("sp");
    const magiasAt = form.getTextField("magic_1");
    const prof = form.getTextField("prof");
    const sobre = form.getTextField("sobre");
    const modFor = form.getTextField("mod_for");
    const modDes = form.getTextField("mod_des");
    const modCon = form.getTextField("mod_con");
    const modInt = form.getTextField("mod_int");
    const modSab = form.getTextField("mod_sab");
    const modCar = form.getTextField("mod_car");
    const resFor = form.getTextField("res_for");
    const resDes = form.getTextField("res_des");
    const resCon = form.getTextField("res_con");
    const resInt = form.getTextField("res_int");
    const resSab = form.getTextField("res_sab");
    const resCar = form.getTextField("res_car");
    const nivel = form.getTextField("nivel");
    const cd = form.getTextField("Texto1");
    const iniciativa = form.getTextField("iniciativa");
    const forMod = Math.floor((data.for - 10) / 2).toString();
    const desMod = Math.floor((data.des - 10) / 2).toString();
    const conMod = Math.floor((data.con - 10) / 2).toString();
    const intMod = Math.floor((data.int - 10) / 2).toString();
    const sabMod = Math.floor((data.sab - 10) / 2).toString();
    const carMod = Math.floor((data.car - 10) / 2).toString();
    const habilidades = form.getTextField("mais_personagem");
    const magicSlot = form.getTextField("magic_slot_1");
    const forca = form.getTextField("forca");
    const destreza = form.getTextField("destreza");
    const constituicao = form.getTextField("constituicao");
    const inteligencia = form.getTextField("inteligencia");
    const deslocamento = form.getTextField("deslocamento");
    const sabedoria = form.getTextField("sabedoria");
    const carisma = form.getTextField("carisma");
    gps.setText(data.pos.toString());
    sp.setText(data.pps.toString());
    cd.setText(data.cd.toString());
    sobre.setText(data.historia);
    nivel.setText(data.nivel.toString());
    if (data.truquesDescricoes?.length) {
      magic0.setText(
        data.truquesDescricoes
          .map((t) => `${t.nome}: ${t.descricao}`)
          .join(" | "),
      );
    } else {
      magic0.setText("");
    }

    if (data.magiasDescricoes?.length) {
      magic1.setText(
        data.magiasDescricoes
          .map((m) => `${m.nome}: ${m.descricao}`)
          .join(" | "),
      );
    } else {
      magic1.setText("");
    }
    forca.setText(data.for.toString());
    destreza.setText(data.des.toString());
    constituicao.setText(data.con.toString());
    inteligencia.setText(data.int.toString());
    sabedoria.setText(data.sab.toString());
    prof.setText(data.prof);
    carisma.setText(data.car.toString());
    modFor.setText(forMod);
    modDes.setText(desMod);
    modCon.setText(conMod);
    modInt.setText(intMod);
    modSab.setText(sabMod);
    modCar.setText(carMod);
    resFor.setText(data.resfor.toString());
    resDes.setText(data.resdes.toString());
    resCon.setText(data.rescon.toString());
    resInt.setText(data.resint.toString());
    resSab.setText(data.ressab.toString());
    resCar.setText(data.rescar.toString());
    nome.setText(data.nome);
    iniciativa.setText(data.iniciativa.toString());
    tendencia.setText(data.tendencia);
    raca.setText(data.raca);
    classe.setText(data.classe);
    antecedente.setText(data.antecedente);
    ca.setText(data.ca.toString());
    proficiencias.setText(data.proficiencias.join(", "));
    habilidades.setText(data.habilidades.join(" | "));
    equipamentos.setText(data.equipamentos.join(", "));
    deslocamento.setText(data.deslocamento);
    magicSlot.setText(data.slots.toString());
    vida.setText(data.pvs.toString());
    atualVida.setText(data.pvs.toString());
    // pericias
    const mapaPericias = {
      Atletismo: "atletismo_check",
      Prestidigitação: "prestidigitacao_check",
      Sobrevivência: "sobrevivencia_check",
      Acrobacia: "acrobacia_check",
      Furtividade: "furtividade_check",
      Percepção: "percepcao_check",
      Intuição: "intuicao_check",
      Arcanismo: "arcanismo_check",
      História: "historia_check",
      Natureza: "natureza_check",
      Religião: "religiao_check",
      Enganação: "blefar_check",
      Intimidação: "intimidacao_check",
      Persuasão: "persuasao_check",
      Medicina: "medicina_check",
      Sobrevivência: "sobrevivencia_check",
      "Adestrar Animais": "lidar_animais_check",
      Atuação: "atuacao_check",
      Investigação: "investigacao_check",
    };
    const atributoPericias = {
      Atletismo: "for",

      Acrobacia: "des",
      Prestidigitação: "des",
      Furtividade: "des",

      Arcanismo: "int",
      História: "int",
      Investigação: "int",
      Natureza: "int",
      Religião: "int",

      "Adestrar Animais": "sab",
      Intuição: "sab",
      Medicina: "sab",
      Percepção: "sab",
      Sobrevivência: "sab",

      Enganação: "car",
      Intimidação: "car",
      Atuação: "car",
      Persuasão: "car",
    };
    for (let i = 0; i < data.pericias.length; i++) {
      if (mapaPericias[data.pericias[i]]) {
        const checkbox = form.getCheckBox(mapaPericias[data.pericias[i]]);
        checkbox.check();
      }
    }
    for (let pericia in mapaPericias) {
      const campoCheck = mapaPericias[pericia];
      const campoValor = campoCheck.replace("_check", "");

      const atributo = atributoPericias[pericia];
      const valorBase = Math.floor((data[atributo] - 10) / 2);

      const temProficiencia = data.pericias.includes(pericia);

      const total = temProficiencia ? valorBase + 2 : valorBase;

      const field = form.getTextField(campoValor);
      field.setText(total.toString());
    }
    if (data.magiasAtaque?.length) {
      magiasAt.setText(
        data.magiasAtaque
          .slice(0, 3)
          .map((m) => `${m.nome}: ${m.ataque}`)
          .join(" | "),
      );
    } else {
      magiasAt.setText("");
    }
    if (data.armas?.length) {
      armas.setText(data.armas.map((a) => `${a.nome}: ${a.dano}`).join(" | "));
    } else {
      armas.setText("");
    }
    // magias preparadas randomicamente
    if (classesMagicas.includes(data.classe)) {
      const magias = [...data.magias];

      for (let i = magias.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [magias[i], magias[j]] = [magias[j], magias[i]];
      }

      const limite = Math.min(data.preparadas, magias.length);

      const selecionadas = magias.slice(0, limite);

      const campo = form.getTextField("magias_preparadas");
      campo.setText(selecionadas.join(", "));
    }

    // imagens do personagem
    const input1 = document.getElementById("imagem_1");
    const input2 = document.getElementById("imagem_2");

    const processarImagem = async (file, pdfDoc) => {
      const arrayBuffer = await file.arrayBuffer();

      if (file.type === "image/png") {
        return await pdfDoc.embedPng(arrayBuffer);
      } else {
        return await pdfDoc.embedJpg(arrayBuffer);
      }
    };

    if (input1.files[0]) {
      const img1 = await processarImagem(input1.files[0], pdfDoc);
      form.getButton("Imagem3_af_image").setImage(img1);
    }

    if (input2.files[0]) {
      const img2 = await processarImagem(input2.files[0], pdfDoc);
      form.getButton("Imagem72_af_image").setImage(img2);
    }
    form.updateFieldAppearances();
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.raca.replaceAll(" ", "-")}-${data.classe}-${data.antecedente.replaceAll(" ", "-")}.pdf`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => {
      window.open(url, "_blank");
    }, 100);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);
  };
}
