const config = require('./config');
const express = require('express');
const superagent = require('superagent');
const cheerio = require('cheerio');
const app = express();

const mongo = require('./lib');

app.get('/', function (req, res, next) {

    let data = mongo.Post.find({});
    res.send(data);
    //展示内容
    // let html = '';
    // pageData.forEach((n, i) => {
    //     n.forEach((m, j) => {
    //         html += `<h3> ${ n[j].title } </h3>`;
    //         html += `<a href="${ getUrl + n[j].url }"> 查看原文章 </a>`;
    //     });
    // });
    //
    // res.send(html);
    // next();
});

app.listen(config.port, () => {
   console.log(`listening at port ${ config.port }`);
});