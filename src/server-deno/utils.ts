import type { Context } from 'https://deno.land/x/oak@v9.0.1/context.ts'

export const getIp = (ctx: Context): string => ctx.request.ip
export const decode = (str: string) => atob(str)
export const encode = (str: string) => btoa(str)

export const ensureCorrectEnv = (envStr: string): 'dev' | 'prod' => {
  if (envStr !== 'dev' && envStr !== 'prod') {
    throw new Error(`${envStr} is incorrect environment`)
  }

  return envStr
}
