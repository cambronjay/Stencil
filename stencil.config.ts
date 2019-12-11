import { Config } from '@stencil/core';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export const config: Config = {
  plugins: [
    nodePolyfills()
  ],
  commonjs: {
    namedExports: {
      'node_modules/idb/build/idb.js': ['openDb'],
      'node_modules/firebase/dist/index.cjs.js': ['initializeApp', 'firestore']
    }
  },
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      baseUrl: 'https://stencil.local/'
    }
  ],
  globalStyle: 'src/global.css',
  globalScript: 'src/global/app.ts',
  copy: [
    { src: 'robots.txt' }
  ]
};