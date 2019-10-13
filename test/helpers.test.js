import { BoundingBox, Layout } from '../src/helpers'

test('bounding box', () => {
  const bb = new BoundingBox(10, 20)
  expect(bb.addBoundingBox(100, 200)).toEqual(
    expect.objectContaining({
      width: 110,
      height: 220
    })
  )
  expect(bb.removeBoundingBox(10, 120)).toEqual(
    expect.objectContaining({
      x: 15,
      y: 120
    })
  )
})

test('Layout class', () => {
  const data = {
    width: 10,
    height: 10,
    children: [
      {
        width: 10,
        height: 10,
        children: [{ width: 150, height: 10, children: [] }]
      },
      { width: 10, height: 10, children: [] },
      { width: 10, height: 10, children: [] },
      { width: 10, height: 10, children: [] },
      { width: 10, height: 20, children: [] }
    ]
  }
  const bb = new BoundingBox(10, 10)
  const layout = new Layout(bb)
  const { boundingBox } = layout.layout(data)

  expect(data).toEqual(expect.objectContaining({ x: 120, y: 0 }))
  expect(data.children[0]).toEqual(expect.objectContaining({ x: 75, y: 20 }))
  expect(data.children[1]).toEqual(expect.objectContaining({ x: 97.5, y: 20 }))
  expect(data.children[2]).toEqual(expect.objectContaining({ x: 120, y: 20 }))
  expect(data.children[3]).toEqual(expect.objectContaining({ x: 142.5, y: 20 }))
  expect(data.children[4]).toEqual(expect.objectContaining({ x: 165, y: 20 }))
  expect(data.children[0].children[0]).toEqual(
    expect.objectContaining({ x: 5, y: 40 })
  )

  expect(boundingBox).toEqual(
    expect.objectContaining({ left: 5, right: 175, top: 0, bottom: 50 })
  )
})
