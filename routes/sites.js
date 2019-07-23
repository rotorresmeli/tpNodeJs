var express = require('express');
var request = require('request')
var router = express.Router();

/* GET sites listing. */
router.get('/', function (req, res) {
    request.get("https://api.mercadolibre.com/sites",
        function (error, response, body) {
            if (error) {
                res.send(error);
            }
            res.send(JSON.parse(body))
        })
});

router.get('/:id', function (req, res) {
    var id = req.params.id
    request.get("https://api.mercadolibre.com/sites/" + id,
        function (error, response, body) {
            if (error) {
                res.send(error);
            }
            res.send(JSON.parse(body))
        })
});

router.get('/:id/payment_methods', function (req, res) {
    var id = req.params.id
    request.get("https://api.mercadolibre.com/sites/" + id + "/payment_methods",
        function (error, response, body) {
            if (error) {
                res.send(error);
            }
            res.send(JSON.parse(body))
        })
});

router.get('/:id/payment_methods/:payment_id', function (req, res) {
    var id = req.params.id
    var paymentId = req.params.payment_id
    request.get("https://api.mercadolibre.com/sites/" + id + "/payment_methods/" + paymentId,
        function (error, response, body) {
            if (error) {
                res.send(error);
            }
            res.send(JSON.parse(body))
        })
});

router.get('/:id/payment_methods/:payment_id/agencies', function (req, res) {
    var id = req.params.id
    var paymentId = req.params.payment_id
    var nearTo = req.query.near_to
    var sort_by = req.query.sort_by
    var limit = req.query.limit
    var offset = req.query.offset
    request.get("https://api.mercadolibre.com/sites/" +
        id + "/payment_methods/" + paymentId + "/agencies?near_to=" + nearTo,
        function (error, response, body) {
            if (error) {
                res.send(error);
            }
            var jsonResponse = JSON.parse(body)
            switch (sort_by) {
                case "address_line":
                    jsonResponse.results.sort(function (a, b) {
                        return a.address.address_line.localeCompare(b.address.address_line)
                    })
                    break;
                case "agency_code":
                    jsonResponse.results.sort(function (a, b) {
                        return a.agency_code - b.agency_code
                    })
                    break;
                case "distance" :
                    jsonResponse.results.sort(function (a, b) {
                        return a.distance - b.distance
                    })
                    break;
                default:
                    res.send(jsonResponse)
            }
            createFileFromJson(jsonResponse.results)
            res.send(jsonResponse)
        })
});

function createFileFromJson(jsonResponse) {
    var data = JSON.stringify(jsonResponse);
    var fs = require('fs');
    fs.writeFile("file.json", data, function (err) {
        if (err) console.log('error', err);
    });
}

module.exports = router;