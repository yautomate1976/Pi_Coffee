
var cdb = require("../coffeedb.js");

var appRouter = function(app) {
    
    app.get("/", function(req, res) {
        res.sendfile('./public/index.html');
    });
    
    app.post("/made_coffee", function(req, res) {
        if(!req.body.pot_id) {
            res.send({'status': 'error', 'message': 'missing pot_id'});
        } else {
            res.send(cdb.MadeCoffee(req.body.pot_id));
        }
    });
    
    app.get("/history", function(req, res) {
        if (!req.body.since) {
            req.query.since = "1970-01-01T00:00:00.000Z";        
        }
        
        cdb.GetHistory(req.body.since, function(err, results){
            res.send(results);
        });
    });
    
    app.get("/latest", function(req, res) {
        cdb.GetLatest(function(err, results) {
            res.send(results);
        });
    });
    
    app.get("/get_pot", function(req, res) {
        cdb.GetPot(req.query.pot_id, function(err, results){
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