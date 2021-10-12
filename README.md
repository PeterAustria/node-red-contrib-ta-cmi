[![platform](https://img.shields.io/badge/platform-Node--RED-red)](https://nodered.org)
[![npm](https://img.shields.io/npm/v/node-red-contrib-ta-cmi.svg)](https://www.npmjs.com/package/node-red-contrib-ta-cmi)
[![downloads](https://img.shields.io/npm/dt/node-red-contrib-ta-cmi.svg)](https://www.npmjs.com/package/node-red-ta-cmi)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/vivereSmartGroup/node-red-contrib-display-property/master/LICENSE)

# node-red-contrib-ta-cmi

## BETA

The task of this node is to control the C.M.I. of the technical alternative at regular intervals and provide the received data as an output at the node. A config node is used to establish the connection to the C.M.I. and any number of nodes can be used to get the individual values.

Die Aufgabe dieses Nodes ist es, das C.M.I. der Technischen Alternative in regelmäßigen Abständen abzufragen und die erhaltenen Daten als Ausgang am Node bereitzustellen. Dabei wird ein config-node verwendet um die Verbindung zum C.M.I. herzustellen und beliebig viele nodes können verwendet werden, um die einzelnen Werte zu erhalten.

![grafik](https://github.com/PeterAustria/node-red-contrib-ta-cmi/blob/84a43e761cbe02730096fc870eab0bf7c105cfd4/icons/CMI.png)

## Quick Start

Install from your <b>Node-RED Manage Palette</b> or using npm:
```
npm install node-red-contrib-ta-cmi
```
## Example

All values that configured for datalogging in a X2-Device...
![grafik](https://github.com/PeterAustria/node-red-contrib-ta-cmi/blob/292d75aa5da785df773777ecadeb805204d5e751/icons/TA16x2.PNG)

...can be monitored in node-red
![grafik](https://github.com/PeterAustria/node-red-contrib-ta-cmi/blob/292d75aa5da785df773777ecadeb805204d5e751/icons/output.PNG)

## Important

### Resposibility

This node is expressly NOT a product of Technische Alternative RT GmbH, but an own, private development of the author. The company Technische Alternative RT GmbH is therefore neither responsible for the function nor for the support of this node. The author provides the code for free on GitHub "as it is" and also assumes no liability for any inconvenience or damage that may result from its use.

Dieser Node ist ausdrücklich KEIN Produkt der Firma Technische Alternative RT GmbH, sondern eine eigene, private Entwicklung des Autors. Die Firma Technische Alternative RT GmbH ist daher weder für die Funktion noch für den Support dieses Nodes zuständig. Der Autor stellt den Code kostenlos auf GitHub "as it is" zur Verfügung und übernimmt ebenfalls keinerlei Haftung für Unannehmlichkeiten oder Schäden, die aus seiner Verwendung resultieren.

### BETA stage

The program development is currently still in the test phase. The node has been extensively tested on the developer's system, but no information is yet available on how the node behaves in other environments. Please support me by reporting briefly about your experiences at <a href="https://github.com/PeterAustria/node-red-contrib-ta-cmi/issues">Issues on GitHub </a>.

Derzeit befindet sich die Programmentwicklung noch in der Testphase. Der Node wurde ausgiebig am System des Entwicklers getestet, es liegen aber noch keine Informationen vor, wie sich der Node in anderen Umgebungen verhält. Bitte unterstütze mich, indem du kurz über deine Erfahrungen unter <a href="https://github.com/PeterAustria/node-red-contrib-ta-cmi/issues">Issues auf GitHub</a> berichtest.

## Bugs and feature requests

Please report any issues or enhancement requests at <a href="https://github.com/PeterAustria/node-red-contrib-ta-cmi/issues">GitHub</a>.
