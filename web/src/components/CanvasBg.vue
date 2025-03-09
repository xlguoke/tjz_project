<script setup lang="ts">
interface Point {
  x: number
  y: number
  vx: number
  vy: number
}
const canvas = ref<HTMLCanvasElement | null>(null)
const points: Point[] = []
let ctx: CanvasRenderingContext2D | null = null

/**
 * 初始化canvas
 */
function canvasInit() {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d')
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
    if (!ctx)
      return

    // 初始化圆点
    for (let i = 0; i < 100; i++) {
      points.push({
        x: Math.random() * canvas.value.width,
        y: Math.random() * canvas.value.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      })
    }

    // 开始动画循环
    requestAnimationFrame(animate)
  }
}

/**
 * 动画循环
 */
function animate() {
  if (!ctx)
    return
  if (canvas.value && ctx) {
    // 清除画布
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

    // 更新每个点的位置
    points.forEach((point) => {
      point.x += point.vx
      point.y += point.vy
      if (canvas.value) {
        // 边界检测，反弹
        if (point.x > canvas.value.width || point.x < 0)
          point.vx *= -1
        if (point.y > canvas.value.height || point.y < 0)
          point.vy *= -1
      }

      // 绘制点
      if (ctx) {
        ctx.beginPath()
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#18e1ff'
        ctx.fill()
      }

      // 连接附近的点
      points.forEach((otherPoint) => {
        if (point !== otherPoint) {
          const distance = Math.sqrt(
            (point.x - otherPoint.x) ** 2 + (point.y - otherPoint.y) ** 2,
          )
          if (distance < 100 && ctx) {
            // 计算线条的透明度，越近的点，线条越明显
            const alpha = Math.max(0, Math.min(1, 1 - distance / 100))
            ctx.beginPath()
            ctx.moveTo(point.x, point.y)
            ctx.lineTo(otherPoint.x, otherPoint.y)
            ctx.strokeStyle = `rgba(51, 170, 255, ${alpha})`
            ctx.stroke()
          }
        }
      })
    })

    // 请求下一帧动画
    requestAnimationFrame(animate)
  }
}

onMounted(() => {
  canvasInit()
})
</script>

<template>
  <canvas
    ref="canvas"
    class="canvas-bg"
    fixed
    top-0
    lef-0
    w-screen
    h-screen
    z-0
  />
</template>

<style scoped>

</style>
