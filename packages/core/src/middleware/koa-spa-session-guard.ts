import { MiddlewareType } from 'koa';
import { IRouterParamContext } from 'koa-router';
import { Provider } from 'oidc-provider';

// Need To Align With UI
export const sessionNotFoundPath = '/unknown-session';
export const guardedPath = ['/sign-in', '/register', '/social-register'];

export default function koaSpaSessionGuard<
  StateT,
  ContextT extends IRouterParamContext,
  ResponseBodyT
>(provider: Provider): MiddlewareType<StateT, ContextT, ResponseBodyT> {
  return async (ctx, next) => {
    const requestPath = ctx.request.path;
    const isPreview = ctx.request.URL.searchParams.get('preview');
    const isSessionRequiredPath = guardedPath.some((path) => requestPath.startsWith(path));

    if (isSessionRequiredPath && !isPreview) {
      try {
        await provider.interactionDetails(ctx.req, ctx.res);
      } catch {
        ctx.redirect(sessionNotFoundPath);

        return;
      }
    }

    return next();
  };
}
