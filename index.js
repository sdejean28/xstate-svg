fs = require('fs');

var xstate = require("xstate");

var visualize = require('./visualize');
const vizRenderStringSync = require("@aduh95/viz.js/sync");

// Stateless machine definition
const toggleMachine = xstate.createMachine({
id: 'custom',
        initial: 'default',
        context: {
        },
        states: {
            default: {
				on: { FORCE: { target: 'turn_off' }, 
					  OVER_TEMP: { target: 'turn_off' } },
				entry: 'sortieInactive',
				activities: ['beeping']
            },
            turn_off: {
				after: { TURNOFF_TIME: { target: 'turn_on' }},
				on: { FORCE: { target: 'turn_on' }, 
					  UNDER_TEMP: { target: 'turn_on' } },
				entry: 'sortieActive',
				activities: ['beeping_toff']
            },
            turn_on: {
				after: { TURNON_TIME: { target: 'default' } },
				on: { FORCE: { target: 'default' } },
				entry: 'sortieInactive',
				activities: ['beeping_ton']
            }
        }
});

const viz = visualize(toggleMachine, { name: 'toggleMachine', orientation: 'horizontal' });

console.log(viz);

try {
  fs.writeFileSync('graph.svg', vizRenderStringSync(viz));
} catch(err) {
  // An error occurred
  console.error(err);
}