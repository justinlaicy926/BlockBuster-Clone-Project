const { describe } = require('joi/lib/types/lazy');
const { default: mongoose } = require('mongoose');
const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
let server

describe('/api/genres', () => {
    beforeEach( ()=> { server = require('../../index'); });
    afterEach( async ()=> {
        server.close(); 
        await Genre.remove({});
    });

    describe('GET /', ()=> {
        it('should return all genres', ()=>{
            await Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'}
            ]);

            const res = await request(server).get('./api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g=> g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g=> g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', ()=> {
        it('should return a genre if a valid id is passed', ()=>{
            const genre = new Genre({name: 'genre1'});
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre.id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if no genre with the given id exists', ()=>{
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);

            expect(res.status).toBe(404);
        });

        it('should return 404 if an invalid id is passed', ()=>{
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', ()=> {
        it('should return 401 if client is not logged in', async ()=> {
            const res = await request(server)
                .post('/api/genres')
                .send({name: 'genre1'});
            expect(res.status).toBe(401);
        });

        it('should return 400 if the genre is less than 5 characters', async ()=> {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .sned({name: '1234'});
            expect(res.status).toBe(400);

        it('should return 400 if the genre is more than 50 characters', async ()=> {
            const token = new User().generateAuthToken();
            //dynamically generates a long string with more than 50 chars
            const name = new Array(51).join('a');
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .sned({name: name});
            expect(res.status).toBe(400);
        });

        it('should save the valid genre', async ()=> {
            const token = new User().generateAuthToken();
            
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .sned({name: 'genre1'});
            const genre = await Genre.find({name: 'genre1'})
            expect(genre).not.toBeNull();
        });

        it('should return the genre that has been saved', async ()=> {
            const token = new User().generateAuthToken();
            
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .sned({name: 'genre1'});
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
    });
});