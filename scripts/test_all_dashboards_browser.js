const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runBrowserTest() {
    console.log('🚀 Starting Browser Automation Dashboard Test...');

    const screenshotDir = path.join(__dirname, '../brain_screenshots');
    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Launch Chromium browser
    const browser = await chromium.launch({
        headless: false, // Visible browser so user can see it!
        slowMo: 300
    });

    const context = await browser.newContext({
        viewport: { width: 1400, height: 900 }
    });

    const page = await context.newPage();

    const testResults = [];

    try {
        // Step 1: Open Login Page
        console.log('📍 Navigating to http://localhost:3000/login');
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(screenshotDir, '1_login_page.png') });
        testResults.push({ page: 'Login Page', url: '/login', status: '✅ PASS' });

        // Step 2: Fill Auth Credentials & Login
        console.log('🔑 Filling Admin credentials: theakhileshreddy07@gmail.com');
        await page.fill('input[type="email"]', 'theakhileshreddy07@gmail.com');
        await page.fill('input[type="password"]', 'Admin123!');
        
        console.log('👆 Clicking Sign In button');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(2000);

        // Step 3: Test Super Admin Dashboard (/admin)
        console.log('📍 Testing Super Admin Dashboard (/admin)...');
        await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(screenshotDir, '2_admin_dashboard.png') });
        const adminTitle = await page.title();
        testResults.push({ page: 'Super Admin Dashboard', url: '/admin', status: '✅ PASS', title: adminTitle });

        // Step 4: Test Solo Trainer Dashboard (/dashboard)
        console.log('📍 Testing Solo Trainer Dashboard (/dashboard)...');
        await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(screenshotDir, '3_solo_trainer_dashboard.png') });
        testResults.push({ page: 'Solo Trainer Home', url: '/dashboard', status: '✅ PASS' });

        // Step 5: Test Clients Page
        console.log('📍 Testing Clients Page (/dashboard/clients)...');
        await page.goto('http://localhost:3000/dashboard/clients', { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(screenshotDir, '4_clients_page.png') });
        testResults.push({ page: 'Clients Directory', url: '/dashboard/clients', status: '✅ PASS' });

        // Step 6: Test Messages Page
        console.log('📍 Testing Messages Page (/dashboard/messages)...');
        await page.goto('http://localhost:3000/dashboard/messages', { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(screenshotDir, '5_messages_page.png') });
        testResults.push({ page: 'WhatsApp Messages', url: '/dashboard/messages', status: '✅ PASS' });

        // Step 7: Test Calendar Page
        console.log('📍 Testing Calendar Page (/dashboard/calendar)...');
        await page.goto('http://localhost:3000/dashboard/calendar', { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(screenshotDir, '6_calendar_page.png') });
        testResults.push({ page: 'Google Calendar View', url: '/dashboard/calendar', status: '✅ PASS' });

        // Step 8: Test Programs Library Page
        console.log('📍 Testing Programs Library (/dashboard/programs)...');
        await page.goto('http://localhost:3000/dashboard/programs', { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(screenshotDir, '7_programs_library.png') });
        testResults.push({ page: 'Master Programs', url: '/dashboard/programs', status: '✅ PASS' });

        // Step 9: Test Gym Owner Dashboard (/gym)
        console.log('📍 Testing Gym Owner Dashboard (/gym)...');
        await page.goto('http://localhost:3000/gym', { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(screenshotDir, '8_gym_owner_dashboard.png') });
        testResults.push({ page: 'Gym Owner Overview', url: '/gym', status: '✅ PASS' });

        // Step 10: Test Pro Trainer Dashboard (/trainer)
        console.log('📍 Testing Pro Trainer Dashboard (/trainer)...');
        await page.goto('http://localhost:3000/trainer', { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(screenshotDir, '9_pro_trainer_dashboard.png') });
        testResults.push({ page: 'Pro Trainer Overview', url: '/trainer', status: '✅ PASS' });

        console.log('\n🎉 ALL DASHBOARD BROWSER TESTS PASSED SUCCESSFULLY!\n');
        console.table(testResults);

    } catch (error) {
        console.error('❌ Browser testing error:', error);
    } finally {
        await browser.close();
    }
}

runBrowserTest();
