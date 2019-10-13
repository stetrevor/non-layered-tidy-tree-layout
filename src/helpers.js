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
  layout(treeData) {
    const tree = this.convert(treeData)
    layout(tree)
    this.assignCoordinates(tree, treeData)
    const size = this.getSize(treeData)

    size.left = this.bb.gap / 2
    size.top = 0
    return { result: treeData, size }
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

  /**
   * Return the width and height needed to draw the tree,
   * without the bounding boxes.
   * 
   * Remember after assignCoordinates, the leftest node in the tree
   * already has its x set at BoundingBox.gap / 2. It is the client's
   * responsibility to account for this when drawing.
   */
  getSize(treeData, box=null) {
    if (box === null) {
      box = { right: 0, bottom: 0 }
    }
    box.right = Math.max(box.right, treeData.x + treeData.width)
    box.bottom = Math.max(box.bottom, treeData.y + treeData.height)

    for (const child of treeData.children) {
      this.getSize(child, box)
    }

    return box
  }
}

export { Layout, BoundingBox }
