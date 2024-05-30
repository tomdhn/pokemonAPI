const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe } = require('mocha');
const { app } = require('../testServer');
const { UserModel } = require('../models/user');

chai.use(chaiHttp);
const expect = chai.expect;
let jwt = '';
let userId = '';

describe('User Route', () => {
    beforeEach(async () => {
        const userModel = new UserModel({
            username: 'testuser',
            email: 'testuser@test.com',
            password: 'password'
        });
        const user = await userModel.save();
        jwt = user.generateAuthToken();
        userId = user._id;
    });
    afterEach(async () => {
        await UserModel.findOneAndDelete({ username: 'testuser' });
    });

    describe('User Register', () => {
        afterEach(async () => {
            await UserModel.findOneAndDelete({ username: 'New User' });
        });
        it('should return 400 if validation fails', (done) => {
            chai.request(app)
                .post('/api/user/register')
                .send({}) 
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(400);
                    done();
                });
        });

        it('should register a new user', (done) => {
            chai.request(app)
                .post('/api/user/register')
                .send({
                    username: 'New User',
                    email: 'test@example.com',
                    password: 'password'
                })
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('_id');
                    expect(res.body).to.have.property('username', 'New User');
                    expect(res.body).to.have.property('email', 'test@example.com');
                    expect(res).to.have.header('x-auth-token');
                    done();
                });
        });
    });

    describe('/GET users', () => {
        it('it should GET all the users', (done) => {
            chai.request(app)
                .get('/api/user')
                .set('x-auth-token', jwt)
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('GET /api/user/:id', () => {
        it('should get a user by ID', (done) => {
            chai.request(app)
                .get('/api/user/' + userId)
                .set('x-auth-token', jwt)
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('username', 'testuser');
                    expect(res.body).to.have.property('email', 'testuser@test.com');
                    done();
                });
        });
    });

    describe('PATCH /api/user/:id', () => {
        it('should partially update a user by ID', (done) => {
            chai.request(app)
                .patch(`/api/user/${userId}`)
                .set('x-auth-token', jwt)
                .send({
                    email: 'updated@example.com'
                })
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('email', 'updated@example.com');
                    done();
                });
        });
    });

    describe('PUT /api/user/:id', () => {
        it('should fully update a user by ID', (done) => {
            chai.request(app)
                .put(`/api/user/${userId}`)
                .set('x-auth-token', jwt)
                .send({
                    username: 'testuser',
                    email: 'updated@example.com',
                    password: 'updatedpassword'
                })
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('username', 'testuser');
                    expect(res.body).to.have.property('email', 'updated@example.com');
                    done();
                });
        });
    });

    describe('DELETE /api/user/:id', () => {
        it('should delete a user by ID', (done) => {
            chai.request(app)
                .delete(`/api/user/${userId}`)
                .set('x-auth-token', jwt)
                .end((err, res) => {
                    if(err) return console.error(err);
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});