const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe } = require('mocha');
const { app } = require('../testServer');
const { MovesModel } = require('../models/moves');
const { UserModel } = require('../models/user');

chai.use(chaiHttp);
const expect = chai.expect;
let jwt = '';
let moveId = '';

describe('Moves Route', () => {
    beforeEach(async () => {
        const userModel = new UserModel({
            username: 'testuser',
            email: 'testuser@test.com',
            password: 'password'
        });
        const user = await userModel.save();

        const move = new MovesModel({
            accuracy: 100,
            category: 'Physical',
            ename: 'Tackle',
            cname: '撞擊',
            jname: 'たいあたり',
            fname: 'Charge',
            power: 40,
            pp: 35,
            type: '664b757517e958e958a02ef8'
        });
        await move.save();
        moveId = move._id;
        jwt = user.generateAuthToken();
    });

    afterEach(async () => {
        await UserModel.findOneAndDelete({ username: 'testuser' });
        await MovesModel.findOneAndDelete({ ename: 'Tackle' });
    });

    describe('POST /api/moves', () => {
        after(async () => {
            await MovesModel.findOneAndDelete({ ename: 'Bubble' });
        });
        it('should create a new move', (done) => {
            chai.request(app)
                .post('/api/moves')
                .set('x-auth-token', jwt)
                .send({
                    accuracy: 100,
                    category: 'Special',
                    ename: 'Bubble',
                    cname: '泡泡',
                    jname: 'あわ',
                    fname: 'Écume',
                    power: 40,
                    pp: 30,
                    type: '664b75e817e958e958a02f0f'
                })
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('_id');
                    done();
                });
        });
    });

    describe('GET /api/moves', () => {
        it('should get all moves', (done) => {
            chai.request(app)
                .get('/api/moves')
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('GET /api/moves/:id', () => {
        it('should get a move by ID', (done) => {
            chai.request(app)
                .get(`/api/moves/${moveId}`)
                .set('x-auth-token', jwt)
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('PATCH /api/moves/:id', () => {
        it('should partially update a move by ID', (done) => {
            chai.request(app)
                .patch(`/api/moves/${moveId}`)
                .set('x-auth-token', jwt)
                .send({
                    accuracy: 90
                })
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('accuracy', 90);
                    done();
                });
        });
    });

    describe('PUT /api/moves/:id', () => {
        it('should fully update a move by ID', (done) => {
            chai.request(app)
                .put(`/api/moves/${moveId}`)
                .set('x-auth-token', jwt)
                .send({
                    accuracy: 95,
                    category: 'Physical',
                    ename: 'Tackle',
                    cname: '撞擊II',
                    jname: 'たいあたりII',
                    fname: 'Charge II',
                    power: 50,
                    pp: 40,
                    type: '664b757517e958e958a02ef8'
                })
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('accuracy', 95);
                    expect(res.body).to.have.property('fname', 'Charge II');
                    done();
                });
        });
    });

    describe('DELETE /api/moves/:id', () => {
        it('should delete a move by ID', (done) => {
            chai.request(app)
                .delete(`/api/moves/${moveId}`)
                .set('x-auth-token', jwt)
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});