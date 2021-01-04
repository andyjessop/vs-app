(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports)
    : typeof define === 'function' && define.amd
    ? define(['exports'], factory)
    : ((global =
        typeof globalThis !== 'undefined' ? globalThis : global || self),
      factory((global['lit-html'] = {})));
})(this, function (exports) {
  'use strict';

  var types = /*#__PURE__*/ Object.freeze({
    __proto__: null,
  });

  function createLitHtmlModule(app) {
    const router = app.get('router');
    app.add('link', () => createLink);
    return {};
    function createLink(html) {
      return function link({ classname, params = null, route, text }) {
        return html`<a
          href
          classname="${classname !== null && classname !== void 0
            ? classname
            : ''}"
          @click="${(e) => navigate(route, params, e)}"
          >${text}</a
        >`;
      };
    }
    function navigate(route, params, event) {
      event.stopPropagation();
      event.preventDefault();
      router.navigate(route, params);
    }
  }

  exports.LitHtml = types;
  exports.createLitHtmlModule = createLitHtmlModule;

  Object.defineProperty(exports, '__esModule', { value: true });
});
//# sourceMappingURL=lit-html.js.map
