const update = (ctx) => {
  const date = new Date()
  ctx.value = `${date.toDateString()} ${date.toLocaleTimeString()}`
}

module.exports = (ctx) => {
  update(ctx)
  setInterval(() => update(ctx), 7777)
}

