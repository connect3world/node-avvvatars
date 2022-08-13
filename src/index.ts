import {
  Canvas,
  createCanvas,
  FillType,
  Path2D,
} from '@napi-rs/canvas'
import {
  scale,
  translate,
} from 'transformation-matrix'
import {
  BACKGROUND_COLORS,
  SHAPE_COLORS,
} from './lib/colors'
import randomNumber from './lib/random'
import { shapes } from './lib/shapes'

export type Config = {
  value: string
  size?: number
}

export type Format = Parameters<Canvas['encode']>[0]

const SHAPE_INITIAL_SIZE = 32

export function avvvatars({
  value,
  size = 32,
}: Config): Canvas {
  // Get color key for given value
  const colorKey = randomNumber({
    value,
    min: 0,
    max: 19,
  })
  const backgroundColor = BACKGROUND_COLORS[colorKey]
  const shapeColor = SHAPE_COLORS[colorKey]

  // Get shape key for given value
  const shapeKey = randomNumber({
    value,
    min: 0,
    max: 59,
  })

  // Get the size of the shape
  const shapeSize = Math.round(size / 100 * 50)
  const shapeScale = Math.round(shapeSize / SHAPE_INITIAL_SIZE)

  // Prepare canvas
  const canvas = createCanvas(
    size,
    size,
  )

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // Draw background
  ctx.fillStyle = backgroundColor
  ctx.fillRect(
    0,
    0,
    size,
    size,
  )

  // Draw shape
  const shapePath = new Path2D(shapes[shapeKey])
  shapePath.setFillType(FillType.EvenOdd)
  shapePath.transform(scale(shapeScale))
  const shapePosition = (size - shapeSize) / 2
  shapePath.transform(translate(
    shapePosition,
    shapePosition,
  ))

  ctx.fillStyle = shapeColor
  ctx.fill(shapePath.asWinding())

  return canvas
}
