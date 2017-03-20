/**
 * Created by Citrus on 2017/3/20.
 */
const config = require('./config');
const express = require('express');
const superagent = require('superagent');
const cheerio = require('cheerio');

const mongo = require('./lib');

// 用 superagent 去抓取 https://cnodejs.org/ 的内容
let getUrl = 'https://cnodejs.org';
let page = [1, 2];
let pageParam = '/?tab=all&page=';
let pageData = [];

//抓取页数
for(let i = page[0]; i < (page[1] + 1); i++){
    let url = getUrl + pageParam + i;
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
            title: $element.attr('title'),
            url: $element.attr('href')
        });
    });
    pageData[index] = pageNode;
    //写入数据库
    mongo.Post.create( pageNode ).exec();
}