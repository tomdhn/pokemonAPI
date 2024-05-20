const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const config = require('config');
const port = config.get('server.port');
const app = express();

app.use(express.json());
app.use(cors({
  credentials: true,
}));

// Serve Swagger UI
const swaggerFile = require('./swagger-output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

mongoose.connect("mongodb+srv://administrator:XaWNziD4gvpbcaM4@pokemonapi.wdum6mb.mongodb.net/PokemonDB")
.then(()=> console.log('Connected to MongoDB'))
.catch(err => console.log('Could not connect to MongoDB...'));

const userRouter = require('./routes/user');
const typesRouter = require('./routes/types');
const pokedexRouter = require('./routes/pokedex');
const movesRouter = require('./routes/moves');

app.use('/api/user', userRouter);
app.use('/api/types', typesRouter);
app.use('/api/pokedex', pokedexRouter);
app.use('/api/moves', movesRouter);

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});
