
var uuid = require("uuid");
var express = require("express");
var rooms = require("./data/rooms.json");
var messages = require("./data/messages.json");
var _ = require("lodash");

var router = express.Router();
module.exports = router;

router.get('/rooms', function(req, res) {
	res.json(rooms);
});

router.route("/rooms/:roomId/messages")
  .get(function(req, res) {
		var roomId = req.params.roomId;
		var roomMessages = messages
		  .filter(m => m.roomId === roomId);
		var room = _.find(rooms, r => r.id === roomId);
		if (!room) {
			res.sendStatus(404);
			return;
		}
		res.json({
			room: room,
			messages: roomMessages
		})
	})

	.post(function(req, res) {
		var roomId = req.params.roomId;
		var message = {
			roomId: roomId,
			text: req.body.text,
			userId: "blablabla",
			id: uuid.v4()
		};
		messages.push(message);
		res.sendStatus(200);
	})

	.delete(function(req, res) {
		var roomId = req.params.roomId;
		// here by substituting the messages array we are no longer
		// referencing the messages from the module (i.e. we are violating
	  // the singleton data) - correct way would be to create the methods
		// for data manipulation in the messages module
    messages = messages.filter(m => m.roomId !== roomId);
		res.sendStatus(200);
	});
