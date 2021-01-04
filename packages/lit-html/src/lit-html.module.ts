import { App, Modules } from '@crux/app';
import { Container } from '@crux/di';
import { TemplateResult } from 'lit-html';

export function createLitHtmlModule(
  app: Container.API<App.Services>,
): Modules.Module {
  const router = app.get('router');

  app.add('link', () => createLink);

  return {};

  function createLink(
    html: (
      strings: TemplateStringsArray,
      ...values: unknown[]
    ) => TemplateResult,
  ) {
    return function link({
      classname,
      params = null,
      route,
      text,
    }: {
      classname?: string;
      params?: any;
      route: string;
      text: string;
    }): TemplateResult {
      return html`<a
        href
        classname="${classname ?? ''}"
        @click="${(e: Event) => navigate(route, params, e)}"
        >${text}</a
      >`;
    };
  }

  function navigate(route: string, params: any, event: Event) {
    event.stopPropagation();
    event.preventDefault();

    router.navigate(route, params);
  }
}
