import { html, Template, TemplateResult } from 'lit-html';
import { render } from 'lit-html';
import type { Router } from '../lib/router/router/types';

export function createLayout(root: HTMLElement, router: Router.API) {
  return {
    update,
  };

  function template(route: Router.RouteData | null) {
    switch (route?.name) {
      case 'post':
        return app(html`<div data-view-id="post"></div>`);
      case 'posts':
        return app(html`<div data-view-id="posts"></div>`);
      default:
        return html`<div>Home</div>`;
    }
  }

  function app(content: TemplateResult) {
    return html`${nav()}${content}`
  }

  function link(text: string, name: string, params?: any) {
    return html`
      <a href @click=${(e: any) => navigate(e, name, params)}>${text}</a>
    `;
  }

  function nav() {
    return html`
      ${link('Posts', 'posts')}
      ${link('Post', 'post', { id: 3 })}
    `;
  }

  function navigate(event: any, name: string, params?: any) {
    event.preventDefault();

    router.navigate(name, params);
  }

  function update(route: Router.RouteData) {
    render(template(route), root);
  }
}