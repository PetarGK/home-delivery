const api = require('lambda-api')();

api.use((req, res, next) => {
    res.cors();
    next();
});

api.get('/restaurants', (req, res) => {
    res.send({ foo: 'bar' });
});

export const handle = async (event, context) => {

    return api.run(event, context);
}