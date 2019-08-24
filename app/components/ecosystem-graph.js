import Component from '@glimmer/component';
import { action } from '@ember/object';
import { select, selectAll } from 'd3-selection';
import { hierarchy } from 'd3-hierarchy';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force';

export default class EcosystemGraph extends Component {

  @action
  renderGraph(element) {
    let width = this.args.width;
    let height = this.args.height;
    const nodeSize = 45;
    const nodePadding = 15;

    let svg = select(element);
    let nodes = this.args.content.nodes;
    let links = this.args.content.links;

    // Lines
    let link = svg.selectAll('path.link')
      .data(links);
    link.exit()
      .remove();
    // link.enter()
    //   .append('path')
    //   .attr("class", "link")
    //   .attr("stroke-width", 1)
    //   .style("stroke", "#eee");

    // Nodes
    let node = svg.selectAll('g.node')
      .data(nodes, (d) => d.id);
    node.exit()
      .remove();
    let nodeEnter = node.enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', function(d) { return `translate(${d.x || width / 2},${d.y || height / 2})`; })

    let circles = nodeEnter
      .append("circle")
      .attr("r", (d) => d.size || nodeSize)
      .style("fill", "#fff")
      .style("stroke", "#eee")
      .style("stroke-width", 2);

    // let lables = nodeEnter
    //   .append("text")
    //   .attr("dy", 5)
    //   .attr("text-anchor", "middle")
    //   .text(function(d) { return d.id });

    let images = nodeEnter
      .append("image")
      .attr("xlink:href", (d) => d.img)
      .attr("x", (d) => -d.size || -nodeSize)
      .attr("y", (d) => -d.size || -nodeSize)
      .attr("height", (d) => 2 * (d.size || nodeSize))
      .attr("width", (d) => 2 * (d.size || nodeSize));

    let forceCentering = forceCenter(this.args.width / 2, this.args.height / 2);

    let forceCharges = forceManyBody()
      .strength(50)
      // .theta(0.1)
      // .distanceMin(1)
      // .distanceMax(1)

    let forceLinks = forceLink()
      .links(links)
      .id((d) => d.id)
      // .distance(30)
      // .strength(0)

    let forceCollision = forceCollide()
      .radius((d) => (d.size || nodeSize) + nodePadding)
      // .strength(0.7)

    this.simulation = forceSimulation()
      .nodes(nodes)
      .alpha(0.1)
      .force("link", forceLinks)
      .force("charge", forceCharges)
      .force("center", forceCentering)
      .force("collide", forceCollision)
      .on("tick", () => {
        svg.selectAll('path.link')
        .attr("d", function(d) {
          let sourceData = d.source;
          let targetData = d.target;
          var dx = targetData.x - sourceData.x;
          var dy = targetData.y - sourceData.y;
          // var dr = Math.sqrt(dx * dx + dy * dy);
          var dr = 0;

          return `M${sourceData.x},${sourceData.y}A${dr},${dr} 0 0,1 ${targetData.x},${targetData.y}`;
        });

        svg.selectAll('g.node')
          .attr("transform", (d) => `translate(${d.x},${d.y})`);
      });
  }
}
