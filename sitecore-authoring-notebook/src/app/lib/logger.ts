// lib/logger.ts

const isDebugEnabled = process.env.LOG_DEBUG === 'true';

export function log(...args: any[]) {
  if (isDebugEnabled) console.log(...args);
}

export function warn(...args: any[]) {
  if (isDebugEnabled) console.warn(...args);
}

export function error(...args: any[]) {
  if (isDebugEnabled) console.error(...args);
}
