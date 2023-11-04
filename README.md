# Northcoders News API

## Summary

This is RESTful API written in Express & Node.js using the versions Node v20.5.1 and Postgres v16. It is recommended to use these versions as a minimum.

The following extension allows for easier viewing of the provided JSON objects in your browser:

<a href="https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa" style="background-color: transparent; color: #0366d6; text-decoration: none; padding: 0; border: none;">JSON formatter from Chrome Webstore</a>


The API is available at:

[NC News API](https://nc-news-api-zlkx.onrender.com/)


## Available endpoints


- **GET /api**: Serves up a JSON representation of all the available endpoints of the API.

- **GET /api/topics**: Serves an array of all topics.

- **GET /api/articles**: Serves an array of all articles.

- **GET /api/users**: Serves an array of user objects.

- **GET /api/articles/:article_id**: Serves an object containing the article body and associated properties.

- **GET /api/articles/:article_id/comments**: Serves an array containing all comments for the provided article_id.

- **POST /api/articles/:article_id/comments**: Adds a comment to the provided article_id. Returns an object with added date and comment_id.

- **PATCH /api/articles/:article_id**: Increments or decrements the votes on an article.

- **DELETE /api/comments/:comment_id**: Deletes a comment.


## Setup & Installation
If you would like to install this project locally you should clone the repository using the following:

```
git clone https://github.com/CoupDeWhoop/be-nc-news.git
```

Ensure you are inside the directory and the run the following command to install the required dependencies

```
npm install
```

You will need to create two environmant variable files. Please run the following commands:

```
echo "PGDATABASE = nc_news_test" >> .env.test

echo "PGDATABASE = nc_news" >> .env.development
```

In order to setup and seed the test and development databases please run the following commands:

```
npm run setup-dbs

npm run seed
```

