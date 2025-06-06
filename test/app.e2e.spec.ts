import { Test, type TestingModule } from "@nestjs/testing"
import type { INestApplication } from "@nestjs/common"
import request from "supertest"
import { AppModule } from "../src/app.module"
import { describe, beforeEach, it, afterAll } from "@jest/globals"

describe("AppController (e2e)", () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it("/ (GET)", () => {
    return request(app.getHttpServer()).get("/").expect(200)
  })

  afterAll(async () => {
    await app.close()
  })
})
