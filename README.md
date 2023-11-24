# Northcoders News API

Hosted site
    https://andrew-bell-nc-news.onrender.com/api

Summary
    A project to create an API for a news focused social media website.

Usage
    To use this repo you will need to install a number of packages and create the environment variables listed below. Once you have you should be able to run the test suite with 'npm test'

To create the environment variables.
    - Create a '.env.development' file containing 
        PGDATABASE=nc_news
    - Create a '.env.test' file containing 
        PGDATABASE=nc_news_test

Dependencies to install
    - dotenv: 16.0.0
    - express: 4.18.2
    - pg: 8.7.3
    - pg-format: 1.0.4

Dev dependencies to install
    - husky: 8.0.2
    - jest: 27.5.1
    - jest-extended: 2.0.0
    - jest-sorted: 1.0.14
    - supertest: 6.3.3

Node and postgres
    - Node.js - minimum version: v20.5.1
    - Postgres - minimum version: 16.0