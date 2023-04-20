const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});
afterAll(() => db.end());

describe("/api/topics", () => {
  describe("GET", () => {
    describe("200", () => {
      test("should respond with array topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).toEqual([
              {
                description: "The man, the Mitch, the legend",
                slug: "mitch",
              },
              {
                description: "Not dogs",
                slug: "cats",
              },
              {
                description: "what books are made of",
                slug: "paper",
              },
            ]);
          });
      });
    });
    describe("ERROR 404 ", () => {
      test("should respond with error 404 when invalid endpoint is given", () => {
        return request(app)
          .get("/api/topecs")
          .expect(404)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual(
              "Please enter a valid link. Go back and try again."
            )
          );
      });
    });
  });
});
