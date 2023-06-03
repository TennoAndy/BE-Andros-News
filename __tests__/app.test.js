const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const articles = require("../db/data/test-data/articles");

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
  describe("POST", () => {
    describe("201", () => {
      test("should return an object with a new topic", () => {
        const postTopic = {
          slug: "bananas",
          description: "ba ba ba ba nana nana",
        };
        return request(app)
          .post("/api/topics")
          .send(postTopic)
          .expect(201)
          .then(({ body: { newTopic } }) => {
            expect(newTopic).toEqual({
              slug: "bananas",
              description: "ba ba ba ba nana nana",
            });
          });
      });
    });
    describe("ERROR 400 ", () => {
      test("should respond with error 400 when empty object is given", () => {
        return request(app)
          .post("/api/topics")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("Missing Required Fields!")
          );
      });
      test("should respond with error 400 when not all required properties are given", () => {
        return request(app)
          .post("/api/topics")
          .send({
            slug: "",
            descriptions: "ba ba ba ba nana nana",
          })
          .expect(400)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("Missing Required Fields!")
          );
      });
      test("should respond with error 400 if topic already exists", () => {
        return request(app)
          .post("/api/topics")
          .send({ slug: "paper", description: "another paper topic" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Topic Already Exists!");
          });
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
          .then(({ body: { article } }) => {
            expect(article).toEqual({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T18:11:00.000Z",
              votes: 100,
              comment_count: 11,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });
    });
    describe("ERROR 404 ", () => {
      test("should respond with error 404 when valid article_id is given but article doesn't exist", () => {
        return request(app)
          .get("/api/articles/500")
          .expect(404)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("Article Not Found!")
          );
      });
      test("should respond with error 404 when invalid article_id 'not a number' is given ", () => {
        return request(app)
          .get("/api/articles/sdax")
          .expect(400)
          .then(({ body: { msg } }) => expect(msg).toEqual("Bad Request!"));
      });
    });
  });
  describe("PATCH", () => {
    describe("200", () => {
      test("should update votes of specified article", () => {
        const update = { votes: 101 };
        return request(app)
          .patch("/api/articles/1")
          .send(update)
          .expect(200)
          .then(({ body: { updateArticle } }) => {
            expect(updateArticle).toEqual({
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T18:11:00.000Z",
              votes: 201,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });
      test("decrements votes if votes is a negative integer", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ votes: -150 })
          .expect(200)
          .then(({ body: { updateArticle } }) => {
            expect(updateArticle.votes).toBe(-50);
          });
      });
    });
    describe("ERROR 404 ", () => {
      test("should respond with error 404 when valid article_id is given but article doesn't exist in database", () => {
        return request(app)
          .patch("/api/articles/500")
          .send({ votes: 201 })
          .expect(404)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("Article Not Found!")
          );
      });
    });
    describe("ERROR 400 ", () => {
      test("should respond with error 400 when invalid body is given", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("Missing Required Fields!")
          );
      });
    });
    describe("ERROR 400 ", () => {
      test("should respond with error 400 when invalid not a number article id  is given", () => {
        return request(app)
          .patch("/api/articles/notanumber")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => expect(msg).toEqual("Bad Request!"));
      });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    describe("200", () => {
      test("should respond with array topic objects", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(12);
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  author: expect.any(String),
                  title: expect.any(String),
                  article_id: expect.any(Number),
                  topic: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  article_img_url: expect.any(String),
                  comment_count: expect.any(Number),
                })
              );
            });
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
      test("should respond with an article of given topic", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body: { articles } }) => {
            for (let article of articles) {
              expect(article.topic).toEqual("cats");
            }
          });
      });
      test("should respond with articles in ascended order", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=ASC")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("votes");
          });
      });
    });
    describe("400", () => {
      test("should respond with error 400 when invalid order is given", () => {
        return request(app)
          .get("/api/articles?order=somethingRandom")
          .expect(400)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual(
              "Please enter valid order. Order should be ASC(ascending) or DESC(descending)"
            )
          );
      });
      test("should respond with error 400 when invalid topic is given", () => {
        return request(app)
          .get("/api/articles?topic=somethingRandom")
          .expect(404)
          .then(({ body: { msg } }) => expect(msg).toEqual("Topic Not Found!"));
      });
      test("should respond with error 400 when invalid sort_by is given", () => {
        return request(app)
          .get("/api/articles?sort_by=somethingRandom")
          .expect(400)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("Please enter valid sort order!")
          );
      });
    });
  });
  describe("POST", () => {
    describe("201", () => {
      test("should return an object with a new article", () => {
        const postArticle = {
          author: "butter_bridge",
          title: "How to paper",
          body: "Info how paper is made",
          topic: "paper",
        };
        return request(app)
          .post("/api/articles")
          .send(postArticle)
          .expect(201)
          .then(({ body: { newArticle } }) => {
            expect(newArticle).toEqual({
              author: "butter_bridge",
              title: "How to paper",
              article_id: 13,
              body: "Info how paper is made",
              topic: "paper",
              created_at: expect.any(String),
              votes: 0,
              article_img_url: expect.any(String),
              comment_count: 0,
            });
          });
      });
    });
    describe("ERROR 400 ", () => {
      test("should respond with error 400 when empty object is given", () => {
        return request(app)
          .post("/api/articles")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("No Article Submitted!")
          );
      });
      test("should respond with error 400 when not all required properties are given", () => {
        return request(app)
          .post("/api/articles")
          .send({
            author: "butter_bridge",
            title: "",
            body: "I'm a body",
          })
          .expect(400)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("No Article Submitted!")
          );
      });
      test("should respond with error 400 when user doesn't exist", () => {
        return request(app)
          .post("/api/articles")
          .send({
            author: "Doesn't exist",
            title: "How to paper",
            body: "Info how paper is made",
            topic: "paper",
          })
          .expect(400)
          .then(({ body: { msg } }) => expect(msg).toEqual("Bad Request!"));
      });
      test("should respond with error 400 when topic doesn't exist in topics table", () => {
        return request(app)
          .post("/api/articles")
          .send({
            author: "butter_bridge",
            title: "How to paper",
            body: "Info how paper is made",
            topic: "no such topic",
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request!");
          });
      });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    describe("200", () => {
      test("GET - should return a comment array based on article_id", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(11);
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  body: expect.any(String),
                  article_id: expect.any(Number),
                  author: expect.any(String),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                })
              );
            });
            expect(comments).toBeSortedBy("created_at", { descending: true });
          });
      });
    });
    describe("ERROR 404 ", () => {
      test("should respond with error 404 when valid article_id is given but article doesn't exist in database", () => {
        return request(app)
          .get("/api/articles/500/comments")
          .expect(404)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("Article Not Found!")
          );
      });
      test("should respond with error 404 when invalid article_id 'not a number' is given ", () => {
        return request(app)
          .get("/api/articles/sdax")
          .expect(400)
          .then(({ body: { msg } }) => expect(msg).toEqual("Bad Request!"));
      });
    });
    describe("ERROR 404 ", () => {
      test("should respond with error 404 when invalid endpoint is given", () => {
        return request(app)
          .get("/api/articles/1/notvalidendpoint")
          .expect(404)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual(
              "Please enter a valid link. Go back and try again."
            )
          );
      });
    });
  });
  describe("POST", () => {
    describe("201", () => {
      test("POST should return an object with new posted comment", () => {
        const postComment = {
          author: "butter_bridge",
          body: "Good Article.",
        };
        return request(app)
          .post("/api/articles/1/comments")
          .send(postComment)
          .expect(201)
          .then(({ body: { newComment } }) => {
            expect(newComment).toEqual({
              comment_id: 19,
              body: "Good Article.",
              article_id: 1,
              author: "butter_bridge",
              votes: 0,
              created_at: expect.any(String),
            });
          });
      });
    });
    describe("ERROR 400 ", () => {
      test("should respond with error 400 when user doesn't exist", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ author: "Doesn't exist", body: "Good Article." })
          .expect(400)
          .then(({ body: { msg } }) => expect(msg).toEqual("Bad Request!"));
      });
      test("should respond with error 400 when empty object is given", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("No comment submitted")
          );
      });
    });
    describe("ERROR 404 ", () => {
      test("should respond with error 404 when valid article_id is given but article doesn't exist in database", () => {
        return request(app)
          .post("/api/articles/500/comments")
          .send({ author: "butter_bridge", body: "Good Article." })
          .expect(404)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("Article Not Found!")
          );
      });
      test("should respond with error 404 when invalid article_id 'not a number' is given ", () => {
        return request(app)
          .get("/api/articles/sdax/comments")
          .expect(400)
          .then(({ body: { msg } }) => expect(msg).toEqual("Bad Request!"));
      });
    });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    describe("204", () => {
      test("should delete a comment based on its id", () => {
        return request(app).delete("/api/comments/1").expect(204);
      });
    });
  });
  describe("ERROR 404 ", () => {
    test("should respond with error 404 when invalid comment_id is given", () => {
      return request(app)
        .delete("/api/comments/500")
        .expect(404)
        .then(({ body: { msg } }) =>
          expect(msg).toEqual("Comment doesn't exist!")
        );
    });
    test("should respond with error 404 when invalid comment_id is given", () => {
      return request(app)
        .delete("/api/comments/sdax")
        .expect(400)
        .then(({ body: { msg } }) => expect(msg).toEqual("Bad Request!"));
    });
  });
  describe("PATCH", () => {
    describe("200", () => {
      test("should update votes of specified comment", () => {
        const update = { votes: 40 };
        return request(app)
          .patch("/api/comments/1")
          .send(update)
          .expect(200)
          .then(({ body: { updateComment } }) => {
            expect(updateComment).toEqual({
              comment_id: 1,
              body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              votes: 56,
              author: "butter_bridge",
              article_id: 9,
              created_at: expect.any(String),
            });
          });
      });
      test("decrements votes if votes is a negative integer", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ votes: -20 })
          .expect(200)
          .then(({ body: { updateComment } }) => {
            expect(updateComment.votes).toBe(-4);
          });
      });
    });
    describe("ERROR 404 ", () => {
      test("should respond with error 404 when valid comment_id is given but comment doesn't exist in database", () => {
        return request(app)
          .patch("/api/comments/500")
          .send({ votes: 40 })
          .expect(404)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("Comment Not Found!")
          );
      });
    });
    describe("ERROR 400 ", () => {
      test("should respond with error 400 when invalid body is given", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("Missing Required Fields!")
          );
      });
    });
    describe("ERROR 400 ", () => {
      test("should respond with error 400 when invalid not a number comment id  is given", () => {
        return request(app)
          .patch("/api/comments/notanumber")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => expect(msg).toEqual("Bad Request!"));
      });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    describe("200", () => {
      test("should respond with array of users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toEqual([
              {
                username: "butter_bridge",
                name: "jonny",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              },
              {
                username: "icellusedkars",
                name: "sam",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
              },
              {
                username: "rogersop",
                name: "paul",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
              },
              {
                username: "lurker",
                name: "do_nothing",
                avatar_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              },
            ]);
          });
      });
    });
    describe("ERROR 404 ", () => {
      test("should respond with error 404 when invalid endpoint is given", () => {
        return request(app)
          .get("/api/usears")
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

describe("/api/users/:username", () => {
  describe("GET", () => {
    describe("200", () => {
      test("should return a user object base on username", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).toEqual({
              username: "butter_bridge",
              name: "jonny",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            });
          });
      });
    });
    describe("ERROR 404 ", () => {
      test("should respond with error 404 when username is valid but doesn't exist in database", () => {
        return request(app)
          .get("/api/users/validusername")
          .expect(404)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual(
              "User either doesn't exist or you don't have access to their profile"
            )
          );
      });
    });
  });
});

describe("/api", () => {
  describe("GET", () => {
    describe("200", () => {
      test("should respond with a json object listing all endpoints", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual(
              expect.objectContaining({
                "GET /api": expect.any(Object),
                "GET /api/topics": expect.any(Object),
                "GET /api/articles": expect.any(Object),
                "GET /api/articles/:article_id": expect.any(Object),
                "PATCH /api/articles/:article_id": expect.any(Object),
                "GET /api/articles/:article_id/comments": expect.any(Object),
                "POST /api/articles/:article_id/comments": expect.any(Object),
                "DELETE /api/comments/:comment_id": expect.any(Object),
                "GET /api/users": expect.any(Object),
              })
            );
          });
      });
    });
  });
});
