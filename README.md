# 📖 Town of Andros News API

---

## 🔗 link to Hosted version

Live version can be found here [hosted here](https://rose-grumpy-angler.cyclic.app/api) using [Cyclic](https://www.cyclic.sh/)

**_It might take some time for the server to "wake-up"._**

---

## 📋 PROJECT SUMMARY

This project is a Node.js, Express application using a RESTful API and MVC architecture written in JavaScript to serve data from a PSQL (PostgreSql) database. This project has the versatility to be adapted to other projects such as blogs, forums and social media platforms. Its functionality covers managing articles, users, topics and comments. The user is able to post, update and delete articles, topics and comments, as well as upvote or downvote articles and comments.

### Available endpoints:

- `GET /api` ➡️ GET a list of all of the available endpoints.

- `GET /api/topics` ➡️ GET a list of topics of the articles.

- `POST /api/topics` ➡️ POST a new topic.

- `GET /api/articles` ➡️ GET a list of articles. The users can filter by topic, sort by author, title, topic, votes, date or comment count. They can also choose a sort order and decide on the pagination limits or view specific pages of results.

- `POST /api/articles` ➡️ POST a new article.

- `GET /api/articles/:article_id` ➡️ GET a specific article using an article_id parameter.

- `PATCH /api/articles/:article_id` ➡️ PATCH a specific article by changing its vote count (upvote/downvote).

- `DELETE /api/articles/:article_id` ➡️ DELETE a specific article along with its comments.

- `GET /api/articles/:article_id/comments` ➡️ GET a list of the comments associated with a specific article.

- `POST /api/articles/:article_id/comments` ➡️ POST a new comment to a specific article.

- `DELETE /api/comments/:comment_id` ➡️ DELETE a specific comment using its comment_id as parameter.

- `PATCH /api/comments/:comment_id` ➡️← PATCH a specific comment by changing its vote count (upvote/downvote).

- `GET /api/users` ➡️ GET a list of the registered users.

- `POST /api/users` ➡️ Post a new user.

- `GET /api/users/:username` ➡️ GET a specific user using a username parameter.

---

## 🛠️ How to clone repo, install dependencies, seed local databases and run tests

### 1. Clone the repo

HTTP link to clone the repository:

```
https://github.com/TennoAndros/be-Andros-news-main
```

After clone is finished follow the next step.

### 2. Install dependencies

Navigate to that directory in your terminal and run the below command to install all of the dependencies needed as found in the package.json file.
The install command is: `npm i` .

This repo was created using:

**-Production dependencies-**

| Package              | Version   | Usage                                         |
| :------------------- | :-------- | :-------------------------------------------- |
| <sub>dotenv</sub>    | `^16.0.0` | _Handles environment variable files_          |
| <sub>express</sub>   | `^4.18.2` | _Routes API requests_                         |
| <sub>pg-format</sub> | `^1.0.4`  | _Formats PostgreSQL to prevent SQL injection_ |
| <sub>pg</sub>        | `^8.7.3`  | _Queries PostgreSQL database_                 |

**-Development dependencies-**

| Package                  | Version   | Usage                                                 |
| :----------------------- | :-------- | :---------------------------------------------------- |
| <sub>husky</sub>         | `^8.0.2`  | _Validates commit by running tests before committing_ |
| <sub>jest</sub>          | `^27.5.1` | _Provides framework for testing functionality_        |
| <sub>jest-extended</sub> | `^2.0.0`  | _Adds additional jest testing identifiers_            |
| <sub>jest-sorted</sub>   | `^1.0.14` | _Adds sort testing for jest_                          |
| <sub>supertest</sub>     | `^6.3.3`  | _Adds simplified web request testing_                 |

### 3. Seed local databases

In order to seed the local database with both the development and test databases you need to run a script.
The command is: `npm run setup-dbs` .
Then to populate them with placeholder data run: `npm run seed` .

### 4. Run tests

The script command to run the tests is: `npm t` .

---

## 🗒️ Creating the environment variables

To connect in database locally you will need to create two files in your root directory:

- .env.development
- .env.test

Both of which will need to include PGDATABASE=<database_name_here>
Database name can be found in `./db/seeds/setup.sql` . You can amend the name of your database with something of your own choice.

**_THIS IS VITAL FOR CONNECTING THE TWO DATABASES LOCALLY._**

---

## ⚙️ System Setup

The project was created using the listed versions of Node, PostgreSQL and npm:

- [Node](https://nodejs.org/en/) (version v18.15.0)
- [PostgreSQL](https://www.postgresql.org/) (version 15.2)
- [npm](https://www.npmjs.com/) (version 9.5)

It might work with other versions but they haven't been tested.
