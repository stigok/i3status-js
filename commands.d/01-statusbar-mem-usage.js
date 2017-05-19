const interval = 10000

function update (ctx) {
  const mibs = process.memoryUsage().rss / 1024 / 1024 
  ctx.value = `nodemem: ${mibs | 0} MiB`
}

module.exports = ctx => {
  update(ctx)
  setInterval(() => update(ctx), interval)
}

