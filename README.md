[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)
[![npm](https://img.shields.io/npm/v/node-red-contrib-ta-cmi.svg)](https://www.npmjs.com/package/node-red-contrib-ta-cmi)
[![Current Release](https://img.shields.io/github/v/release/peteraustria/node-red-contrib-ta-cmi.svg?colorB=4cc61e)](https://github.com/peteraustria/node-red-contrib-ta-cmi/releases/latest)
[![downloads](https://img.shields.io/npm/dt/node-red-contrib-ta-cmi.svg)](https://www.npmjs.com/package/node-red-ta-cmi)
[![GitHub last commit](https://img.shields.io/github/last-commit/peteraustria/node-red-contrib-ta-cmi)](https://github.com/peteraustria/node-red-contrib-ta-cmi/commits/master)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/vivereSmartGroup/node-red-contrib-ta-cmi/master/LICENSE)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg?logo=paypal)](https://www.paypal.com/donate?business=RXENQEUPYFL2Y&no_recurring=1&currency_code=EUR)

# node-red-contrib-ta-cmi

![Logo](images/logo.png)
The <B>C</b>ontrol and <b>M</b>onitoring <b>I</b>nterface (<b>C.M.I.</b>) is an interface for convenient system monitoring, remote control and data loggingof all controllers with DL or CAN bus form <a href = "https://www.ta.co.at/en/"> Technischen Alternative RT GmbH, Austria</a>.</p>
<p>This node can be configured to query the <a href="https://www.ta.co.at/en/x2-operation-interfaces/cmi/">  <b>C.M.I.</b></a> at configurable intervals and provide any value at its output. So it is easy to access, display and visualize Data that is coming from e.g. the <a href="https://www.ta.co.at/en/x2-freely-programmable-controllers/uvr16x2/"> UVR16x2 programmable universal controler</a> with node-red.


## Quick Start

Install from your <b>Node-RED Manage Palette</b> or using npm:
```
npm install node-red-contrib-ta-cmi
```
## Example

![Example](images/demo1.png)

![Example](images/demo2.png)


```
[{"id":"d32cf45d.c9a4","type":"cmi in","z":"9bcb7893.92f808","cmi":"244863cc.935f84","name":"Feute Keller","item":"23","source":"0","timestamp":"0","x":150,"y":120,"wires":[["aae3b244.fd7a28","d1ffe25.0138b2"]]},{"id":"fcc86929.a56a38","type":"cmi in","z":"9bcb7893.92f808","cmi":"244863cc.935f84","name":"Feute Garage","item":"24","source":"0","timestamp":"0","x":150,"y":180,"wires":[["aae3b244.fd7a28","24ab1b9c.7347a4"]]},{"id":"47dea5ed.759ebc","type":"cmi in","z":"9bcb7893.92f808","cmi":"244863cc.935f84","name":"Ventilator EIN/AUS","item":"21","source":"1","timestamp":"0","x":170,"y":260,"wires":[["b57f6bfa.8cb098"]]},{"id":"2d98b677.847f9a","type":"cmi in","z":"9bcb7893.92f808","cmi":"244863cc.935f84","name":"Entfeuchtung EIN/AUS","item":"22","source":"1","timestamp":"0","x":180,"y":320,"wires":[["1a6a8eed.4f3099"]]},{"id":"aae3b244.fd7a28","type":"ui_chart","z":"9bcb7893.92f808","name":"Feuchte Keller/Garage","group":"88a17a33.f3f398","order":1,"width":"10","height":"6","label":"","chartType":"line","legend":"true","xformat":"HH:mm","interpolate":"linear","nodata":"","dot":false,"ymin":"40","ymax":"","removeOlder":"24","removeOlderPoints":"","removeOlderUnit":"3600","cutout":0,"useOneColor":false,"useUTC":false,"colors":["#097479","#aec7e8","#ff810f","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5"],"outputs":1,"useDifferentColor":false,"x":570,"y":240,"wires":[[]]},{"id":"d1ffe25.0138b2","type":"ui_gauge","z":"9bcb7893.92f808","name":"Feuchte Keller","group":"88a17a33.f3f398","order":2,"width":"2","height":"2","gtype":"gage","title":"Keller","label":"%rF","format":"{{value}}","min":"0","max":"100","colors":["#ff0000","#097479","#ff0000"],"seg1":"50","seg2":"75","x":540,"y":120,"wires":[]},{"id":"24ab1b9c.7347a4","type":"ui_gauge","z":"9bcb7893.92f808","name":"Feuchte Garage","group":"88a17a33.f3f398","order":3,"width":"2","height":"2","gtype":"gage","title":"Garage","label":"%rF","format":"{{value}}","min":"0","max":"100","colors":["#ff0000","#097479","#ff0000"],"seg1":"50","seg2":"75","x":550,"y":180,"wires":[]},{"id":"b57f6bfa.8cb098","type":"change","z":"9bcb7893.92f808","name":"0/1","rules":[{"t":"change","p":"payload","pt":"msg","from":"true","fromt":"bool","to":"49","tot":"num"},{"t":"change","p":"payload","pt":"msg","from":"false","fromt":"bool","to":"45","tot":"num"},{"t":"set","p":"topic","pt":"msg","to":"\"Ventilator EIN/AUS\"","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":350,"y":260,"wires":[["aae3b244.fd7a28"]]},{"id":"1a6a8eed.4f3099","type":"change","z":"9bcb7893.92f808","name":"0/1","rules":[{"t":"change","p":"payload","pt":"msg","from":"true","fromt":"bool","to":"44","tot":"num"},{"t":"change","p":"payload","pt":"msg","from":"false","fromt":"bool","to":"40","tot":"num"},{"t":"set","p":"topic","pt":"msg","to":"\"Entfeuchtung EIN/AUS\"","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":350,"y":320,"wires":[["aae3b244.fd7a28"]]},{"id":"244863cc.935f84","type":"cmi config","description":"TA C.M.I.","ip":"192.168.1.8","interval":"1"},{"id":"88a17a33.f3f398","type":"ui_group","name":"Entfeuchtung Keller","tab":"18886b9.a624594","order":9,"disp":true,"width":"12","collapse":true},{"id":"18886b9.a624594","type":"ui_tab","name":"Keller / Garage","icon":"exposure_neg_1","order":3,"disabled":false,"hidden":false}]
```


## Configuration

### One time Settings
In the "Edit cmi node" properties page klick the litte pencil icon and node-red will show up the "Add new cmi config config node". Here you fill in the requested information as follow:
![config-node](./images/config.PNG)
**Note:** For each C.M.I. in your network you have to do this only once.
When done, plase click the "Add" button and node-red will return you to the "Edit cmi in node".

### Settings for each node
You can place as many cmi-in nodes in your flows as you linke. From the dropdown select the same C.M.I. for each node (e.g. "TA C.M.I.").
![get-node](./images/get.PNG)


## What else...

### Resposibility

This node was developed by me privately, in my spare time and it is expressly <b>NOT a product of Technische Alternative RT GmbH</b>, but my own, private development. The company Technische Alternative RT GmbH is therefore neither responsible for the function nor for the support of this node. The author provides the code for free on GitHub "as it is" and also assumes no liability for any inconvenience or damage that may 
result from its use.

If you like it, I would appreciate a small donation. Just click here:
<form action="https://www.paypal.com/donate" method="post" target="_top">
<input type="hidden" name="business" value="RXENQEUPYFL2Y" />
<input type="hidden" name="no_recurring" value="1" />
<input type="hidden" name="currency_code" value="EUR" />
<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
<img alt="" border="0" src="https://www.paypal.com/en_AT/i/scr/pixel.gif" width="1" height="1" />
</form>


### BETA stage

The program development is currently in the test phase. The node has been extensively tested on my system, and it works with the hardware and configuration I'using. Currently, I do not have any information on how the node behaves in other environments. Please support me by reporting briefly about your experiences at <a href="https://github.com/PeterAustria/node-red-contrib-ta-cmi/issues">Issues on GitHub</a>.

### Changelog

0.1.0 Initial version 2021-10-22

## FAQ

Q: **After redeploying the node desplays `too many requests to C.M.I. (max 1 per min allowed)`.**

A: The C.M.I. allows a maximum of one query per minute. 
This is a requirement by Technische Alternative RT GmbH and not by the node.
Through the redeploy, the node is restarted. It immediately tries to access the C.M.I. and read out the latest data. If the last access was not at least 60 seconds ago, this error message is displayed. After the period of time specified in the configuration (at least one minute later), the node again tries to read the data from the C.M.I. Latest now, this should work successfully. If not, please check whether the node is really only configured once. Even if you want to read out multiple values you must configure the C.M.I. only once (click the litte pencil-icon only in the firest node you add). If you re-use the node, just open the dropdown and select the already configured C.M.I. 

Q: **The user credentials in the configuration of the node are correct, but the node still displays `wrong user or password`.**


A: You **must** use the credentials of an **"expert"** user. A normal user or guest does not work. 
This is a requirement by Technische Alternative RT GmbH and not by the node.

## Bugs and feature requests

This node was developed in my spare time (when I should actually be sleeping). If you have any change requests or notice errors, please be patient with me; it may take a while, but I am happy to add extensions and eliminate errors. Please report any issues or enhancement requests at <a href="https://github.com/PeterAustria/node-red-contrib-ta-cmi/issues">GitHub</a>.