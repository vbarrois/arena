import * as d3 from 'd3'

import NodeDef from '../../../../../common/survey/nodeDef'

// ResizeObserver polyfill
if (typeof ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    constructor (callback) {
      this.observables = []
      // Array of observed elements that looks like this:
      // [{
      //   el: domNode,
      //   size: {height: x, width: y}
      // }]
      this.boundCheck = this.check.bind(this)
      this.boundCheck()
      this.callback = callback
    }

    observe (el) {
      if (this.observables.some((observable) => observable.el === el)) {
        return
      }
      const newObservable = {
        el: el,
        size: {
          height: el.clientHeight,
          width: el.clientWidth
        }
      }
      this.observables.push(newObservable)
    }

    unobserve (el) {
      this.observables = this.observables.filter(obj => obj.el !== el)
    }

    disconnect () {
      this.observables = []
    }

    check () {
      const changedEntries = this.observables.filter((obj) => {
        const currentHeight = obj.el.getBBox().height
        const currentWidth = obj.el.getBBox().width

        if (obj.size.height !== currentHeight || obj.size.width !== currentWidth) {
          obj.size.height = currentHeight
          obj.size.width = currentWidth

          return true
        }
      }).map((obj) => obj.el)

      if (changedEntries.length > 0) {
        this.callback(changedEntries)
      }
      this.af = window.requestAnimationFrame(this.boundCheck)
    }

    terminate () {
      window.cancelAnimationFrame(this.af)
    }
  }
}

const svgMargin = { top: 40, right: 100, bottom: 40, left: 100 }

const nodeRadiusInit = 1e-6
const nodeRadius = 16
const nodeLabelDist = nodeRadius + 3
const nodeLinkLength = 200

const transitionDuration = 500

export default class SurveyHierarchyTree {

  constructor (domElement, data, lang, onEntityClick) {
    this.nodesByUuidMap = {}
    this.lang = lang
    this.data = data
    this.domElement = domElement
    this.onEntityClick = (nodeDefUuid) => {
      onEntityClick(nodeDefUuid)
      this.expandToNode(nodeDefUuid)
    }

    this.svg = null
    this.tree = null
    this.root = null

    this.svgWidth = null

    this.rootG = null
    this.resizeObserver = null

    this.initSvg()
  }

  collapseNode (node) {
    if (node.children) {
      node._children = node.children
      node._children.forEach((child) => this.collapseNode(child))
      node.children = null
    }
  }

  toggleNode (node) {
    if (node.children) {
      this.collapseNode(node)
    } else {
      node.children = node._children
      node._children = null
    }

    this.update(node)
  }

  initNode (node, collapseChildren = false) {
    this.nodesByUuidMap[node.data.uuid] = node

    if (node.children) {
      node.children.forEach(childNode => {
        this.initNode(childNode)

        if (collapseChildren) {
          this.collapseNode(childNode)
        }
      })

    }
  }

  initSvg () {
    // Set the dimensions and margins of the diagram
    const width = this.domElement.clientWidth - svgMargin.left - svgMargin.right
    const height = this.domElement.clientHeight - svgMargin.top - svgMargin.bottom

    this.svgWidth = width

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    this.svg = d3.select(this.domElement)
      .append('svg')
      .attr('width', width + svgMargin.right + svgMargin.left)
      .attr('height', height + svgMargin.top + svgMargin.bottom)
      .append('g')
      .attr('id', 'root_g')

    this.rootG = document.getElementById('root_g')

    const svgEl = document.getElementsByTagName('svg')[0]
    const treeEl = document.getElementsByClassName('survey-hierarchy__tree')[0]

    this.resizeObserver = new ResizeObserver(entries => {
      const bBox = this.rootG.getBBox()
      const newWidth = bBox.width
      const newHeight = bBox.height

      if (newWidth > svgEl.getAttribute('width')) {
        treeEl.scrollTo(newWidth, treeEl.scrollTop)
      }

      svgEl.setAttribute('width', newWidth)
      svgEl.setAttribute('height', newHeight)

      // svg.setAttribute('viewBox', `-${svgMargin.left} ${bBox.y} ${newWidth} ${newHeight}`)
      d3.select(this.rootG).attr('transform', `translate(${svgMargin.left}, ${-bBox.y})`)
    })
    this.resizeObserver.observe(this.rootG)

    // declares a tree layout and assigns the size
    this.tree = d3.tree().size([height, width])
      .nodeSize([50, 10]).separation((a, b) => 1)

    // Assigns parent, children, height, depth
    this.root = d3.hierarchy(this.data, d => d.children)
    this.root.x0 = height / 2
    this.root.y0 = 0

    this.initNode(this.root, true)

    // Collapse the node and all it's children
    this.update(this.root)
  }

  update (node) {
    const treeData = this.tree(this.root)

    const nodes = this.updateNodes(treeData, node)

    this.updateLinks(treeData, node)

    // Store the old positions for transition
    nodes.forEach(d => {
      d.x0 = d.x
      d.y0 = d.y
    })

  }

  terminate () {
    this.resizeObserver.unobserve(this.rootG)
    this.resizeObserver.terminate && this.resizeObserver.terminate()
  }

  // resizeSvg (enlarge) {
  //   // const maxDepth = R.pipe(
  //   //   R.values,
  //   //   R.filter(R.prop('children')),
  //   //   R.map(R.prop('depth')),
  //   //   R.reduce(R.max, -1),
  //   //   R.inc
  //   // )(this.nodesByUuidMap)

  //   // // Get current size
  //   // const svg = document.getElementsByTagName('svg')[0]
  //   // const oldWidth = svg.getAttribute('width')
  //   // const newWidth = nodeLinkLength * maxDepth + svgMargin.left + 150

  //   const svg = document.getElementsByTagName('svg')[0]
  //   // const oldWidth = svg.getAttribute('width')
  //   const newWidth = document.getElementById('root_g').getBBox().width
  //   svg.setAttribute('width', newWidth)
  //   // if (enlarge && newWidth > oldWidth) {
  //   //   svg.setAttribute('width', newWidth)
  //   //   // svg.setAttribute('viewBox', `0 0 ${newWidth} 1000`)
  //   // } else if (!enlarge && newWidth < oldWidth) {
  //   //   svg.setAttribute('width', newWidth)
  //   //   // svg.setAttribute('viewBox', `0 0 ${newWidth} 1000`)
  //   // }
  //   // mySVG.setAttribute("viewBox", "0 0 100 100");
  // }

  updateNodes (treeData, source) {
    // // Compute the new tree layout
    // this.resizeSvg()

    // // Normalize for fixed-depth
    // const maxDepth = R.pipe(
    //   R.values,
    //   R.filter(R.prop('children')),
    //   R.map(R.prop('depth')),
    //   R.reduce(R.max, -1),
    //   R.inc
    // )(this.nodesByUuidMap)

    // document.getElementsByTagName('svg')[0]
    //   .setAttribute('width', nodeLinkLength * maxDepth + svgMargin.left + 150)

    // if (nodeLinkLength * maxDepth + svgMargin.left < this.svgWidth)
    //   nodes.forEach(d => { d.y = d.depth * nodeLinkLength })

    const nodes = treeData.descendants()

    nodes.forEach(d => { d.y = d.depth * nodeLinkLength })

    const node = this.svg.selectAll('g.node')
      .data(nodes, d => d.data.uuid)

    // Enter any new nodes at the parent's previous position
    const nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${source.y0}, ${source.x0})`)

    const hasChildren = d => d.children || d._children

    // Add labels for the nodes
    const fo = nodeEnter
      .append('foreignObject')
      .attr('x', d => NodeDef.isRoot(d.data) ? -100 : 0)
      // .attr('x', 0)
      //.attr('y', d => hasChildren(d) ? -(nodeLabelDist * 3) : -nodeLabelDist)
      .attr('y', -nodeLabelDist)
      .attr('width', 150)
      .attr('height', 40)

    const grid = fo.append('xhtml:div')
      .attr('class', 'node-grid')

    grid.append('xhtml:a')
      .on('click', d => this.onEntityClick(d.data.uuid))
      .text(d => NodeDef.getLabel(d.data, this.lang))

    grid.append('xhtml:button')
      .attr('class', 'btn')
      .style('display', d => hasChildren(d) ? 'block' : 'none')
      .on('click', d => this.toggleNode(d))
      .append('xhtml:span')
      .attr('class', 'icon icon-tree icon-12px')

    // UPDATE
    const nodeUpdate = nodeEnter.merge(node)

    // Transition to the proper position for the node
    nodeUpdate.transition()
      .duration(transitionDuration)
      .attr('transform', d => `translate(${d.y}, ${d.x})`)
      // .on('start', () => { this.resizeSvg(true) })
      // .on('end', () => { this.resizeSvg(false) })

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
      .attr('r', d => hasChildren(d) ? nodeRadius : nodeRadiusInit)
      .attr('class', d => 'node' + (hasChildren(d) ? '' : ' leaf'))

    // Remove any exiting nodes
    const nodeExit = node.exit().transition()
      .duration(transitionDuration)
      .attr('transform', d => `translate(${source.y}, ${source.x})`)
      .remove()

    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
      .attr('r', nodeRadiusInit)

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
      .style('fill-opacity', nodeRadiusInit)

    return nodes
  }

  updateLinks (treeData, node) {
    const links = treeData.descendants().slice(1)

    // Update the links...
    const link = this.svg.selectAll('path.link')
      .data(links, d => d.data.uuid)

    // Creates a curved (diagonal) path from parent to the child nodes
    const diagonal = (s, d) =>
      `M ${s.y} ${s.x}
        C ${(s.y + d.y) / 2} ${s.x},
          ${(s.y + d.y) / 2} ${d.x},
          ${d.y} ${d.x}`

    // Enter any new links at the parent's previous position
    const linkEnter = link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', d => {
        const o = { x: node.x0, y: node.y0 }
        return diagonal(o, o)
      })

    // UPDATE
    const linkUpdate = linkEnter.merge(link)

    // Transition back to the parent element position
    linkUpdate.transition()
      .duration(transitionDuration)
      .attr('d', d => diagonal(d, d.parent))

    // Remove any exiting links
    link.exit().transition()
      .duration(transitionDuration)
      .attr('d', d => {
        const o = { x: node.x, y: node.y }
        return diagonal(o, o)
      })
      .remove()
  }

  expandToNode (uuid) {
    let currentUuid = uuid
    while (this.nodesByUuidMap[currentUuid].parent) {
      const n = this.nodesByUuidMap[currentUuid].parent

      if (n._children) {
        n.children = n._children
        n._children = null
      }
      currentUuid = n.data.uuid
    }

    this.update(this.root)

    this.svg.selectAll('.node-grid')
      .attr('class', 'node-grid')
      .filter(d => d.data.uuid === uuid)
      .attr('class', 'node-grid highlight')
  }

}