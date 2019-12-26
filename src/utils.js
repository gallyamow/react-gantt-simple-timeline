export function isSizeEqual (a, b) {
  return a.width === b.width && a.height === b.height
}

/**
 * @param {Array} array1
 * @param {Array} array2
 * @returns {boolean}
 */
export function isArrayOfSizesEqual (array1, array2) {
  if (array1.length !== array2.length) {
    return false
  }
  return array1.every((size1, i) => {
    return isSizeEqual(size1, array2[i])
  })
}
