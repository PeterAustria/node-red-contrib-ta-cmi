'use strict';

const async = require('async');
const http = require('http');

//const debug = require('debug')('cmi-config');

module.exports = function (RED) {

	const nodeName = 'NODE-RED-CONTRIB-TA-CMI (config): ';
	const debug = false;
	const debugDetailed = false;
	const liveData = true;

	function cmiConfigNode(config) {

		//
		// register listener node
		//
		this.registerListener = function (listenerNode, callback) {
			if (debugDetailed) { console.log(nodeName + "callback: " + callback) };
			if (debugDetailed) { console.log(nodeName + "listenerNode: " + JSON.stringify(listenerNode, null, 5)) };
			if (debugDetailed) { console.log(nodeName + 'node.Listeners: ' + JSON.stringify(node.Listeners, null, 5)) };
			node.Listeners[listenerNode.id] = callback;
			if (debugDetailed) { console.log(nodeName + 'node.Listeners[listenerNode.id]:' + JSON.stringify(node.Listeners[listenerNode.id], null, 5)) };
		}; // this.registerListener

		//
		// deregister listener node
		//
		this.deregisterListener = function (listenerNode) {
			if (debugDetailed) { console.log(nodeName + 'deregister: ' + listenerNode.id) };
			delete node.Listeners[listenerNode.id];
		};

		//
		// emit notification that new data arrived to all nodes
		//
		this.notifyChange = function (msg) {
			if (debugDetailed) { console.log(nodeName + JSON.stringify(msg, null, 2)) };
			if (debugDetailed) { console.log(nodeName + JSON.stringify(node.Listeners, null, 2)) };

			async.each(node.Listeners, function (listener, callback) {
				if (debugDetailed) { console.log(nodeName + JSON.stringify(msg, null, 2)) };
				listener(JSON.parse(JSON.stringify(msg)));
				callback(null);
			});
		}; // this.notifyChange


		///
		/// dateTime
		///
		function dateTime(ts) {
			if (ts) { // Date and Time as a JS-Timestamp (in Millisekonds, as UTC)
				var date = new Date(ts * 1000)
				var hour = date.getUTCHours();
			} else { // no Parameter provided, so take system-time (not in UTC)
				var date = new Date()
				var hour = date.getHours();
			};
			var minute = date.getMinutes();
			var second = date.getSeconds();
			var day = date.getDate();
			var month = date.getMonth() + 1; // month as a number 0-11, so add 1
			var year = date.getFullYear();
			if (hour < 10) { hour = '0' + hour; }
			if (minute < 10) { minute = '0' + minute; }
			if (second < 10) { second = '0' + second; }
			if (day < 10) { day = '0' + day; }
			if (month < 10) { month = '0' + month; }
			return (year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);
		} // function dateTime(ts);

		///
		/// Read data from CMI
		//
		function httpGet(hostname, username, password) {
			var sData = "";
			var res = {}; // result that is returned to the calling function (as the msg Object)
			res.data = {};

			if (liveData) {
				// start http-request
				if (debug) { console.log(nodeName + 'Starting httpGet to ' + hostname + ' started using credentials ' + username + ' | ' + password + ' at ' + dateTime()) };
				const options = {
					auth: username + ':' + password,
					hostname: hostname,
					port: 80,
					path: '/INCLUDE/api.cgi?jsonnode=1&jsonparam=La,Ld',
					method: 'GET'
				}
				const httpResult = http.request(options, httpResult => {
					if (debug) { console.log(nodeName + 'HTTP request Status Code: ' + httpResult.statusCode) };
					if (httpResult.statusCode == 200) {
						// successfully connected to CMI
						if (debug) { console.log(nodeName + "Connection to CMI successfull") };
						// read http message...
						httpResult.on('data', d => {
							sData += d;
						})
						// ...until end
						httpResult.on('end', () => {
							// parse http message into object
							if (debug) { console.log(nodeName + "Start parsing HTTP Data") };
							res.data = JSON.parse(sData);
							res.httpStatusCode = httpResult.statusCode;
							res.httpStatusMessage = httpResult.statusMessage;
							res.payload = 'Call #' + callNumber + ' to ' + hostname + ' returning ' + res.httpStatusCode + ':' + res.httpStatusMessage + ') from config node';
							res.topic = "EMIT #" + callNumber;
							callNumber = callNumber + 1;
							node.notifyChange(res); // report the results from CMI to the node
							})
					}
					else {
						res.data = {};
						res.httpStatusCode = httpResult.statusCode;
						res.httpStatusMessage = httpResult.statusMessage;
						res.payload = 'Call #' + callNumber + ' to ' + hostname + ' returning ' + res.httpStatusCode + ':' + res.httpStatusMessage + ') from config node';
						res.topic = "EMIT #" + callNumber;
						callNumber = callNumber + 1;
						node.notifyChange(res); // report the results from CMI to the node
					}
				}).on('error', error => {
					res.data = {};
					res.httpStatusCode = '999';
					res.httpStatusMessage = "WRONG HOSTNAME, IP ADDRESS OR C.M.I. NOT REACHABLE";
					res.payload = 'Call #' + callNumber + ' to ' + hostname + ' returning ' + res.httpStatusCode + ':' + res.httpStatusMessage + ') from config node';
					res.topic = "EMIT #" + callNumber;
					callNumber = callNumber + 1;
					node.notifyChange(res); // report the results from CMI to the node
			})
				httpResult.end();

			} else { // if (liveData) for testing to not stress the CMI read values from global context store
				if (debug) { console.log(nodeName + "Start reading HTTP Data from global context store") };
				//res.data = node.context().global.get('cmiDataError' || 0);
				res.data = node.context().global.get('cmiDataSuccess' || 0);
				if (res.data == 0) {
					res.httpStatusCode = 300;
					res.httpStatusMessage = "NO LIVE DATA - Data in global context store not found"
				}
				else {
					res.httpStatusCode = 200;
					res.httpStatusMessage = 'NO LIVE DATA - Data coming from global context store';
				}
				res.payload = 'Call #' + callNumber + ' to ' + hostname + ' returning ' + res.data["Status code"] + ':' + res.data.Status + ' (' + dateTime(res.data.Header.Timestamp) + ') from config node'
				res.topic = "EMIT #" + callNumber;
				callNumber = callNumber + 1;
				node.notifyChange(res); // report the results from CMI to the node
			} // if (liveData)

		} // function httpGet

		//
		// Run this code on initialisation of the node (startup, deploay)
		//
		if (debug) { console.log(nodeName + 'Init start') }
		RED.nodes.createNode(this, config);

		var node = this;
		var callNumber = 0;
		node.Listeners = {};
		node.nodeId = node.id.replace(/\./g, '_');

		if (debugDetailed) {
			console.log(nodeName + 'node description = ' + config.description);
			console.log(nodeName + 'node id          = ' + node.nodeId);
			console.log(nodeName + "ip               = " + config.ip);
			console.log(nodeName + "interval         = " + config.interval);
			console.log(nodeName + "user             = " + node.credentials.user);
			console.log(nodeName + "password         = " + node.credentials.password);
		} // if (debug)

		// start/try to read data from CMI 1 Second after initialisation
		setTimeout(function () {
			httpGet(config.ip, node.credentials.user, node.credentials.password) // 1. http read request to CMI after 1 second
		}, 1000);

		//Setup repeater
		node.repeaterSetup = function () {
			let repeat = config.interval;
			if (repeat && !isNaN(repeat) && repeat > 0) {
				repeat = repeat * 1000 * 60; // in milliseconds
//				repeat = repeat / 2; // overwrite setting in UI for quicker testing results - remove later!!!
				if (debug) { console.log(nodeName + "starting repeater setup with interval " + repeat + " ms") };
				this.repeaterID = setInterval(function () {
					// This code is executed repeated
					if (debug) { console.log(nodeName + 'Repeatingly fired ' + dateTime()) };
					httpGet(config.ip, node.credentials.user, node.credentials.password); // continuous http reqad requests to CMI
				}, repeat);
			}
		} // node.repeaterSetup

		node.repeaterSetup();
		if (debug) { console.log(nodeName + 'Init end') }

		node.on('close', function () {
			if (debug) { console.log(nodeName + 'INIT END: NODE-RED-CONTRIB-HTTP') };
		})

	} // cmiConfigNode (config);

	//
	// register node and get username and password from config
	//
	RED.nodes.registerType("cmi config", cmiConfigNode, {
		credentials: {
			user: { type: "text" },
			password: { type: "password" }
		}
	});

	cmiConfigNode.prototype.close = function () {
		if (debug) { console.log(nodeName + "stopping repeater...") };
		if (this.repeaterID != null) {
			clearInterval(this.repeaterID);
			if (debug) { console.log(nodeName + "repeater stopped") };
		}
		// console.log("finished stopping repeater");
	}; //cmiConfigNode.prototype.close

};


