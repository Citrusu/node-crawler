const express = require('express');
const superagent = require('superagent');
const cheerio = require('cheerio');
const app = express();

// 用 superagent 去抓取 https://cnodejs.org/ 的内容
let getUrl = 'http://mp.weixin.qq.com/s/oZZB22Eyrgfbt5HvtyQJcg';
let page = [1, 10];
let pageParam = '/?tab=all&page=';
let pageData = [];

//抓取页数
superagent.get(getUrl).end(function (err, sres) {
    getData(err, sres);
});

function getData(err, sres){
    // 常规的错误处理
    if (err) {
        return next(err);
    }
    // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
    // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
    // 剩下就都是 jquery 的内容了
    let $ = cheerio.load(sres.text);
    $('#activity-detail img').each(function (idx, element) {
        let $element = $(element);
        pageData.push({
            src: $element.attr('data-src')
        });
    });
}
app.get('/', function (req, res, next) {

    //展示内容
    let html = '';
    pageData.forEach((n, i) => {
            html += `<img src="${ n.src }"> ${ n.src } </img>`;
    });

    res.send(html);
});

app.listen(3000, () => {
   console.log('listening at port 3000');
});