'use strict'

//-------------------------------------------------------------------------------------------------

var mixin = require('./mixin')

//-------------------------------------------------------------------------------------------------

function visualize(fsm, options) {
  return dotify(dotcfg(fsm, options));
}

//-------------------------------------------------------------------------------------------------
// pre-process xstate machine

function dotcfg(fsm, options) {

  options = options || {}

  var config      = dotcfg.fetch(fsm),
      name        = options.name,
      rankdir     = dotcfg.rankdir(options.orientation),
      states      = dotcfg.states(config, options),
      transitions = dotcfg.transitions(config, options),
      result      = { }

  if (name)
    result.name = name

  if (rankdir)
    result.rankdir = rankdir

  if (states && states.length > 0)
    result.states = states

  if (transitions && transitions.length > 0)
    result.transitions = transitions

  return result
}

//-------------------------------------------------------------------------------------------------

dotcfg.fetch = function(fsm) {
  return fsm.config
}

dotcfg.rankdir = function(orientation) {
  if (orientation === 'horizontal')
    return 'LR';
  else if (orientation === 'vertical')
    return 'TB';
}

//-------------------------------------------------------------------------------------------------

dotcfg.states = function(config, options) {
  var n, max, state,
      output = [];
  
  // get states names as array
  var states = Object.keys(config.states) || [];
  
  for (n = 0, max = states.length ; n < max ; n++) {
	  state = config.states[states[n]]; 
	  dotcfg.state(states[n], state, config, options, output)
  }
  return output;
}

dotcfg.state = function(nom, state, config, options, output) {
	var initial = config.initial;
	
	console.log('>', nom, state);
	
	
	if (state.type && state.type == 'final') {
		//console.log('final');
		output.push(mixin({}, { name : nom, attribute : '[shape = box,style=filled,color=lightgrey]' }, {}))
	} else if (initial && initial == nom) {
		//console.log('final');
		output.push(mixin({}, { name : "initial", attribute : '[shape = point]' }, {}))
		output.push(mixin({}, { name : initial, attribute : '[shape = box]' }, {}))
	} else {
		//console.log('default');
		output.push(mixin({}, { name : nom }, {}))
	}
	
}

//-------------------------------------------------------------------------------------------------

dotcfg.transitions = function(config, options) {
	
  var n, max, state,
      initial = config.initial,
      states = Object.keys(config.states) || [], // easier to visualize using the ORIGINAL transition declarations rather than our run-time mapping
      output = [];
  
	if (initial) {
		output.push(mixin({}, { from: "initial", to: initial }, {}))
	}
 
 
  for (n = 0, max = states.length ; n < max ; n++) {
 
	// loop overt each state
	state = config.states[states[n]];
	dotcfg.transition(states[n], state, config, options, output)
  }
 
  return output
}

dotcfg.transition = function(from, state, config, options, output) {
  var n,m, max_n,max_m, to, to_node;

	// for each state, check scenarios
	// console.log('>>', from, state);

	var scenarios = Object.keys(state) || [];
	
	for(n = 0, max_n = scenarios.length ; n < max_n ; n++) {
		
		if (scenarios[n] == 'after' || scenarios[n] == 'on' ) {
		
			// for each scenario, check transition
			var opt = state[scenarios[n]];
				
			// console.log('---', scenarios[n], opt);
				
			if (typeof opt == 'string') {
				
				// need to manage type for final
				
			} else {
				
				var opt_keys = Object.keys(opt) || [];
						
				for(m = 0, max_m = opt_keys.length ; m < max_m ; m++) {
					
					to = opt[opt_keys[m]];
					
					// console.log('****', opt_keys[m], to, typeof to);
					
					if (typeof to == 'string')
						to_node = to;
					else if (typeof to == 'object') {
						to_node = to.target;
					} else {
						to_node = '???';
					}
					
					output.push(mixin({}, { from: from, to: to_node, label: scenarios[n]+' '+opt_keys[m] }, {}))
				}
			}
		
		}


	}

}

//-------------------------------------------------------------------------------------------------
// utilities function for export .dot

function quote(name) {
  return "\"" + name + "\""
}


//-------------------------------------------------------------------------------------------------
// write .dot



function dotify(dotcfg) {

  dotcfg = dotcfg || {};

  var name        = dotcfg.name || 'fsm',
      states      = dotcfg.states || [],
      transitions = dotcfg.transitions || [],
      rankdir     = dotcfg.rankdir,
      output      = [],
      n, max;

  output.push("digraph " + quote(name) + " {")
  if (rankdir)
    output.push("  rankdir=" + rankdir + ";")
	
  for(n = 0, max = states.length ; n < max ; n++)
    output.push(dotify.state(states[n]))
	
  for(n = 0, max = transitions.length ; n < max ; n++)
    output.push(dotify.edge(transitions[n]))
	
  output.push("}")
  return output.join("\n")

}


dotify.state = function(state) {
	
  // console.log('dotify.state', state);
	
  return "  " + quote(state.name) + dotify.state.attr(state) + ";"
}

dotify.state.attr = function(state) {
  if (state.attribute) {
	  return " " + state.attribute + " ";
  } else {
	  return "";
  }
  
   
}

dotify.edge = function(edge) {
  return "  " + quote(edge.from) + " -> " + quote(edge.to) + dotify.edge.attr(edge) + ";"
}

dotify.edge.attr = function(edge) {
  var n, max, key, keys = Object.keys(edge).sort(), output = [];
  for(n = 0, max = keys.length ; n < max ; n++) {
    key = keys[n];
    if (key !== 'from' && key !== 'to')
      output.push(key + "=" + quote(edge[key]))
  }
  return output.length > 0 ? " [ " + output.join(" ; ") + " ]" : ""
}

//-------------------------------------------------------------------------------------------------

visualize.dotcfg = dotcfg;
visualize.dotify = dotify;

//-------------------------------------------------------------------------------------------------

module.exports = visualize;

//-------------------------------------------------------------------------------------------------
