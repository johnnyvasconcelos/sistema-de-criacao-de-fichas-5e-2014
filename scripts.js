{
  const dados = {};
  const steps = document.querySelectorAll(".step");
  const inputs = document.querySelectorAll(".etapa");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("change", (ev) => {
      const dado = ev.target.name;
      dados[dado] = ev.target.value;
      const atualStep = ev.target.closest(".step");
      const index = Array.from(steps).indexOf(atualStep);
      if (steps[index + 1]) {
        steps[index].classList.remove("on");
        steps[index + 1].classList.add("on");
      }
      console.log(dados);
    });
  }
}
