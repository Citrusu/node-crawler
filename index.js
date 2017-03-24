const path = require('path');
const config = require('./config');
const express = require('express');
const superagent = require('superagent');
const cheerio = require('cheerio');
const app = express();

const mongo = require('./lib');

// 用 superagent 去抓取 https://cnodejs.org/ 的内容
//let pageData = [];

//抓取页数
for(let i = config.page[0]; i < (config.page[1] + 1); i++){
    let url = config.getUrl + config.pageParam + i;
    superagent.get(url).end(function (err, sres) {
        getData(err, sres, i);
    });
}
function getData(err, sres, index){
    // 常规的错误处理
    if (err) {
        return next(err);
    }
    // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
    // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
    // 剩下就都是 jquery 的内容了
    let $ = cheerio.load(sres.text);
    let pageNode = [];
    $('#topic_list .topic_title').each(function (idx, element) {
        let $element = $(element);
        pageNode.push({
            page: index,
            title: $element.attr('title'),
            url: $element.attr('href')
        });
    });
    //pageData[index] = pageNode;
    //写入数据库
    mongo.Post.create( pageNode ).exec();
}
console.log('crawler done');