// @types/env.d.ts
// This tells TypeScript what to expect when importing from @env
declare module '@env' {
    export const DATABASE_MODE: string;
    export const API_URL: string;
  }