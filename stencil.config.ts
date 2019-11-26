import { Config } from '@stencil/core';

export const config: Config = {
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