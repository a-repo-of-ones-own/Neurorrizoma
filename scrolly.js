const scroller = scrollama();

scroller
  .setup({
    step: ".step",
    offset: 0.5
  })
  .onStepEnter(handleStepEnter);


function handleStepEnter(response) {

  const step = response.index;

  // highlight active text block

  document
    .querySelectorAll(".step")
    .forEach(el => el.classList.remove("is-active"));

  response.element.classList.add("is-active");


  // tell visualization what to do

  if (step === 0) {
    showEverything();
  }

  if (step === 1) {
    showConnections();
  }

  if (step === 2) {
    highlightCluster();
  }

  if (step === 3) {
    showRhizome();
  }
}
