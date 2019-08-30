import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';

export default class FullController extends Controller {
  @tracked selectedNodes

  constructor(owner, args) {
    super(...arguments)
    this.selectedNodes = ['tg', 'xero', 'shopify']
  }

  updateSelected(node) {
    if (this.selectedNodes.includes(node)) {
      this.selectedNodes = this.selectedNodes.reject((s) => s === node);
    } else {
      this.selectedNodes = [...this.selectedNodes, node];
    }
  }

  get filteredNodes() {
    return {
      nodes: this.model.nodes.filter((node) => this.get('selectedNodes').includes(node.id)),
      links: this.model.links.filter((link) => {
        return (this.get('selectedNodes').includes(link.source) || this.get('selectedNodes').includes(link.source.id))
          && (this.get('selectedNodes').includes(link.target) || this.get('selectedNodes').includes(link.target.id))
      })
    }
  }
}
