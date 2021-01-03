module.exports = {
  mount: {
    public: { url: '/', static: true },
    src: '/',
    '../../packages/app/src': '/packages/app/src/',
  },
  plugins: ['@snowpack/plugin-typescript'],
  installOptions: {
    installTypes: true,
  },
};
