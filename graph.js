const svg = d3.select("#visualization");

const width = 700;
const height = 700;

svg.attr("viewBox", `0 0 ${width} ${height}`);


/* These variables will hold our graph elements */

let nodeSelection;
let linkSelection;


/* =====================================================
   SCROLLYTELLING FUNCTIONS
   ===================================================== */

function showEverything() {

  if (!nodeSelection) return;

  nodeSelection
    .transition()
    .duration(800)
    .style("opacity", 1);

  linkSelection
    .transition()
    .duration(800)
    .style("opacity", 0.2);
}


function showConnections() {

  if (!linkSelection) return;

  linkSelection
    .transition()
    .duration(800)
    .style("opacity", 0.8);
}


function highlightCluster() {

  if (!nodeSelection) return;

  nodeSelection
    .transition()
    .duration(800)
    .style(
      "opacity",
      d =>
        d.group === "neurodivergence"
          ? 1
          : 0.1
    );

  linkSelection
    .transition()
    .duration(800)
    .style("opacity", 0.05);
}


function showRhizome() {

  if (!nodeSelection) return;

  nodeSelection
    .transition()
    .duration(800)
    .style("opacity", 1);

  linkSelection
    .transition()
    .duration(800)
    .style("opacity", 0.5);
}



/* =====================================================
   LOAD CSV
   ===================================================== */

d3.csv("nodes.csv")
  .then(nodes => {

    console.log("Loaded nodes:", nodes);


    /* -----------------------------------------------
       CREATE SIMPLE LINKS AUTOMATICALLY
       ----------------------------------------------- */

    const links = [];

    for (let i = 0; i < nodes.length - 1; i++) {

      links.push({
        source: nodes[i].id,
        target: nodes[i + 1].id
      });

    }


    /* Connect last node back to first */

    if (nodes.length > 2) {

      links.push({
        source: nodes[nodes.length - 1].id,
        target: nodes[0].id
      });

    }



    /* =====================================================
       LINKS
       ===================================================== */

    linkSelection = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-width", 2)
      .style("opacity", 0.2);



    /* =====================================================
       NODE CONTAINERS
       ===================================================== */

    nodeSelection = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "node");



    /* =====================================================
       NODE IMAGES
       ===================================================== */

    nodeSelection
      .append("image")
      .attr("href", d => d.image)
      .attr("x", -40)
      .attr("y", -40)
      .attr("width", 80)
      .attr("height", 80)
      .attr(
        "preserveAspectRatio",
        "xMidYMid slice"
      );



    /* =====================================================
       LABELS
       ===================================================== */

    nodeSelection
      .append("text")
      .text(d => d.label)
      .attr("text-anchor", "middle")
      .attr("y", 58)
      .attr("font-size", 14);



    /* =====================================================
       TOOLTIPS
       ===================================================== */

    nodeSelection
      .append("title")
      .text(d => d.description);



    /* =====================================================
       FORCE SIMULATION
       ===================================================== */

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
        d3.forceCollide(70)
      );



    /* =====================================================
       UPDATE POSITIONS
       ===================================================== */

    simulation.on("tick", () => {

      linkSelection

        .attr(
          "x1",
          d => d.source.x
        )

        .attr(
          "y1",
          d => d.source.y
        )

        .attr(
          "x2",
          d => d.target.x
        )

        .attr(
          "y2",
          d => d.target.y
        );


      nodeSelection.attr(
        "transform",
        d => `translate(${d.x},${d.y})`
      );

    });



    showEverything();

  })

  .catch(error => {

    console.error(
      "Could not load nodes.csv:",
      error
    );

  });
