
function check_min(statistics, value) {
  if (value < statistics.min) statistics.min = value; 
}

function check_max(statistics, value) {
  if (value > statistics.max) statistics.max = value; 
}

function update_sum(statistics, value) {
  statistics.sum += value;
}

function update_mode_map(statistics, value) {
  let mode = statistics.mode;
  if (mode.has(value))
      mode.set(value, mode.get(value) + 1);
  else
    mode.set(value, 1);
}

function compute_mode(statistics, final_sort = true) {
  // Sort map by mode values descending.
  let mode = new Map([...statistics.mode.entries()]
    .sort(function mode_comparison(a,b) { return b[1] - a[1]; }));

  let mode_value = mode.values().next().value;

  // Remove keys with values that are less than the mode.
  for (let [key,value] of mode)
    if (value < mode_value) mode.delete(key);

  // Sort mode keys ascending.
  if (final_sort)
    mode = new Map([...mode].sort((a,b) => a[0] - b[0]));

  statistics.mode = mode;
}

class lookup_hooks {
  constructor(pre, on, pos) {
    this.pre = Array.isArray(pre) ? pre : [];
    this.on = Array.isArray(on) ? on : [];
    this.pos = Array.isArray(pos) ? pos : [];
  }
}

let default_lookup_hooks_array = [
  new lookup_hooks([], 
    [ check_min, check_max, update_sum, update_mode_map ],
    [ compute_mode, compute_range, compute_arithmetic_mean ])
];

function run_lookup_hooks(statistics, lookup_hooks) {
  // Call pre hooks.
  for (let fn of lookup_hooks.pre)
    fn(statistics);

  // Call on value hooks, e.g., hooks called on array lookup.
  for (let value of statistics.data)
    for (let fn of lookup_hooks.on)
      fn(statistics, value);

  // Call pos hooks.
  for (let fn of lookup_hooks.pos)
    fn(statistics);
}

function compute_range(statistics) {
  statistics.range = statistics.max - statistics.min;
}

function compute_arithmetic_mean(statistics) {
  statistics.mean["arithmetic"] = statistics.sum / statistics.data.length;
}

export default class statistics {

  constructor(array, lookup_hooks_array = []) {
    this.data = array;

    this.min = array[0];
    this.max = array[0];

    this.range = 0;

    this.sum = 0;
    
    this.mode = new Map();
    this.mean = {};

    for (let hooks of default_lookup_hooks_array)
      run_lookup_hooks(this, hooks);

    for (let hooks of lookup_hooks_array)
      run_lookup_hooks(this, hooks)
  }

}

console.log(new statistics([ 1, 3, 0, 2, 0, 0, 3, 3, 3, 1, 2, 0 ]));
