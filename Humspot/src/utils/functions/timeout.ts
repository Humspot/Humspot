/**
 * @function timeout
 * @description utility function that allows the developer to mimic request latency in milliseconds.
 * 
 * @param {number} delay the amount of time in ms to wait before returning.
 */
export function timeout(delay: number): Promise<unknown> {
  return new Promise((res) => setTimeout(res, delay));
}