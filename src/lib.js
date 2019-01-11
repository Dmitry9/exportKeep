const bodyParser = require('body-parser');

module.exports = {
    prepare: app => {
        app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.header("Access-Control-Allow-Headers", "Content-Type");
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            next();
        });

        app.use(bodyParser.json());
        return app;
    },
    indent: array => {
        let string = JSON.stringify(array);
        string = string
            .replace(/","/g, '",\n\t\t\t"')
            .replace(/,{/g, ',\n\t{')
            .replace(/{"/g, '{\n\t\t"')
            .replace(/\]},/g, ']\n\t},')
            .replace(/\],"/g, '],\n\t\t"');
        
        return '[\n\t' + string.slice(1, string.length - 2) + '\n\t}\n]';
    },
    cb: (pathToStore, isEnd) => {
        return err => {
            if (err) {
                console.log(err);
                process.exit(1);
            }
            else {
                console.log('Saved to file: ', pathToStore);
                if (isEnd)
                    process.exit(0);
            }
        }
    },
    handleArchived: async page => {
        try {
            await page.evaluate("document.getElementById('gbm:6').click();");
            await page.waitFor(3000);
            await page.evaluate('window.scraper.do();');
        } catch (e) { console.log('Archivation failed.', e) }
    },
};
