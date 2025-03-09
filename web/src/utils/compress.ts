// 1.1 设定待压缩图片最大限制像素为 80*80 = 6400像素
// 因为受限于部分浏览器对canvas图片一次性绘制的大小限制，保守设置一次绘制6400像素的瓦片
let IMG_LIMIT_SIZE = 80 * 80

// 1.2 设定待压缩图片期待压缩过程的切成多个瓦片，每个瓦片的像素为 40*40 = 1600像素
// 因为受限于部分浏览器对canvas图片一次性绘制的大小限制，保守设置一次绘制1600像素的瓦片
let PIECE_SIZE = 40 * 40

/**
 * 压缩图片
 * @param {Image} img
 * @param {object} opts
 *   opts.type: 输出图片类型
 *   opts.encoderOptions: 压缩比例，范围在[0,1]，只在 type='image/jpeg'时候有效
 * @return {string} 输出类型
 */

const dfOpt = {
  type: 'image/jpeg',
  encoderOptions: 0.5,
  img_limit_size: 80 * 80,
  piece_size: 40 * 40,
}
type DfOpt = Partial<typeof dfOpt>

export const compressImage = function (img: any, opts?: DfOpt) {
  const { type, encoderOptions, img_limit_size, piece_size } = { ...dfOpt, ...(opts || {}) }
  const w = img.width
  const h = img.height
  let outputW = w
  let outputH = h

  IMG_LIMIT_SIZE = img_limit_size || dfOpt.img_limit_size
  PIECE_SIZE = piece_size || dfOpt.piece_size

  // 获取原始图片尺寸
  const imageSize = w * h
  // 2. 计算原始图片与最大限制尺寸(长度/宽度)的比例情况
  // 由于是面积换算比例，所以要取开平方才能清晰知道原始像素为最大限制像素的长度/宽度比例
  // 例如: 原始图片像素为  8000 * 8000 = 64,000,000 六千四百万像素
  //      是最大图片限制  2000 * 2000 像素的 长度/宽度的四倍
  let ratio = Math.ceil(Math.sqrt(Math.ceil(imageSize / IMG_LIMIT_SIZE)))

  if (ratio > 1) {
    // 如果原始图片像素长宽比限制像素尺寸大
    // 就换算出压缩后图片尺寸的长度和宽度
    outputW = w / ratio
    outputH = h / ratio
  }
  else {
    // 剩下情况都是比例为1，即无需压缩，原样输出
    ratio = 1
  }

  const canvas = document.createElement('canvas')
  const tempCanvas = document.createElement('canvas')
  const context: any = canvas.getContext('2d')
  canvas.width = outputW
  canvas.height = outputH
  context.fillStyle = '#FFFFFF'
  context?.fillRect(0, 0, canvas.width, canvas.height)

  // 计算需要拆分的瓦片数量
  const pieceCount = Math.ceil(imageSize / PIECE_SIZE)

  if (pieceCount > 1) {
    // 如果瓦片数量大于1，就需要进行瓦片绘制到一个临时tempCanvas里
    // 再把临时的tempCanvas根据压缩后换算的长度/宽度，x轴位置和y轴位置，绘制到结果的canvas位置上
    // 直到所有瓦片按照结果尺寸和瓦片数量拼接完毕

    const pieceW = Math.ceil(canvas.width / pieceCount)
    const pieceH = Math.ceil(canvas.height / pieceCount)

    tempCanvas.width = pieceW
    tempCanvas.height = pieceH
    const tempContext = tempCanvas.getContext('2d')

    const sw = pieceW * ratio
    const sh = pieceH * ratio
    const dw = pieceW
    const dh = pieceH
    for (let i = 0; i < pieceCount; i++) {
      for (let j = 0; j < pieceCount; j++) {
        const sx = i * pieceW * ratio
        const sy = j * pieceH * ratio
        tempContext?.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh)
        context?.drawImage(tempCanvas, i * pieceW, j * pieceH, dw, dh)
      }
    }

    tempContext?.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
    tempCanvas.width = 0
    tempCanvas.height = 0
  }
  else {
    // 如果瓦片数量小于1，即可以安全绘制到结果canvas里
    context?.drawImage(img, 0, 0, outputW, outputH)
  }

  // 将结果的canvas输出成base64
  // 上述压缩的是尺寸，这里使用 encoderOptions 压缩的是质量，可以理解为清晰度
  const base64 = canvas.toDataURL(type, encoderOptions)
  context?.clearRect(0, 0, canvas.width, canvas.height)
  canvas.width = 0
  canvas.height = 0

  return base64
}
