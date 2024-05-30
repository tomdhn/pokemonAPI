const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe } = require('mocha');
const { app } = require('../testServer');
const { UserModel } = require('../models/user');
const { PokedexModel } = require('../models/pokedex');

chai.use(chaiHttp);
const expect = chai.expect;
let jwt = '';
let pokemonId = '';
    
describe('pokedex Route', () => {
    beforeEach(async () => {
        const userModel = new UserModel({
            username: 'testuser',
            email: 'testuser@test.com',
            password: 'password'
        });
        const user = await userModel.save();

        const pokemonModel = new PokedexModel({
            name: {
                english: 'Pikachu',
                japanese: 'ピカチュウ',
                chinese: '皮卡丘',
                french: 'Pikachu'
            },
            type: ['664b75f217e958e958a02f13'],
            base: {
                HP: 35,
                Attack: 55,
                Defense: 40,
                "Sp. Attack": 50,
                "Sp. Defense": 50,
                Speed: 90
            },
            moves: ['664b7efe86991bc22e44fdde']
        });
        const pokemon = await pokemonModel.save();

        jwt = user.generateAuthToken();
        pokemonId = pokemon._id;
    });

    afterEach(async () => {
        await UserModel.findOneAndDelete({ username: 'testuser' });
        await PokedexModel.findOneAndDelete({ "name.english": 'Pikachu'});
    });

    describe('POST /api/pokedex', () => {
        after(async () => {
            await PokedexModel.findOneAndDelete({ "name.english": 'Charmander' });
        });

        it('should create a new entry in the Pokedex', (done) => {
            chai.request(app)
                .post('/api/pokedex')
                .set('x-auth-token', jwt)
                .send({
                    name: {
                        english: 'Charmander',
                        japanese: 'ヒトカゲ',
                        chinese: '小火龙',
                        french: 'Salamèche'
                    },
                    type: ['664b75f217e958e958a02f13'],
                    base: {
                        HP: 39,
                        Attack: 52,
                        Defense: 43,
                        "Sp. Attack": 60,
                        "Sp. Defense": 50,
                        Speed: 65
                    },
                    moves: ['664b7efe86991bc22e44fdde']
                })
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('_id');
                    pokemonId = res.body._id; // Save the newly created Pokemon's ID
                    done();
                });
        });
    });

    describe('GET /api/pokedex', () => {
        it('should retrieve all entries from the Pokedex', (done) => {
            chai.request(app)
                .get('/api/pokedex')
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('GET /api/pokedex/:id', () => {
        it('should retrieve a specific entry from the Pokedex by ID', (done) => {
            chai.request(app)
                .get(`/api/pokedex/${pokemonId}`)
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('PATCH /api/pokedex/:id', () => {
        it('should partially update a specific entry in the Pokedex by ID', (done) => {
            chai.request(app)
                .patch(`/api/pokedex/${pokemonId}`)
                .set('x-auth-token', jwt)
                .send({
                    'base.HP': 40
                })
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    expect(res.body.base).to.have.property('HP', 40);
                    done();
                });
        });
    });

    describe('PUT /api/pokedex/:id', () => {
        it('should fully update a specific entry in the Pokedex by ID', (done) => {
            chai.request(app)
                .put(`/api/pokedex/${pokemonId}`)
                .set('x-auth-token', jwt)
                .send({
                    name: {
                        english: 'Pikachu',
                        japanese: 'ライチュウ',
                        chinese: '雷丘',
                        french: 'Raichu'
                    },
                    type: ['664b75f217e958e958a02f13'],
                    base: {
                        HP: 60,
                        Attack: 90,
                        Defense: 55,
                        "Sp. Attack": 90,
                        "Sp. Defense": 80,
                        Speed: 110
                    },
                    moves: []
                })
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    expect(res.body.name).to.have.property('french', 'Raichu');
                    expect(res.body.base).to.have.property('HP', 60);
                    done();
                });
        });
    });

    describe('DELETE /api/pokedex/:id', () => {
        it('should delete a specific entry from the Pokedex by ID', (done) => {
            chai.request(app)
                .delete(`/api/pokedex/${pokemonId}`)
                .set('x-auth-token', jwt)
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});