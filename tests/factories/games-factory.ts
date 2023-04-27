import { faker } from "@faker-js/faker";
import prisma from "config/database";

export async function createGame(consoleId: number) {
    return await prisma.game.create({
        data: {
            title: faker.name.firstName(),
            consoleId: consoleId
        }
    })
}