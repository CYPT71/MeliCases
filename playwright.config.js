const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests', timeout: 30000, retries: 1,
  use: { baseURL: 'http://127.0.0.1:4173', headless: true, screenshot: 'only-on-failure', trace: 'retain-on-failure', video: 'retain-on-failure', launchOptions:{args:['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']} },
  webServer: { command: 'npm run serve', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
  reporter: process.env.CI ? [['github'],['html',{open:'never'}]] : 'list'
});