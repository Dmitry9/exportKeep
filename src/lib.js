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
    cb: pathToStore => {
        return err => err
            ? console.log(err)
            :  console.log('Saved to file: ', pathToStore)
                || process.exit(0);
    },
};
