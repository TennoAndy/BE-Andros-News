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
    describe("STATUS 200", () => {
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
    describe("STATUS ERROR 404 ", () => {
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
    describe("STATUS 201", () => {
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
    describe("STATUS ERROR 400 ", () => {
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
    describe("STATUS 200", () => {
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
    describe("STATUS ERROR 404 ", () => {
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
    describe("STATUS 200", () => {
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
    describe("STATUS ERROR 404 ", () => {
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
    describe("STATUS ERROR 400 ", () => {
      test("should respond with error 400 when invalid body is given", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("Missing Required Fields!")
          );
      });
      test("should respond with error 400 when invalid not a number article id  is given", () => {
        return request(app)
          .patch("/api/articles/notanumber")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => expect(msg).toEqual("Bad Request!"));
      });
    });
  });
  describe("DELETE", () => {
    describe("STATUS 204", () => {
      test("should delete an article based on its id", () => {
        return request(app)
          .delete("/api/articles/1")
          .expect(204)
          .then(() => {
            return request(app)
              .get("/api/articles")
              .expect(200)
              .then(({ body: { total_count } }) => {
                expect(total_count).toBe(11);
              });
          });
      });
    });
  });
  describe("STATUS ERROR 404 ", () => {
    test("should respond with error 404 when valid article id is given but article doesn't exist in database", () => {
      return request(app)
        .delete("/api/articles/500")
        .expect(404)
        .then(({ body: { msg } }) =>
          expect(msg).toEqual("Article doesn't exist!")
        );
    });
    test("should respond with error 404 when invalid 'not a number' comment_id is given", () => {
      return request(app)
        .delete("/api/articles/sdax")
        .expect(400)
        .then(({ body: { msg } }) => expect(msg).toEqual("Bad Request!"));
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    describe("STATUS 200", () => {
      test("should respond with array topic objects", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(10);
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
      test("should respond with articles of given topic", () => {
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
          .get("/api/articles?sort_by=votes&order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("votes");
          });
      });
      test("should respond with limit of 10 articles which is the default value", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(10);
          });
      });
      test("should respond with articles of the limit provided", () => {
        return request(app)
          .get("/api/articles?limit=3")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(3);
          });
      });
      test("should respond with all articles if limit is 0 ", () => {
        return request(app)
          .get("/api/articles?limit=0")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(12);
          });
      });
      test("should respond with the number of pages given", () => {
        return request(app)
          .get("/api/articles?p=1")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(10);
          });
      });
      test("should contain a total count property", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { total_count } }) => {
            expect(total_count).toBe(12);
          });
      });
    });
    describe("STATUS ERROR 400", () => {
      test("should respond with error 400 when invalid order is given", () => {
        return request(app)
          .get("/api/articles?order=somethingRandom")
          .expect(400)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual(
              "Please enter a valid order. Order should be ASC(ascending) or DESC(descending)"
            )
          );
      });
      test("should respond with error 400 when invalid sort_by is given", () => {
        return request(app)
          .get("/api/articles?sort_by=somethingRandom")
          .expect(400)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("Please enter a valid sort order!")
          );
      });
      test("should respond with error 400 if limit query isn't a number", () => {
        return request(app)
          .get("/api/articles?limit=notNumber")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe(
              "Please enter a valid limit. Limit should be a number!"
            );
          });
      });
      test("should respond with error 400 if p query isn't a number", () => {
        return request(app)
          .get("/api/articles?p=notNumber")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Please enter a valid p. P should be a number!");
          });
      });
      test("should respond with limit and p queries must be positive integers if given negative integers", () => {
        return request(app)
          .get("/api/articles?limit=-5")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Limit and p must be positive numbers!");
          })
          .then(() => {
            return request(app)
              .get("/api/articles?p=-5")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).toBe("Limit and p must be positive numbers!");
              });
          });
      });
    });
  });
  describe("STATUS ERROR 404", () => {
    test("should respond with error 404 if topic doesn't exist in database", () => {
      return request(app)
        .get("/api/articles?topic=somethingRandom")
        .expect(404)
        .then(({ body: { msg } }) => expect(msg).toEqual("Topic Not Found!"));
    });
    test("should respond with error 404 if limit or p query number exceeds the total number of articles in our database", () => {
      return request(app)
        .get("/api/articles?p=45")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "Please provide valid values. Limit or p cannot be greater than the total number of articles!"
          );
        });
    });
  });
  describe("POST", () => {
    describe("STATUS 201", () => {
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
    describe("STATUS ERROR 400 ", () => {
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
    describe("STATUS 200", () => {
      test("GET - should return a comment array based on article_id", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(10);
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
      test("should respond with limit of 10 comments of specified article which is the default value", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(10);
          });
      });
      test("should respond with comments of specified article with the provided limit ", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=3")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(3);
          });
      });
      test("should respond with all comments of specified article if limit is 0 ", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=0")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(11);
          });
      });
      test("should respond with the number of pages given", () => {
        return request(app)
          .get("/api/articles/1/comments?p=1")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(10);
          });
      });
      test("should contain a total count property", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { total_count } }) => {
            expect(total_count).toBe(11);
          });
      });
    });
  });
  describe("STATUS ERROR 400", () => {
    test("should respond with error 400 when invalid article_id 'not a number' is given ", () => {
      return request(app)
        .get("/api/articles/sdax/comments")
        .expect(400)
        .then(({ body: { msg } }) => expect(msg).toEqual("Bad Request!"));
    });
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
    test("should respond with error 400 if limit query isn't a number", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=notNumber")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "Please enter a valid limit. Limit should be a number!"
          );
        });
    });
    test("should respond with error 400 if p query isn't a number", () => {
      return request(app)
        .get("/api/articles/1/comments?p=notNumber")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Please enter a valid p. P should be a number!");
        });
    });
    test("should respond with limit and p queries must be positive integers if given negative integers", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=-5")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Limit and p must be positive numbers!");
        })
        .then(() => {
          return request(app)
            .get("/api/articles/1/comments?p=-5")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Limit and p must be positive numbers!");
            });
        });
    });
  });
  describe("STATUS ERROR 404 ", () => {
    test("should respond with error 404 when valid article_id is given but article doesn't exist in database", () => {
      return request(app)
        .get("/api/articles/500/comments")
        .expect(404)
        .then(({ body: { msg } }) => expect(msg).toEqual("Article Not Found!"));
    });
    test("should respond with error 404 if limit or p query number exceeds the total number of articles in our database", () => {
      return request(app)
        .get("/api/articles/1/comments?p=45")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "Please provide valid values.Limit or p cannot be greater than the total number of articles!"
          );
        });
    });
  });
  describe("POST", () => {
    describe("STATUS 201", () => {
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
  });
  describe("STATUS ERROR 400 ", () => {
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
  describe("STATUS ERROR 404 ", () => {
    test("should respond with error 404 when valid article_id is given but article doesn't exist in database", () => {
      return request(app)
        .post("/api/articles/500/comments")
        .send({ author: "butter_bridge", body: "Good Article." })
        .expect(404)
        .then(({ body: { msg } }) => expect(msg).toEqual("Article Not Found!"));
    });
    test("should respond with error 404 when invalid article_id 'not a number' is given ", () => {
      return request(app)
        .get("/api/articles/sdax/comments")
        .expect(400)
        .then(({ body: { msg } }) => expect(msg).toEqual("Bad Request!"));
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
  describe("STATUS ERROR 400", () => {
    test("should respond with error 400 when invalid not a number comment_id is given", () => {
      return request(app)
        .delete("/api/comments/notNumber")
        .expect(400)
        .then(({ body: { msg } }) => expect(msg).toEqual("Bad Request!"));
    });
  });
  describe("STATUS ERROR 404 ", () => {
    test("should respond with error 404 when valid comment_id is given but comment doesn't exist in database", () => {
      return request(app)
        .delete("/api/comments/500")
        .expect(404)
        .then(({ body: { msg } }) =>
          expect(msg).toEqual("Comment doesn't exist!")
        );
    });
  });
  describe("PATCH", () => {
    describe("STATUS 200", () => {
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
    describe("STATUS ERROR 404 ", () => {
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
    describe("STATUS ERROR 400 ", () => {
      test("should respond with error 400 when invalid body is given", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("Missing Required Fields!")
          );
      });
      test("should respond with error 400 when invalid body is given", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ votes: "not number" })
          .expect(400)
          .then(({ body: { msg } }) => expect(msg).toEqual("Bad Request!"));
      });
      test("should respond with error 400 when invalid not a number comment id  is given", () => {
        return request(app)
          .patch("/api/comments/notNumber")
          .send({ votes: 10 })
          .expect(400)
          .then(({ body: { msg } }) => expect(msg).toEqual("Bad Request!"));
      });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    describe("STATUS 200", () => {
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
    describe("STATUS ERROR 404 ", () => {
      test("should respond with error 404 when invalid endpoint is given", () => {
        return request(app)
          .get("/api/invalidEndpoint")
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
    describe("STATUS 201", () => {
      test("should return an object with a new user", () => {
        const postUser = {
          username: "guessWho",
          name: "someone",
          avatar_url:
            "https://images.unsplash.com/photo-1687913161653-7cddb0ba09b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1OHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
        };
        return request(app)
          .post("/api/users")
          .send(postUser)
          .expect(201)
          .then(({ body: { newUser } }) => {
            expect(newUser).toEqual({
              username: "guessWho",
              name: "someone",
              avatar_url:
                "https://images.unsplash.com/photo-1687913161653-7cddb0ba09b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1OHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
            });
          });
      });
    });
    describe("STATUS ERROR 400 ", () => {
      test("should respond with error 400 when empty object is given", () => {
        return request(app)
          .post("/api/users")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("Missing Required Fields!")
          );
      });
      test("should respond with error 400 when not all required properties are given", () => {
        return request(app)
          .post("/api/users")
          .send({
            username: "",
            name: "ba ba ba ba nana nana",
            avatar_url: "",
          })
          .expect(400)
          .then(({ body: { msg } }) =>
            expect(msg).toEqual("Missing Required Fields!")
          );
      });
      test("should respond with error 400 if user already exists", () => {
        return request(app)
          .post("/api/users")
          .send({ username: "butter_bridge", name: "jonny", avatar_url: "" })
          .expect(409)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("User Already Exists!");
          });
      });
    });
  });
});

describe("/api/users/:username", () => {
  describe("GET", () => {
    describe("STATUS 200", () => {
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
    describe("STATUS ERROR 404 ", () => {
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
    describe("STATUS 200", () => {
      test("should respond with a json object listing all endpoints", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            expect(typeof body).toBe("object");
            expect(body).toEqual(
              expect.objectContaining({
                "GET /api": expect.any(Object),
                "GET /api/topics": expect.any(Object),
                "POST /api/topics": expect.any(Object),
                "GET /api/articles": expect.any(Object),
                "POST /api/articles": expect.any(Object),
                "GET /api/articles/:article_id": expect.any(Object),
                "PATCH /api/articles/:article_id": expect.any(Object),
                "DELETE /api/articles/:article_id": expect.any(Object),
                "GET /api/articles/:article_id/comments": expect.any(Object),
                "POST /api/articles/:article_id/comments": expect.any(Object),
                "GET /api/users": expect.any(Object),
                "POST /api/users": expect.any(Object),
                "GET /api/users/:username": expect.any(Object),
                "PATCH /api/comments/:comment_id": expect.any(Object),
                "DELETE /api/comments/:comment_id": expect.any(Object),
              })
            );
          });
      });
    });
  });
});
