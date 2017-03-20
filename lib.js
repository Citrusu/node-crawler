/**
 * Created by Citrus on 2017/3/20.
 */
let config = require('./config');
let Mongolass = require('mongolass');
let mongolass = new Mongolass();
mongolass.connect(config.mongodb);

exports.Post = mongolass.model('post', {
    title: {type: 'string'},
    url: {type: 'string'}
});