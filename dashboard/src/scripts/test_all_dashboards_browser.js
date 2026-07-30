const { chromium } = require('playwright');
const path = require('path');

async function runLiveVisualBrowserTest() {
    console.log('🖥️ Opening VISUAL HEADFUL BROWSER WINDOW on your screen...');

    // Launch visible Chromium browser window with slowMo typing & clicking
    const browser = await chromium.launch({
        headless: false, // VISIBLE WINDOW ON USER'S DESKTOP SCREEN!
        slowMo: 1200     // 1.2s delay per action so user can visually see typing & clicking
    });

    const context = await browser.newContext({
        viewport: { width: 1366, height: 768 }
    });

    const page = await context.newPage();

    try {
        // Step 1: Open Login Page
        console.log('📍 1. Navigating to Login Page (http://localhost:3000/login)...');
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        // Step 2: Type Admin Email & Password Live on Screen
        console.log('⌨️ 2. Typing Email: theakhileshreddy07@gmail.com');
        await page.fill('input[type="email"]', 'theakhileshreddy07@gmail.com');
        await page.waitForTimeout(1000);

        console.log('⌨️ 3. Typing Password: Admin123!');
        await page.fill('input[type="password"]', 'Admin123!');
        await page.waitForTimeout(1000);

        console.log('👆 4. Clicking Sign In button...');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(3000);

        // Step 3: Visually Navigate Super Admin Dashboard (/admin)
        console.log('📍 5. Opening Super Admin Dashboard (/admin)...');
        await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // Step 4: Visually Navigate Solo Trainer Dashboard (/dashboard)
        console.log('📍 6. Opening Solo Trainer Dashboard (/dashboard)...');
        await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // Step 5: Visually Navigate Clients Directory (/dashboard/clients)
        console.log('📍 7. Opening Clients Directory (/dashboard/clients)...');
        await page.goto('http://localhost:3000/dashboard/clients', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // Step 6: Visually Navigate WhatsApp Messages (/dashboard/messages)
        console.log('📍 8. Opening WhatsApp Messages (/dashboard/messages)...');
        await page.goto('http://localhost:3000/dashboard/messages', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // Step 7: Visually Navigate Calendar (/dashboard/calendar)
        console.log('📍 9. Opening Google Calendar View (/dashboard/calendar)...');
        await page.goto('http://localhost:3000/dashboard/calendar', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // Step 8: Visually Navigate Master Programs (/dashboard/programs)
        console.log('📍 10. Opening Master Programs Library (/dashboard/programs)...');
        await page.goto('http://localhost:3000/dashboard/programs', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // Step 9: Visually Navigate Gym Owner Dashboard (/gym)
        console.log('📍 11. Opening Gym Owner Dashboard (/gym)...');
        await page.goto('http://localhost:3000/gym', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // Step 10: Visually Navigate Pro Trainer Dashboard (/trainer)
        console.log('📍 12. Opening Pro Trainer Dashboard (/trainer)...');
        await page.goto('http://localhost:3000/trainer', { waitUntil: 'networkidle' });
        await page.waitForTimeout(4000);

        console.log('✅ Visual browser walkthrough completed!');

    } catch (error) {
        console.error('Browser interaction notice:', error.message);
    } finally {
        await browser.close();
    }
}

runLiveVisualBrowserTest();
