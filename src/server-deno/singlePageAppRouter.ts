import { Router, RouterMiddleware } from 'https://deno.land/x/oak@v9.0.1/router.ts'
import { js } from './httpResponse.ts'
import { getLogger } from './logging.ts'

const serveStaticFiles =
  (root: string): RouterMiddleware =>
  async ctx => {
    const path = ctx.params.path || 'index.html'
    await ctx.send({ root, path })
  }

export const singlePageAppRouter = async (root: string, compileJavascript: boolean) => {
  const router = new Router()

  if (compileJavascript) {
    const appJsPath = './src/client/index.jsx'

    getLogger().debug('Bundling JS...')
    const { files } = await Deno.emit(appJsPath, {
      bundle: 'module',
      compilerOptions: {
        allowJs: true,
        jsx: 'react',
        checkJs: true,
      },
    })
    getLogger().debug('JS Bundling finished.')

    router.get('/index.js', ctx => js(ctx, files['deno:///bundle.js']))
  }

  return router.get('/', serveStaticFiles(root)).get('/:path', serveStaticFiles(root))
}
