const config = require('./config');
const express = require('express');
const superagent = require('superagent');
const cheerio = require('cheerio');
const app = express();

const mongo = require('./lib');

Post(1);
function Post(page){
    app.get('/', function (req, res, next) {
        //查询数据库
        mongo.Post
            .find({page: page})
            .sort({_id: 1})
            .exec()
            .then((val) => {
                //res.send(val);
                showHtml(val);
            });

        //展示内容
        function showHtml(data){
            let html = '';
            data.forEach((n, i) => {
                html += `<h3> ${ n.title } </h3>`;
                html += `<a href="${ config.getUrl + n.url }"> 查看原文章 </a>`;
            });
            res.send(html);
            next();
        }

        //显示分页
        mongo.Post
            .find({})
            .sort({page: -1})
            .limit(1)
            .then((val) => {
                showPage(val[0].page);
            });
        function showPage(max){
            let html = '';
            for(let i = 0; i < max; i++){
                let idx = i + 1;
                html += `<p>`;
                if(idx === page){
                    html += `<a href="${config.getUrl + config.pageParam + idx}" class="current"> ${ idx } </a>`;
                }else{
                    html += `<a href="${config.getUrl + config.pageParam + idx}"> ${ idx } </a>`;
                }
                html += `</p>`;
            }
            console.log(html);
            next();
        }
    });
}

app.listen(config.port, () => {
    console.log(`listening at port ${ config.port }`);
});