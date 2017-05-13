module.exports.extract = (pattern, str) => {
  const matches = []
  str.replace(pattern, function (match, ...args) {
    if (!match) return
    args.splice(-2, 2)
    matches.splice(0, 0, ...args)
  })
  return matches
}
