module.exports = async page => {
    if (process.env.NODE_ENV === 'development') {
        const env = {
            userName: 'fakeTestDummy9@gmail.com',
            password: 'crushTestDummy',
            emailInput: '#identifierId',
            // passwordInput: 'input[type="password"]',
            passwordInput: '#password input',
            button1: '#identifierNext',
            button2: '#passwordNext',
        }
        await page.waitForSelector(env.emailInput);
        await page.type(env.emailInput, env.userName);
        await page.click(env.button1);
        await page.waitFor(3000);
        await page.waitForSelector(env.passwordInput);
        await page.type(env.passwordInput, env.password);
        await page.waitForSelector(env.button2);
        await page.click(env.button2);
    }
}
