const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const config = require('config');
const port = 3001;
const app = express();

// Check if jwtPrivateKey is defined
if (!config.get('jwtPrivateKey')){
  console.error('FATAL ERROR: jwtPrivateKey not defined');
  process.exit(1);
  }

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
const auth = require('./routes/auth');

app.use('/api/user', userRouter);
app.use('/api/types', typesRouter);
app.use('/api/pokedex', pokedexRouter);
app.use('/api/moves', movesRouter);
app.use('/api/auth', auth);

app.listen(port, () => {
    console.log("Server Listening on PORT:", port);
});

module.exports = { app };