export function getRandomName() {
  return (Math.random() + 1).toString(36).substring(2).toUpperCase();
}

export function randomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// TODO: refactor
export function gaussian(mean: number, stdev: number) {
  let y2: number;
  let usePrev = false;
  return function () {
    let y1;
    if (usePrev) {
      y1 = y2;
      usePrev = false;
    } else {
      let x1, x2, w;
      do {
        x1 = 2.0 * Math.random() - 1.0;
        x2 = 2.0 * Math.random() - 1.0;
        w = x1 * x1 + x2 * x2;
      } while (w >= 1.0);
      w = Math.sqrt((-2.0 * Math.log(w)) / w);
      y1 = x1 * w;
      y2 = x2 * w;
      usePrev = true;
    }

    let retval = mean + stdev * y1;
    if (retval > 0) return retval;
    return -retval;
  };
}

// TODO: Marsaglia polar method.
export function normal(
  mu: number = 0,
  sigma: number = 1,
  nsamples: number = 6
) {
  let run_total = 0;
  for (var i = 0; i < nsamples; i++) {
    run_total += Math.random();
  }

  return (sigma * (run_total - nsamples / 2)) / (nsamples / 2) + mu;
}
