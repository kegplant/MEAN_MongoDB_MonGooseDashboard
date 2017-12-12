var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MongooseDashboard');
AnimalSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true
    },
    weight: {
        type: 'number'
    },
    age: {
        type: 'number'
    },
    specie: {
        type: 'string',
        required: true
    }
}, {
    timestamps: true
});
Animal = mongoose.model('Animal', AnimalSchema);
mongoose.Promise = global.Promise;
app.get('/', function (req, res) {
    Animal.find({}, function (err, animals) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                animals: animals
            });
        }
    })
})
app.get('/mongooses/new', function (req, res) {
    res.render('new');
})
app.post('/mongooses', function (req, res) {
    var animal = new Animal({
        name: req.body.name,
        specie: req.body.specie
    });
    animal.save(function (err, newAnimal) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/mongooses/' + newAnimal._id); //try to redirect to itself though
        }
    })
})
app.get('/mongooses/:id', function (req, res) {
    console.log(req.params.id);
    Animal.find({
        _id: req.params.id
    }, function (err, animal) {
        // console.log(err);
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.render('show', {
                animal: animal[0]
            });
        }
    })
})
app.get('/mongooses/edit/:id', function (req, res) {
    Animal.find({
        _id: req.params.id
    }, function (err, animal) {
        // console.log(err);
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.render('edit', {
                animal: animal[0]
            });
        }
    })
})
app.post('/mongooses/:id',function(req,res){
    Animal.find({_id:req.params.id},function(err,animals){
        if(err){
            console.log(err);
        }else{
            animals[0].name=req.body.name;
            animals[0].specie=req.body.specie;
            animals[0].save(function(err){
                if(err){
                    console.log(err);
                }else{
                    res.redirect('/mongooses/' + animals[0]._id);
                }
            })
        }
    })
})
app.post('/mongooses/destroy/:id',function(req,res){
    Animal.remove({_id:req.params.id},function(err){
        if(err){
            console.log(err);
            res.redirect('/');
        }else{
            res.redirect('/');
        }
    })
})
app.listen(8000, function () {
    console.log('listening on port 8000');
})