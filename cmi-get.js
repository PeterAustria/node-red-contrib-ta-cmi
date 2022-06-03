'use strict';

const async = require('async');
//const debug = require('debug')('cmi-config');

module.exports = function (RED) {

	const nodeName = 'NODE-RED-CONTRIB-TA-CMI (get): ';
	const debug = false;
	const debugDetailed = false;

	// Topics according TA Documentation "CMI-JSON-API Version 6 
	const cmiUnits = ["", "°C", "W/m²", "l/h", "Sek", "Min", "l/Imp", "K", "%", "", "kW", "kWh", "MWh", "V", "mA", "Std", "Tage", "Imp", "kΩ", "l", "km/h",
		"Hz", "l/min", "bar", "", "km", "m", "mm", "m³", "", "", "", "", "", "", "l/d", "m/s", "m³/min", "m³/h", "m³/d", "mm/min", "mm/h", "mm/d", "AUS/EIN",
		"NEIN/JA", "", "°C", "", "", "", "€", "$", "g/m³", "", "°", "", "°", "Sek", "", "%", "Uhr", "", "", "A", "", "mbar", "Pa", "ppm", "", "W", "t", "kg", "g", "cm", "K", "lx"];
		//IF "AUS/EIN" or "NEIN/JA" are changed, change it below in the code as well (search for "NEIN/JA" in the code)

	const cmiSecitons = ["Logging Analog", "Logging Digital","Inputs","Outputs","Network Analog","Network Digital","DL-Bus"];

	function dateTime(ts, withDate) {
		if (ts) { // Date and Time as a JS-Timestamp (in Millisekonds, as UTC)
			var date = new Date(ts)
			var hour = date.getUTCHours();
			var minute = date.getUTCMinutes();
			var second = date.getUTCSeconds();
			var day = date.getUTCDate();
			var month = date.getUTCMonth() + 1; // month as a number 0-11, so add 1
			var year = date.getUTCFullYear();
		} else { // no Parameter provided, so take system-time (not in UTC)
			var date = new Date()
			var hour = date.getHours();
			var minute = date.getMinutes();
			var second = date.getSeconds();
			var day = date.getDate();
			var month = date.getMonth() + 1; // month as a number 0-11, so add 1
			var year = date.getFullYear();
		};
		if (hour < 10) { hour = '0' + hour; }
		if (minute < 10) { minute = '0' + minute; }
		if (second < 10) { second = '0' + second; }
		if (day < 10) { day = '0' + day; }
		if (month < 10) { month = '0' + month; }
		if (withDate) {
			return (year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);
		} else {
			return (hour + ':' + minute + ':' + second);
		}
	} // function dateTime(ts, withDate);

	function cmiGetNode(config) {

		// Run this code on initialisation of the node (startup, deploy)

		if (debug) { console.log(nodeName + 'Init start') }

		RED.nodes.createNode(this, config);

		// Retrieve the values of this node
		//this.name = config.name;
	
		if (debugDetailed) { console.log(nodeName + '>>> name: ' + node.name) }

		// Retrieve the values of config node in this node
		this.cmi = RED.nodes.getNode(config.cmi);
		if (debugDetailed) { console.log(nodeName + 'Config: ' + JSON.stringify(this.cmi, null, 5)) }
		if (debugDetailed) { console.log(nodeName + 'Get: ' + JSON.stringify(this, null, 5)) }

		//save all (local node and config node) into node{}
		var node = this;
		node.lastValue = -99999.9;
		node.skipped = -1;

		//clear node.status
		node.status({ fill: "yellow", shape: "dot", text: "cmi.status.waiting" });

		//
		// register listener
		//
		node.cmi && node.cmi.registerListener(node, function (msg) {
			if (debug) { console.log(nodeName + RED._("cmi.logging.newDataArrived") + " --- "+ config.name + ": " + msg.payload) };

			// start checking Answer and show status in the node.status
			if (msg.httpStatusCode == 200) { // http connect sucessful
				if (msg.data["Status code"] == 0) { // cmi answer OK
					try { // check if all indexes are in the right range a.s.o.
						let newmsg = {};
						let statustext = '';
						// Old: config.item is stored in "Number" and does not represent index of array!
						// newmsg.payload = msg.data.Data[cmiSecitons[config.source]][config.item - 1].Value.Value; // "item -1": CMI starts counting with 1, JS starts with 0 
						// newmsg.unit = cmiUnits[msg.data.Data[cmiSecitons[config.source]][config.item - 1].Value.Unit];

						// New by alexhalbi: Parse CMI Output
						let dataList = msg.data.Data[cmiSecitons[config.source]];
						let dataItem = dataList.filter(function(item) {
							return item.Number == config.item
						})[0];
						let cmits = msg.data.Header.Timestamp * 1000; //"* 1000": because it is a Unix timestamp (in sec) and not a JS timestamp (in ms)"
						newmsg.payload = dataItem.Value.Value;
						newmsg.unit = cmiUnits[dataItem.Value.Unit];
						newmsg.topic = config.name;
						newmsg.timestamp = cmits;

						if (newmsg.unit == 'AUS/EIN') { // Replace "AUS/EIN" with "OFF", "AUS", ... or "ON", "EIN", ...
							if (newmsg.payload == 0) { newmsg.unit = RED._("cmi.units.offon.off") } else { newmsg.unit = RED._("cmi.units.offon.on") };
						}
						if (newmsg.unit == "NEIN/JA") { // Replace "NEIN/JA" with "NO", "NEIN", ... or "YES", "JA", ....
							if (newmsg.payload == 0) { newmsg.unit = RED._("cmi.units.yesno.no") } else { newmsg.unit = RED._("cmi.units.yesno.yes") };
						}
						statustext = newmsg.payload + ' ' + newmsg.unit;
						switch (config.timestamp) {
							case '1':
								// Time only
								statustext += ' (' + dateTime(cmits, false) + ')';  
								break;
							case '2':
								// Date and Time
								statustext += ' (' + dateTime(cmits, true) + ')';
								break;
						};
						let newValue = parseFloat(newmsg.payload);
						let skip = parseInt(config.skip);
						let severity = parseInt(config.severity);
						let varianz = newValue * severity / 100;
						if (debugDetailed) {	
							console.log(nodeName + '[' + config.name + '] New Value          : ' + newValue + '('+typeof(newValue)+')');
							console.log(nodeName + '[' + config.name + '] Old Value          : ' + node.lastValue + '('+typeof(node.lastValue)+')');
							console.log(nodeName + '[' + config.name + '] Skipped            : ' + node.skipped + '('+typeof(node.skipped)+')');
							console.log(nodeName + '[' + config.name + '] Skip               : ' + skip + '('+typeof(skip)+')');
							console.log(nodeName + '[' + config.name + '] Severity           : ' + severity + '('+typeof(severity)+')');
							console.log(nodeName + '[' + config.name + '] Varianz            : ' + varianz + '('+typeof(varianz)+')');
							console.log(nodeName + '[' + config.name + '] Inverval high      : ' + (newValue+varianz));
							console.log(nodeName + '[' + config.name + '] Inverval low       : ' + (newValue-varianz));
						}
						if ((newValue + varianz >= node.lastValue) && (newValue - varianz <= node.lastValue) && (node.skipped < skip)) {
							node.skipped ++;
							if (debug) { node.log(nodeName + '[' + config.name +'[ Skipped: last value ' + node.lastValue + ' | actual value ' + newValue + ' (+/- ' + varianz +') for ' + node.skipped + ' Times now.') };
							statustext += ' [' + RED._("cmi.status.skipped") + ': ' + node.skipped + ']';
						}
						else {
							node.send(newmsg);
							node.skipped = 0;
							node.lastValue = newValue;
						}
						node.status({ fill: "green", shape: "dot", text: statustext });
					} catch (err) {
						let cmiSource = RED._("cmi.sources.option99");
						switch (config.source) {
							case '0': cmiSource = RED._("cmi.sources.option0"); break;
							case '1': cmiSource = RED._("cmi.sources.option1"); break;
							case '2': cmiSource = RED._("cmi.sources.option2"); break;
							case '3': cmiSource = RED._("cmi.sources.option3"); break;
							case '4': cmiSource = RED._("cmi.sources.option4"); break;
							case '5': cmiSource = RED._("cmi.sources.option5"); break;
							case '6': cmiSource = RED._("cmi.sources.option6"); break;
						}
						if (debugDetailed) {	
							console.log(nodeName + '[' + config.name + '] config.source      : ' + config.source);
							console.log(nodeName + '[' + config.name + '] cmiSource          : ' + cmiSource);
						}
						let text = RED._("cmi.status.elementNotFound1")+' '+config.item+' '+RED._("cmi.status.elementNotFound2")+' "'+cmiSource+'" '+RED._("cmi.status.elementNotFound3");
						node.status({ fill: "red", shape: "dot", text: text });
					}
				} else { // cmi answer not OK
					switch (msg.data["Status code"]) {
						case 1:
							// NODE ERROR
							node.status({ fill: "yellow", shape: "dot", text: "cmi.status.cmiError1" });
							break;
						case 2:
							// FAIL
							node.status({ fill: "yellow", shape: "dot", text: "cmi.status.cmiError3" });
							break;
						case 3:
							// SYNTAX ERROR
							node.status({ fill: "red", shape: "dot", text: "cmi.status.cmiError3" });
							node.warn('HTTP call successful but CMI answered: ' + msg.data["Status code"] + '-' + msg.data.Status);
							break;
						case 4:
							// TOO MANY REQUESTS
							node.status({ fill: "yellow", shape: "dot", text: "cmi.status.cmiError4" });
							break;
						case 5:
							// DEVICE NOT SUPPORTED
							node.status({ fill: "yellow", shape: "dot", text: "cmi.status.cmiError5" });
							break;
						case 6:
							// TOO FEW ARGUMENTS
							node.status({ fill: "red", shape: "dot", text: "cmi.status.cmiError6" });
							node.warn('HTTP call successful but CMI answered: ' + msg.data["Status code"] + '-' + msg.data.Status);
							break;
						case 7:
							// CAN BUSY
							node.status({ fill: "yellow", shape: "dot", text: "cmi.status.cmiError7" });
							break;
						default:
							node.status({ fill: "red", shape: "dot", text: "cmi.status.cmiError" });
							node.warn('HTTP call successful but CMI answered: ' + msg.data["Status code"] + '-' + msg.data.Status);
					}
				}
			} else { // http connect not successful
				node.warn(RED._("cmi.logging.httpError") + msg.httpStatusCode + ' - ' + msg.httpStatusMessage);
				switch (msg.httpStatusCode) {
				//switch (Number(msg.httpStatusCode)) {
					case "300":
						// no live data requested but data in global context store not found
						node.status({ fill: "red", shape: "dot", text: "cmi.status.GCSError" });
						break;
					case "401":
						// wrong user oder password
						node.status({ fill: "red", shape: "dot", text: "cmi.status.httpErrorUser" });
						break;
					case "999":
						// wrong IP, hostname or CMI not reachable
						console.log(nodeName + "*** Error parsing result ***");
						node.status({ fill: "red", shape: "dot", text: "cmi.status.httpErrorHost" });
						break;
					case "998":
						// answer from host not parseabel
						node.status({ fill: "red", shape: "dot", text: "cmi.status.parseError" });
						break;
					default:
						// other http error
						node.status({ fill: "red", shape: "dot", text: "cmi.status.httpError" });
				}
			}

			if (debugDetailed) {
				console.log(nodeName + '[' + config.name + '] ' + JSON.stringify(msg.data, null, 5));
				console.log(nodeName + '[' + config.name + '] HTTP Status code   : ' + msg.httpStatusCode);
				console.log(nodeName + '[' + config.name + '] CMI Status Code    : ' + msg.data["Status code"]);
				console.log(nodeName + '[' + config.name + '] CMI Status Message : ' + msg.data.Status);
				console.log(nodeName + '[' + config.name + '] Topic              : ' + msg.topic);
				console.log(nodeName + '[' + config.name + '] Temperatur         : ' + msg.data.Data["Logging Analog"][0].Value.Value);
				console.log(nodeName + '[' + config.name + '] Temperature Unit   : ' + msg.data.Data["Logging Analog"][0].Value.Unit);
				console.log(nodeName + '[' + config.name + '] Item number        : ' + config.item);
				console.log(nodeName + '[' + config.name + '] Source             : ' + config.source);
				console.log(nodeName + '[' + config.name + '] Name               : ' + config.name);
				console.log(nodeName + '[' + config.name + '] Timestamp          : ' + config.timestamp);
				console.log(nodeName + '[' + config.name + '] Skip               : ' + config.skip);
				console.log(nodeName + '[' + config.name + '] Severity           : ' + config.severity);
				console.log(nodeName + config.name + ': ' + msg.data.Data["Logging Analog"][config.item].Value.Value + ' ' + cmiUnits[msg.data.Data["Logging Analog"][config.item].Value.Unit]);
			}
		});

		//
		// deregister listener
		//
		node.on('close', function () {
			node.cmi && node.cmi.deregisterListener(node);
		});

		if (debug) { console.log(nodeName + "Init done") };
	}
	RED.nodes.registerType("cmi in", cmiGetNode);


};