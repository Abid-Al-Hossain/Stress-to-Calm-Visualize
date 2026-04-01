declare module "flubber" {
  export function interpolate(
    fromShape: string,
    toShape: string,
    options?: { maxSegmentLength?: number; string?: boolean }
  ): (t: number) => string;
  export function separate(
    fromShape: string,
    toShapes: string[],
    options?: { maxSegmentLength?: number; string?: boolean }
  ): ((t: number) => string)[];
  export function combine(
    fromShapes: string[],
    toShape: string,
    options?: { maxSegmentLength?: number; string?: boolean }
  ): ((t: number) => string)[];
}
