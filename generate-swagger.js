const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'pokemon-api',
        description: 'API Documentation for the Pokemon API',
    },
    host: 'https://pokemonapi-kjniw4ie4a-ew.a.run.app',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    apis: ["./routes/*.js"],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation has been generated.');
});
