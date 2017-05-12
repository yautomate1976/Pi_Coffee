var fs = require("fs");
var file = "picoffee.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);
var exports = module.exports = {};

exports.MadeCoffee = function(pot_id) {
    if (!pot_id) {
        return new Error("pot_id required");
    }
    var date = new Date().toISOString();
    
    var stmt = db.prepare("INSERT INTO CoffeeInstances (pot_id, brew_time) VALUES ((?),(?))");
    stmt.run(pot_id, date);
    stmt.finalize();
    return true;
};

exports.GetHistory = function(since, mycallback) {
    db.all("SELECT pot_id, brew_time FROM CoffeeInstances WHERE brew_time >= ?", since, callback=mycallback);
}

exports.GetLatest = function(mycallback) {
    db.all("select pots.id as pot_id, name, max(brew_time) as brew_time from pots left join CoffeeInstances on CoffeeInstances.pot_id = Pots.id where pots.enabled = 1 group by pots.id", callback=mycallback);
}

exports.GetPot = function(pot_id, mycallback) {
    if (!pot_id) {
        db.all("select * from Pots where enabled = 1", callback=mycallback)
    } else {
        db.get("SELECT id, name FROM Pots WHERE enabled = 1 and id = (?)", pot_id, callback=mycallback);
    }
}

exports.GetParam = function(name, mycallback) {
    db.get("SELECT name,value,default_value FROM Params WHERE name = (?)", name, callback=mycallback);
}

exports.SetParam = function(name, value, default_value, mycallback) {
    db.run("INSERT INTO Params (name, value, default_value) VALUES (?, ?, ?)", name, value, default_value, callback=mycallback);
}

exports.NewPot = function(name, mycallback) {
    db.run("INSERT INTO Pots (name) VALUES (?)", name, callback=mycallback);
}

exports.DisablePot = function(pot_id, mycallback) {
    db.run("UPDATE Pots SET enabled = 0 WHERE id = (?)", pot_id, callback=mycallback);
}

exports.EnablePot = function(pot_id, mycallback) {
    db.run("UPDATE Pots SET enabled = 1 WHERE id = (?)", pot_id, callback=mycallback);
}

db.serialize(function() {
  if(!exists) {
    
    db.run("CREATE TABLE Params (name TEXT primary key, value TEXT, default_value TEXT)");
    db.run("CREATE TABLE Pots (id integer primary key autoincrement, name TEXT, enabled integer DEFAULT 1)");
    db.run("CREATE TABLE CoffeeInstances (id integer primary key autoincrement, pot_id integer NOT NULL, brew_time TEXT NOT NULL, FOREIGN KEY(pot_id) REFERENCES Pots(id))");
    db.run("CREATE INDEX idx_enabled ON Pots(enabled)");
    db.run("CREATE INDEX idx_brew_time ON CoffeeInstances(brew_time)");
    db.run("CREATE INDEX idx_pot_id ON CoffeeInstances(pot_id)");
    
    // Default params
    exports.SetParam('warn_minutes', 90, 90);
    exports.SetParam('old_minutes', 180, 180);        
    
    // Test Data
    db.run("INSERT INTO Pots (name) VALUES ('McLovin'), ('Starbucks'), ('Test3') ");
    db.run(`INSERT INTO CoffeeInstances (pot_id, brew_time) VALUES 
            (1, '2016-10-15T16:23:01.137Z'),    
            (1, '2016-10-15T20:23:08.137Z'),    
            (1, '2016-06-17T21:23:15.137Z'),  
            (2, '2016-10-15T21:05:22.137Z'),    
            (2, '2016-10-15T21:20:29.137Z'),    
            (2, '2016-10-15T21:23:36.137Z')`);
  }
});