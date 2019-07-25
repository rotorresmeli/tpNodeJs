var express = require('express');
var request = require('request')
var router = express.Router();
var fs = require('fs');

router.post('/', function (req, res) {
    var dataRecommendedAgencies = fs.readFileSync('recommendedAgencies.json');
    var recommended = JSON.parse(dataRecommendedAgencies);

    if (req.body.id != undefined) {
        recommended.push(req.body);

        fs.writeFileSync('recommendedAgencies.json', JSON.stringify(recommended));
        res.send(fs.readFileSync('recommendedAgencies.json'));
    } else {
        res.status(204)
        res.send()
    }

});

router.delete('/', function (req, res) {
    var data = fs.readFileSync('recommendedAgencies.json');
    var recommended = JSON.parse(data);
    var exists = false

    if (req.body.id != undefined) {
        var file = recommended.filter(function (value, index, arr) {
            if (value.id == req.body.id) {
                exists = true
            }
            return value.id != req.body.id;
        });
        if (exists == true) {
            res.status(200)
        } else {
            res.status(304)
        }

        fs.writeFileSync('recommendedAgencies.json', JSON.stringify(file));
        res.send(fs.readFileSync('recommendedAgencies.json'));
    } else {
        res.status(204)
        res.send()
    }
});

router.get('/', function (req, res) {
    var data = fs.readFileSync('recommendedAgencies.json');
    var recommended = JSON.parse(data);

    res.send(recommended);
});


module.exports = router;
