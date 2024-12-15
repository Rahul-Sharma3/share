export const withLoadingDelay = (callback, delay = 500) => {
  return new Promise(resolve => {
    setTimeout(() => {
      callback();
      resolve();
    }, delay);
  });
}; 