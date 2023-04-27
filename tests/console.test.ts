import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { cleanDb } from './helpers';
import app from 'app';
import { createConsole } from './factories/console.factory';



afterEach(async () => {
    await cleanDb()
})

const server = supertest(app)

describe("GET /consoles", () => {
    it("Should respond with status 200 and the consoles", async () => {
        const createdConsole = await createConsole()

        const response = await server.get("/consoles")

        expect(response.status).toBe(200)

        expect(response.body).toEqual([
            {

                id: createdConsole.id,
                name: createdConsole.name

            }
        ])
    })
})

describe("GET /consoles/:id", () => {
    it("Should respond with status 404 if no console is found", async () => {
        const createdConsole = await createConsole()


        const response = await server.get(`/consoles/${createdConsole.id + 1}`)

        expect(response.status).toBe(404)

    })
    it("Should respond with status 200 and the game is found", async () => {
        const createdConsole = await createConsole()


        const response = await server.get(`/consoles/${createdConsole.id}`)

        expect(response.status).toBe(200)

        expect(response.body).toEqual(
            {
                id: createdConsole.id,
                name: createdConsole.name,

            }
        )

    })

})

describe("POST /consoles", () => {
    it("Should respond with status 409 if console already exists", async () => {
        const createdConsole = await createConsole()

      

        const body = {
            
            name: createdConsole.name
        }

        const response = await server.post(`/consoles`).send(body)
        expect(response.status).toBe(409)

    })
    
    it("Should respond with status 201 game is successfully created", async () => {
       

        const body = {
            name: faker.name.fullName(),
        }

        const response = await server.post(`/consoles`).send(body)

        expect(response.status).toBe(201)


    })

})