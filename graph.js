function showEverything() {

  d3.selectAll(".node")
    .transition()
    .duration(800)
    .style("opacity", 1);

  d3.selectAll(".link")
    .transition()
    .duration(800)
    .style("opacity", 0.15);
}


function showConnections() {

  d3.selectAll(".link")
    .transition()
    .duration(800)
    .style("opacity", 0.7);
}


function highlightCluster() {

  d3.selectAll(".node")
    .transition()
    .duration(800)
    .style("opacity", d =>
      d.group === "autism" ? 1 : 0.1
    );
}


function showRhizome() {

  d3.selectAll(".node")
    .transition()
    .duration(800)
    .style("opacity", 1);

  d3.selectAll(".link")
    .transition()
    .duration(800)
    .style("opacity", 0.4);
}
