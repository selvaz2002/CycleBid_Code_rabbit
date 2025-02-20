export const rgbaToHex = (rgba, forceRemoveAlpha = false) => {
  return (
    '#' +
    rgba
      .replace(/^rgba?\(|\s+|\)$/g, '') 
      .split(',') 
      .filter((string, index) => !forceRemoveAlpha || index !== 3)
      .map(string => parseFloat(string))
      .map((number, index) => (index === 3 ? Math.round(number * 255) : number))
      .map(number => number.toString(16)) 
      .map(string => (string.length === 1 ? '0' + string : string)) 
      .join('')
  )
}