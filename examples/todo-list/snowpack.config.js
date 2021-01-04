module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: '/',
    '../../packages/app/src': '/packages/app/src/',
    '../../packages/lit-html/src': '/packages/lit-html/src/',
  },
  plugins: ['@snowpack/plugin-typescript'],
  installOptions: {
    installTypes: true,
  },
};
