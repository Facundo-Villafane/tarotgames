export function rgbString([r, g, b]: [number, number, number]): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function rgbArrayToString(rgbArray: [number, number, number][]): string[] {
  return rgbArray.map(rgb => rgbString(rgb));
}