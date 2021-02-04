# xstate-svg
convert XState (https://xstate.js.org/) to SVG

Inspired from https://github.com/jakesgordon/javascript-state-machine to convert xstate machine to ".dot" file description
then use @aduh95/viz.js/sync to convert to svg

# install
git clone https://github.com/sdejean28/xstate-svg.git

cd xstate-svg

npm install

# launch
node index.js

and you get a graph.svg

## known limitation
no actions in machine


#example
Image from xstate-visualiser (https://xstate.js.org/viz/)

![alt text](https://github.com/sdejean28/xstate-svg/blob/main/capture1.jpg)

graph.svg generated

![alt text](https://github.com/sdejean28/xstate-svg/blob/main/capture2.jpg)
