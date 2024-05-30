const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe } = require('mocha');
const { app } = require('../testServer');
const { UserModel } = require('../models/user');
const bcrypt = require('bcrypt');

chai.use(chaiHttp);
const expect = chai.expect;
let jwt = '';
let userId = '';

describe('Login Route', () => {
    beforeEach(async () => {
        chai.request(app)
            .post('/api/user/register')
            .send({ username: 'testuser', email: 'testuser@test.com', password: 'password' })
            .end((err, res) => {
                if(err) return done(err);
                jwt = res.header['x-auth-token'];
                userId = res.body._id;
            });
    });

    it('should return a token when valid credentials are provided', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@test.com',
                password: 'password'
            })
            .end((err, res) => {
                if (err) return done(err);
                if(res.status === 400) return done(res);
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return an error when invalid credentials are provided', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({
                email: 'invalid@example.com',
                password: 'invalidpassword'
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.text).to.equal('Invalid email or password');
                done();
            });
    });

    it('should return an error when email is missing', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({
                password: 'testpassword'
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.text).to.equal('"email" is required');
                done();
            });
    });

    it('should return an error when password is missing', (done) => {
        chai.request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com'
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.text).to.equal('"password" is required');
                done();
            });
    });
});