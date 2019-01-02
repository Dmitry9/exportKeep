module.exports = async page => {
    if (process.env.NODE_ENV === 'development') {
        let { GoogleUserName, GooglePassword } = process.env; 
        if (!GoogleUserName) {
            const env = require('../.env');
            GoogleUserName = env.GoogleUserName;
            GooglePassword = env.GooglePassword
        }
        console.log(GoogleUserName, GooglePassword);
        process.exit(1);
        
        const selectors = {
            userName: GoogleUserName,
            password: GooglePassword,
            emailInput: '[type="email"]',
            passwordInput: '[type="password"]',
        }

        // await page.screenshot({ path: './img.png' });
        await page.waitForSelector(selectors.emailInput);
        await page.type(selectors.emailInput, selectors.userName);
        await page.keyboard.press('Enter');
        await page.waitFor(3000);
        await page.waitForSelector(selectors.passwordInput);
        await page.type(selectors.passwordInput, selectors.password);
        await page.keyboard.press('Enter');
    }
}
