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
describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    describe("200", () => {
      test("GET - should return an article object based on id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { selectArticle } }) => {
            expect(selectArticle).toEqual({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T18:11:00.000Z",
              votes: 100,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });
    });
  });
});
