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
            cdb.IsCoffee(function(err, results) {
                res.send(results);
            });
        }
    });

    app.get("/made_coffee", function(req, res) {
        cdb.MadeCoffee(function(err, results) {
            res.send(results);
        });
    });

    app.get("/history", function(req, res) {
        cdb.GetHistory(function(err, results) {
            res.send(results);
        });
    });

    app.get("/Disabled", function(req, res) {
        cdb.GetDisabledPots(function(err, results) {
            res.send(results);
        });
    });

    app.get("/Enabled", function(req, res) {
        cdb.GetEnabledPots(function(err, results) {
            res.send(results);
        });
    });

    app.get("/latest", function(req, res) {
        cdb.GetLatest(function(err, results) {
            res.send(results);
        });
    });

    app.get("/get_pot", function(req, res) {
        cdb.GetPot(req.query.pot_id, function(err, results) {
            res.send(results);
        })
    });

    app.get("/get_param", function(req, res) {
        cdb.GetParam(req.query.name, function(err, results) {
            res.send(results);
        });
    });

    app.post("/new_pot", function(req, res) {
        cdb.NewPot(req.body.name, function(err, results) {
            res.send(String(this.lastID));
        });
    });

    app.post("/remove_pot", function(req, res) {
        cdb.DisablePot(req.body.pot_id, function(err, results) {
            console.log("Disabled " + req.body.pot_id);
            res.send(String(this.pot_id))
        });
    });


}

module.exports = appRouter;