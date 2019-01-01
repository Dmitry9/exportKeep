const env = require('../.env');
module.exports = async page => {
    if (process.env.NODE_ENV === 'development') {
        const selectors = {
            userName: env.userName,
            password: env.password,
            emailInput: '#identifierId',
            passwordInput: '#password input',
            button1: '#identifierNext',
            button2: '#passwordNext',
        }
        await page.waitForSelector(selectors.emailInput);
        await page.type(selectors.emailInput, selectors.userName);
        await page.click(selectors.button1);
        await page.waitFor(3000);
        await page.waitForSelector(selectors.passwordInput);
        await page.type(selectors.passwordInput, selectors.password);
        await page.waitForSelector(selectors.button2);
        await page.click(selectors.button2);
    }
}
