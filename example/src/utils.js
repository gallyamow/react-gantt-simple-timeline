export const getRandomVariant = (variants) => {
  return variants[Math.floor(Math.random() * variants.length)]
}

export const formatTime = (date) => {
  return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0')
}
