export const formatCryptoAmount = (amt: string) => {
  const num = parseFloat(amt)
  if (isNaN(num)) return '0'
  if (num < 0.000001) return num.toExponential(4)
  if (num < 1) return num.toFixed(8)
  if (num < 100) return num.toFixed(6)
  return num.toFixed(4)
}
