const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests', timeout: 45000, expect:{timeout:10000}, retries: process.env.CI ? 1 : 0, workers:1, fullyParallel:false,
  use: { baseURL: 'http://127.0.0.1:4173', headless: true, screenshot: 'only-on-failure', trace: 'retain-on-failure', video: 'retain-on-failure', launchOptions:{args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']} },
  webServer: { command: 'npm run serve', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI, timeout:60000 },
  reporter: process.env.CI ? [['github'],['html',{open:'never'}]] : 'list'
});
