export const oneWeekFromNow = () =>
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
export const oneWeekAgo = () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
export const fifteenMinsFromNow = () => new Date(Date.now() + 15 * 60 * 1000);
export const ONE_DAY_MS = 24 * 60 * 60 * 1000;
