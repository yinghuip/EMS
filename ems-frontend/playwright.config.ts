import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  use: {
    headless: true,
    baseURL: 'http://localhost:4200'
  },
  webServer: {
    command: 'npm start',
    port: 4200,
    timeout: 120 * 1000,
    reuseExistingServer: false
  }
};

export default config;
