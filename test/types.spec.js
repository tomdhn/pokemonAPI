const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe } = require('mocha');
const { app } = require('../testServer');
const { UserModel } = require('../models/user');
const { TypesModel } = require('../models/types');

chai.use(chaiHttp);
const expect = chai.expect;
let jwt = '';
let typeId = '';

describe('types Route', () => {
    beforeEach(async () => {
        const userModel = new UserModel({
            username: 'testuser',
            email: 'testuser@test.com',
            password: 'password'
        });
        const user = await userModel.save();

        const typeModel = new TypesModel({
            english: 'Normal2'
        });
        const type = await typeModel.save();

        jwt = user.generateAuthToken();
        typeId = type._id;
    });

    afterEach(async () => {
        await UserModel.findOneAndDelete({ username: 'testuser' });
        await TypesModel.findOneAndDelete({ english: 'Normal2' });
    });

    describe('POST /api/types', () => {
        after(async () => {
            await TypesModel.findOneAndDelete({ english: 'azerty1' });
        });

        it('should create a new type', (done) => {
            chai.request(app)
                .post('/api/types')
                .set('x-auth-token', jwt)
                .send({
                    english: 'azerty1',
                    chinese: '中文1',
                    japanese: '日本語1',
                    french: 'Français1'
                })
                .end((err, res) => {
                    if(err) return console.error(err);
                    if(res.status !== 200) return console.error(res);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('_id');
                    done();
                });
        });
    });

    describe('GET /api/types', () => {
        it('should retrieve all types', (done) => {
            chai.request(app)
                .get('/api/types')
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('GET /api/types/:id', () => {
        it('should retrieve a specific type by ID', (done) => {
            chai.request(app)
                .get(`/api/types/${typeId}`)
                .end((err, res) => {
                    if(err) return console.error(err);
                    if(res.status === 404) return console.error(res);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('PATCH /api/types/:id', () => {
        it('should partially update a specific type by ID', (done) => {
            chai.request(app)
                .patch(`/api/types/${typeId}`)
                .set('x-auth-token', jwt)
                .send({
                    french: 'Eau2'
                })
                .end((err, res) => {
                    if(err) return console.error(err);
                    if(res.status !== 200) return console.error(res);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('french', 'Eau2');
                    done();
                });
        });
    });

    describe('PUT /api/types/:id', () => {
        it('should fully update a specific type by ID', (done) => {
            chai.request(app)
                .put(`/api/types/${typeId}`)
                .set('x-auth-token', jwt)
                .send({
                    english: 'Water2',
                    chinese: '草2',
                    japanese: 'くさ2',
                    french: 'Herbe2'
                })
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('french', 'Herbe2');
                    done();
                });
        });
    });

    describe('DELETE /api/types/:id', () => {
        it('should delete a specific type by ID', (done) => {
            chai.request(app)
                .delete(`/api/types/${typeId}`)
                .set('x-auth-token', jwt)
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});