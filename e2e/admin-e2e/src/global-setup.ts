import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
    // Your global setup code here (e.g., database seeding)
}

export default globalSetup;