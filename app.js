
var express = require("express");
var app = express();

var bodyParser = require("body-parser");
var passport = require("passport");
require("./passport-init")

app.set("views", "./views");
app.set("view engine", "jade");

// logging module (then logging to a file requires fs module)
var fs = require("fs");
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
app.use(require("morgan")("combined", {stream: accessLogStream}));

// define dirs from which static content is served
app.use(express.static("public"));
app.use(express.static("node_modules/bootstrap/dist"));
app.use(express.static("node_modules/jquery/dist"));

// EDT button appears on html pages, for inspecting data that was sent
// from the server
require('express-debug')(app, {});

// bodyParser middleware switches parsing methods based on contentType
// header
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); // handle json posted from client-side js

app.use(require('express-session')({
	secret: 'keybord cat', resave: false, saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// function plugged into middleware for logging
app.use(function(req, res, next) {
	console.log(`Incoming request: ${req.method} ${req.url}`);
	next();
});

var authRouter = require("./auth");
app.use(authRouter);

// plug in middleware function to check if authenticated
app.use(function(req, res, next) {
	if (req.isAuthenticated()) {
		next();
		return;
	}
	res.redirect("/login");
});

app.get('/', function(req, res) {
	// point to home.jade view (without extension because we set
  // "view engine" to "jade")
	res.render("home", {title: "Home"});
});

var adminRouter = require("./admin");
app.use("/admin", adminRouter);

var apiRouter = require("./api");
app.use("/api", apiRouter);

app.listen(3000, function () {
	console.log('Chat app v listening on port 3000.');
});
