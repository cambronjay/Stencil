import { Config } from '@stencil/core';

export const config: Config = {
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