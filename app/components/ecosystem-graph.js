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

    let svg = this.svg || select(element);
    this.svg = svg;
    let rootNode = hierarchy(this.args.content);
    let nodes = this.flatten(this.args.content);
    let links = rootNode.links();


    // Lines
    let link = svg.selectAll('path.link')
      .data(links);
    link.exit()
      .remove();
    link.enter()
      .append('path')
      .attr("class", "link")
      .attr("stroke-width", 1)
      .style("stroke", "#eee");

    // Nodes
    let node = svg.selectAll('g.node')
      .data(nodes);
    node.exit()
      .remove();
    let nodeEnter = node.enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', function(d) { return `translate(${d.x || width / 2},${d.y || height / 2})`; })

    let circles = nodeEnter
      .append("circle")
      .attr("r", function(d) { return d.size || 45; })
      .style("fill", "#fff")
      .style("stroke", "#eee")
      .style("stroke-width", 2);

    let lables = nodeEnter
      .append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .text(function(d) { return d.id });

    let images = nodeEnter
      .append("image")
      .attr("xlink:href",  function(d) { return d.img; })
      .attr("x", function(d) { return -45; })
      .attr("y", function(d) { return -45; })
      .attr("height", 90)
      .attr("width", 90);

    let forceCentering = forceCenter(this.args.width / 2, this.args.height / 2);

    let forceCharges = forceManyBody()
      .strength(-10)
      .theta(0.9)
      .distanceMin(1)
      // .distanceMax(1)

    let forceLinks = forceLink()
      .links(links)
      // .distance(30)
      // .strength(0)

    let forceCollision = forceCollide()
      .radius((d) => d.size || 45)
      // .strength(0.7)

    this.simulation = forceSimulation()
      .force("link", forceLinks)
      .force("charge", forceCharges)
      .force("center", forceCentering)
      .force("collide", forceCollision)

    this.simulation
      .nodes(nodes)
      .on("tick", () => {
        svg.selectAll('path.link')
        .attr("d", function(d) {
          let sourceData = d.source.data;
          let targetData = d.target.data;
          var dx = targetData.x - sourceData.x;
          var dy = targetData.y - sourceData.y;
          // var dr = Math.sqrt(dx * dx + dy * dy);
          var dr = 0;

          return `M${sourceData.x},${sourceData.y}A${dr},${dr} 0 0,1 ${targetData.x},${targetData.y}`;
        });

        svg.selectAll('g.node')
          .attr("transform", (d) => {return `translate(${d.x},${d.y})`});
      });
  }

  flatten(root) {
    var nodes = [];
    var i = 0;

    function recurse(node) {
      nodes.push(node);
      if (node.children) {
        node.children.forEach(recurse);
      }
      if (!node.id) {
        node.id = ++i;
      }
    }

    recurse(root);
    return nodes;
  }
}
