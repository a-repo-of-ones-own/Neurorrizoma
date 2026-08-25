const svg = d3.select("#visualization");

const width = 700;
const height = 700;

svg.attr("viewBox", `0 0 ${width} ${height}`);


d3.csv("nodes.csv").then(nodes => {

  console.log("NODES LOADED:", nodes);


  // Simple test positions
  const positions = [
    { x: 200, y: 250 },
    { x: 500, y: 250 },
    { x: 350, y: 450 }
  ];


  nodes.forEach((d, i) => {

    d.x = positions[i]?.x || 350;
    d.y = positions[i]?.y || 350;

  });


  // create nodes
  const node = svg
    .selectAll(".node")
    .data(nodes)
    .join("g")
    .attr("class", "node")
    .attr(
      "transform",
      d => `translate(${d.x},${d.y})`
    );


  // add circles so we KNOW something is visible
  node
    .append("circle")
    .attr("r", 60)
    .attr("fill", "purple");


  // add images
  node
    .append("image")
    .attr("href", d => d.image)
    .attr("x", -50)
    .attr("y", -50)
    .attr("width", 100)
    .attr("height", 100);


  // add labels
  node
    .append("text")
    .attr("text-anchor", "middle")
    .attr("y", 80)
    .text(d => d.label);


  // functions used by Scrollama

  window.showEverything = function () {

    node
      .transition()
      .duration(500)
      .style("opacity", 1);

  };


  window.showConnections = function () {

    node
      .transition()
      .duration(500)
      .style("opacity", 0.6);

  };


  window.highlightCluster = function () {

    node
      .transition()
      .duration(500)
      .style(
        "opacity",
        d =>
          d.group === "neurodivergence"
            ? 1
            : 0.1
      );

  };


  window.showRhizome = function () {

    node
      .transition()
      .duration(500)
      .style("opacity", 1);

  };

})
.catch(error => {

  console.error("CSV ERROR:", error);

});
