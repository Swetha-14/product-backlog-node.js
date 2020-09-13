var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongodb = require('mongodb');
const { request } = require('express');

var mongoClient = mongodb.MongoClient;
var urlencodedParser = bodyParser.urlencoded({extended:false});
var url = 'mongodb+srv://test:test@cluster0.kkgqg.mongodb.net/<dbname>?retryWrites=true&w=majority';
// var data = [{item: 'Item 1'}, {item: 'Item 2'}];

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true});
var ItemSchema = new mongoose.Schema({item: String}); //Schema Definition
var Item = mongoose.model('backlog', ItemSchema); // Data Model = Database in RDBMS

module.exports = function(app){
    app.get('/backlog', function(req, resp){
        Item.find({}, function(err, data){
            if(err) throw err;
            resp.render('backlog', {list:data});
        });
    });
    
    app.post('/backlog', urlencodedParser, function(req, resp){
        var newItem = Item(req.body).save(function(err, data){
            if(err) throw err;
            // data.push(req.body);
            resp.render('backlog', {list:data});
        });
    });

    app.delete('/backlog/:item', function(req, resp){
        /*data = data.filter(function(list){
            return list.item.replace(/ /g, '-') !== req.params.item;
        });*/
        Item.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
            if (err) throw err;
            resp.render('backlog', {list:data});
        });
    });
};

