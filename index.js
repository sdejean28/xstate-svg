fs = require('fs');

var xstate = require("xstate");

var visualize = require('./visualize');
const vizRenderStringSync = require("@aduh95/viz.js/sync");

// Stateless machine definition
const toggleMachine = xstate.createMachine({
	id: 'fetch',
    initial: 'idle',
    context: {
      retries: 0
    },
    states: {
      idle: {
        on: {
          FETCH: 'loading'
        }
      },
      loading: {
        on: {
          RESOLVE: 'success',
          REJECT: 'failure'
        }
      },
      success: {
        type: 'final'
      },
      failure: {
        on: {
          RETRY: {
            target: 'loading',
            actions: xstate.assign({
              retries: (context, event) => context.retries + 1
            })
          }
        }
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