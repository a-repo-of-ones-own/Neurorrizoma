const svg = d3.select("#visualization");

const width = 700;
const height = 700;

svg.attr("viewBox", `0 0 ${width} ${height}`);

let nodeSelection;
let linkSelection;


/* =========================
   LOAD DATA
========================= */

d3.csv("nodes.csv").then(nodes => {

  console.log("Loaded nodes:", nodes);


  /* =========================
     CREATE LINKS
     
     For now:
     node 1 → node 2
     node 2 → node 3
     node 3 → node 4
     etc.
     
     and last → first
  ========================= */

  const links = [];

  for (let i = 0; i < nodes.length - 1; i++) {

    links.push({
      source: nodes[i].id,
      target: nodes[i + 1].id
    });

  }


  if (nodes.length > 2) {

    links.push({
      source: nodes[nodes.length - 1].id,
      target: nodes[0].id
    });

  }


  console.log("Links:", links);



  /* =========================
     CREATE LINKS FIRST
     
     This is important so they
     stay BEHIND the nodes.
  ========================= */

  linkSelection = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("class", "link")
    .attr("stroke", "#777")
    .attr("stroke-width", 3)
    .style("opacity", 0.5);



 /* CREATE NODES */
nodeSelection = svg
  .append("g")
  .attr("class", "nodes")
  .selectAll("g")
  .data(nodes)
  .join("g")
  .attr("class", "node");


/* DEFINITIONS FOR CIRCULAR CROPPING */
const defs = svg.append("defs");

defs
  .selectAll("clipPath")
  .data(nodes)
  .join("clipPath")
  .attr("id", d => `clip-${d.id}`)
  .append("circle")
  .attr("r", 50)
  .attr("cx", 0)
  .attr("cy", 0);


/* PURPLE BACKGROUND CIRCLE */
nodeSelection
  .append("circle")
  .attr("r", 55)
  .attr("fill", "purple");


/* IMAGE CROPPED TO CIRCLE */
nodeSelection
  .append("image")
  .attr("href", d => d.image)
  .attr("x", -50)
  .attr("y", -50)
  .attr("width", 100)
  .attr("height", 100)
  .attr("clip-path", d => `url(#clip-${d.id})`)
  .attr("preserveAspectRatio", "xMidYMid slice");


/* OPTIONAL BORDER */
nodeSelection
  .append("circle")
  .attr("r", 50)
  .attr("fill", "none")
  .attr("stroke", "white")
  .attr("stroke-width", 3);


/* LABEL */
nodeSelection
  .append("text")
  .text(d => d.label)
  .attr("text-anchor", "middle")
  .attr("y", 75)
  .attr("font-size", 14);



  /* =========================
     TOOLTIP
  ========================= */

  nodeSelection
    .append("title")
    .text(d => d.description);



  /* =========================
     FORCE SIMULATION
  ========================= */

  const simulation = d3
    .forceSimulation(nodes)

    .force(
      "link",
      d3
        .forceLink(links)
        .id(d => d.id)
        .distance(180)
    )

    .force(
      "charge",
      d3
        .forceManyBody()
        .strength(-500)
    )

    .force(
      "center",
      d3.forceCenter(
        width / 2,
        height / 2
      )
    )

    .force(
      "collision",
      d3.forceCollide(75)
    );



  /* =========================
     MOVE EVERYTHING
  ========================= */

  simulation.on("tick", () => {

    linkSelection

      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)

      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);


    nodeSelection.attr(
      "transform",
      d => `translate(${d.x},${d.y})`
    );

  });



  /* =========================
     SCROLLYTELLING FUNCTIONS
  ========================= */

  window.showEverything = function () {

    nodeSelection
      .transition()
      .duration(700)
      .style("opacity", 1);

    linkSelection
      .transition()
      .duration(700)
      .style("opacity", 0.3);

  };


  window.showConnections = function () {

    nodeSelection
      .transition()
      .duration(700)
      .style("opacity", 1);

    linkSelection
      .transition()
      .duration(700)
      .style("opacity", 0.9);

  };


  window.highlightCluster = function () {

    nodeSelection
      .transition()
      .duration(700)
      .style(
        "opacity",
        d =>
          d.group === "neurodivergence"
            ? 1
            : 0.1
      );

    linkSelection
      .transition()
      .duration(700)
      .style("opacity", 0.1);

  };


  window.showRhizome = function () {

    nodeSelection
      .transition()
      .duration(700)
      .style("opacity", 1);

    linkSelection
      .transition()
      .duration(700)
      .style("opacity", 0.6);

  };


  showEverything();

})
.catch(error => {

  console.error(
    "Could not load nodes.csv:",
    error
  );

});
