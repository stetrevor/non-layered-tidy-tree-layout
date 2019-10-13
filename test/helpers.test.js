import { BoundingBox } from '../src/helpers'

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
