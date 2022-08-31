const { describe } = require('joi/lib/types/lazy');
const request = require('supertest');
const {Genre} = require('../../models/genre');
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
    });
});