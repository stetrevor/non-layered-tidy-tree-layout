import { layout, Tree } from './algorithm'

class BoundingBox {
  /**
   * @param {number} gap - the gap between sibling nodes
   * @param {number} bottomPadding - the height reserved for connection drawing
   */
  constructor(gap, bottomPadding) {
    this.gap = gap
    this.bottomPadding = bottomPadding
  }

  addBoundingBox(width, height) {
    return { width: width + this.gap, height: height + this.bottomPadding }
  }

  /**
   * Return the coordinate without the bounding box for a node
   */
  removeBoundingBox(x, y) {
    return { x: x + this.gap / 2, y }
  }
}

class Layout {
  constructor(boundingBox) {
    this.bb = boundingBox
  }

  /**
   * Layout treeData.
   */
  layoutTreeData(treeData) {
    const tree = this.convert(treeData)
    layout(tree)
    this.assignCoordinates(tree, treeData)

    return treeData
  }

  /**
   * Returns Tree to layout, with bounding boxes added to each node.
   */
  convert(treeData, y = 0) {
    if (treeData === null) return null

    const { width, height } = this.bb.addBoundingBox(
      treeData.width,
      treeData.height
    )
    let children = []
    if (treeData.children && treeData.children.length) {
      for (let i = 0; i < treeData.children.length; i++) {
        children[i] = this.convert(treeData.children[i], y + height)
      }
    }

    return new Tree(width, height, y, children)
  }

  /**
   * Assign layout tree x, y coordinates back to treeData,
   * with bounding boxes removed.
   */
  assignCoordinates(tree, treeData) {
    const { x, y } = this.bb.removeBoundingBox(tree.x, tree.y)
    treeData.x = x
    treeData.y = y
    for (let i = 0; i < tree.c.length; i++) {
      this.assignCoordinates(tree.c[i], treeData.children[i])
    }
  }
}

export { Layout, BoundingBox }
