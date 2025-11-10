// Simple logger utility
export const logger = {
  info: (msg: string) => console.info(`[INFO] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
};
