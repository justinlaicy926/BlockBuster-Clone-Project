const request = require('supertest');
const { Genre } = require('../../models/genre');
const {User} = require('../../models/user');

describe('auth middleware', ()=> {
    beforeEach( ()=> { server = require('../../index'); });
    afterEach( async ()=> { 
        await Genre.remove({});
        server.close(); 
    });
    
    let token;


    //the happy path where everything goes right
    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x_auth-token', token)
            .send({ name: 'genre1'});
    }

    beforeEach(()=> {
        token = new User().generateAuthToken();
    })
    it('should return 401 if no token is provided', async ()=> {
        //token is passed as a string, so an empty string should be passed in the case of no token
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it('should return 400 if an invalid token is provided', async ()=> {
        token = 'a';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 200 if token is valid', async ()=> {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});