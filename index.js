fs = require('fs');

var xstate = require("xstate");
var visualize = require('./visualize');
const vizRenderStringSync = require("@aduh95/viz.js/sync");

// Stateless machine definition
const toggleMachine = xstate.createMachine({
  id: 'toggle',
  initial: 'turn_off',
  states: {
	turn_off: { on: { START : 'turn_on' } },
	turn_on: { after: { 5000 : 'turn_off' } },
  }
});

const viz = visualize(toggleMachine, { name: 'toggleMachine', orientation: 'horizontal' });

try {
  fs.writeFileSync('graph.svg', vizRenderStringSync(viz));
} catch(err) {
  // An error occurred
  console.error(err);
}