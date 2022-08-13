import type {
  NextApiRequest,
  NextApiResponse,
} from 'next'
import { avvvatars } from '../../src'

export default async function handler(
  {
    query,
  }: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    value,
    size,
  } = query as Record<string, string>
  const canvas = avvvatars({
    value,
    size: parseInt(size, 10),
  })
  const image = await canvas.encode('webp')

  res.setHeader(
    'Content-Type',
    'image/webp',
  )
  res.status(200).send(image)
}
