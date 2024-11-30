export const debug = (text: string, ...args: unknown[]) => {
  if (__DEV__) {
    console.log("\n-----------------\n" + text, ...args);
  }
};
