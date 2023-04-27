import supertest from 'supertest';
import httpStatus from 'http-status';
import { faker } from '@faker-js/faker';
import { cleanDb } from './helpers';
import app from 'app';
import { createConsole } from './factories/console.factory';
import { createGame } from './factories/games-factory';


afterEach(async () => {
    await cleanDb()
})

const server = supertest(app)

describe("GET /games", () => {
    it("Should respond with status 200 and the games", async () => {
        const createdConsole = await createConsole()
        const createdGame = await createGame(createdConsole.id)

        const response = await server.get("/games")

        expect(response.status).toBe(200)

        expect(response.body).toEqual([
            {
                id: createdGame.id,
                title: createdGame.title,
                consoleId: createdConsole.id,
                Console: {
                    id: createdConsole.id,
                    name: createdConsole.name
                }
            }
        ])
    })
})

describe("GET /games/:id", () => {
    it("Should respond with status 404 if no game is found", async () => {
        const createdConsole = await createConsole()
        const createdGame = await createGame(createdConsole.id)

        const response = await server.get(`/games/${createdGame.id + 1}`)

        expect(response.status).toBe(404)

    })
    it("Should respond with status 200 and the game is found", async () => {
        const createdConsole = await createConsole()
        const createdGame = await createGame(createdConsole.id)

        const response = await server.get(`/games/${createdGame.id}`)

        expect(response.status).toBe(200)

        expect(response.body).toEqual(
            {
                id: createdGame.id,
                title: createdGame.title,
                consoleId: createdConsole.id,
            }
        )

    })

})

describe("POST /games", () => {
    it("Should respond with status 409 if game already exists", async () => {
        const createdConsole = await createConsole()
        const createdGame = await createGame(createdConsole.id)

        const body = {
            title: createdGame.title,
            consoleId: createdConsole.id
        }

        const response = await server.post(`/games`).send(body)
        expect(response.status).toBe(409)

    })
    it("Should respond with status 409 if console doesn't exists", async () => {
        const createdConsole = await createConsole()

        const body = {
            title: faker.name.fullName(),
            consoleId: createdConsole.id + 1}

        const response = await server.post(`/games`).send(body)

        expect(response.status).toBe(409)
        

    })
    it("Should respond with status 201 game is successfully created", async () => {
        const createdConsole = await createConsole()

        const body = {
            title: faker.name.fullName(),
            consoleId: createdConsole.id
        }
            
        const response = await server.post(`/games`).send(body)

        expect(response.status).toBe(201)
        

    })

})