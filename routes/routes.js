var cdb = require("../coffeedb.js");

var appRouter = function(app) {

    app.get("/", function(req, res) {
        res.sendfile('./public/index.html');
    });

    app.post("/make_coffee", function(req, res) {
        if (!req.body.pot_id) {
            res.send({ 'status': 'error', 'message': 'missing pot_id' });
        } else {
            res.send(cdb.MakeCoffee(req.body.pot_id));
        }
    });

    app.post("/is_coffee", function(req, res) {
        if (!req.body.pot_id) {
            res.send({ 'status': 'error', 'message': 'missing pot_id' });
        } else {
            cdb.IsCoffee(req.body.pot_id, function(err, results) {
                res.send(results);
            });
        }
    });

    app.get("/made_coffee", function(req, res) {
        cdb.MadeCoffee(function(err, results) {
            if (results == "") {
                res.send({ 'status': 'warning', 'message': 'no coffee is made' });
            } else {
                res.send(results);
            }
        });
    });

    app.get("/history", function(req, res) {
        cdb.GetHistory(function(err, results) {
            if (results == "") {
                res.send({ 'status': 'warning', 'message': 'no coffee is made' });
            } else {
                res.send(results);
            }
        });
    });

    app.get("/Disabled", function(req, res) {
        cdb.GetDisabledPots(function(err, results) {
            if (results == "") {
                res.send({ 'status': 'warning', 'message': 'all pots are enabled' });
            } else { res.send(results); }
        });
    });

    app.get("/Enabled", function(req, res) {
        cdb.GetEnabledPots(function(err, results) {
            if (results == "") {
                res.send({ 'status': 'warning', 'message': 'all pots are disabled' })
            } else { res.send(results); }
        });
    });

    app.get("/latest", function(req, res) {
        cdb.GetLatest(function(err, results) {
            if (results == "") {
                res.send({ 'status': 'warning', 'message': 'no pots are present' });
            } else {
                res.send(results);
            }
        });
    });

    app.get("/get_pot", function(req, res) {

        cdb.GetPot(req.query.pot_id, function(err, results) {
            if (results == "") {
                res.send({ 'status': 'warning', 'message': 'no pots are present' });
            } else {
                res.send(results);
            }
        });
    });

    app.get("/get_all_coffee", function(req, res) {
        cdb.GetAllCoffee(function(err, results) {
            if (results == "") {
                res.send({ 'status': 'warning', 'message': 'no coffee' })
            } else { res.send(results); }
        });
    });


    app.get("/get_param", function(req, res) {
        cdb.GetParam(req.query.name, function(err, results) {
            if (results == "") {
                res.send({ 'status': 'warning', 'message': 'no pots are present' });
            } else {
                res.send(results);
            }
        });
    });

    app.post("/new_pot", function(req, res) {
        if (req.body.name == "") {
            res.send({ 'status': 'error', 'message': 'missing name' });
        } else {
            cdb.NewPot(req.body.name, function(err, results) {
                if (results == "") {
                    res.send({ 'warning': 'error', 'message': 'no name' });
                } else {
                    res.send(String(this.lastID));
                }
            });
        }
    });

    app.post("/remove_pot", function(req, res) {
        if (!req.body.pot_id) {
            res.send({ 'status': 'warning', 'message': 'all pots are disabled' });
        } else {
            cdb.DisablePot(req.body.pot_id, function(err, results) {
                console.log("Disabled " + req.body.pot_id);
                if (results == "") {
                    res.send({ 'warning': 'error', 'message': 'pot does not exists' });
                } else {
                    res.send(String(this.pot_id));
                }
            });
        }
    });

    app.put("/add_coffee", function(req, res) {
        if (!req.body.name) {
            res.send({ 'status': 'error', 'message': 'missing data' });
        } else if (req.body.name == "") {
            res.send({ 'error': 'no data', 'message': 'missing name' });
        }

        if (req.body.name) {
            cdb.PutCoffee(req.body.name, function(err, results) {
                if (results == "") {
                    res.send({ 'error': req.body.name, 'message': 'insert failed' });
                } else {
                    res.send({ 'action': 'INSERT', 'status': 'sucessful' });
                }
            });
        }
    });
}

module.exports = appRouter;