export const concat = (...arrays: (Uint8Array | number[])[]): Uint8Array =>
    arrays.reduce((a, b) => Uint8Array.from([...a, ...b]), new Uint8Array(0)) as Uint8Array;

export const range = (start: number, end:number, step = 1): number[] =>
  Array.from({length: end - start})
    .map((_, i) => i * step  + start)
