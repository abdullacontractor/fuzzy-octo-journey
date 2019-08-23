import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';

export default class FullController extends Controller {
  @tracked selectedNodes

  constructor(owner, args) {
    super(...arguments)
    this.selectedNodes = ['Xero', 'QBO']
  }

  get filteredNodes() {
    let rootNode = JSON.parse(JSON.stringify(this.model))
    let children = rootNode.children

    rootNode.children = children.filter((child) => {
      return this.get('selectedNodes').includes(child.id)
    })

    return rootNode
  }
}
