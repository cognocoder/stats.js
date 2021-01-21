
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

export default class statistics {

  constructor(array) {
    this.data = array;

    this.min = array[0];
    this.max = array[0];

    this.range = 0;

    this.sum = 0;
    
    this.mode = new Map();

    let pass = [];
    pass.push(check_min, check_max, update_sum, update_mode_map);

    for (let value of array)
      for (let fn of pass)
        fn(this, value);

    this.range = this.max - this.min;

    this.mean = {
        arithmetic: this.sum / array.length,
        geometric: undefined,
        harmonic: undefined
    };

    compute_mode(this);
  }

}

console.log(new statistics([ 1, 3, 0, 2, 0, 0, 3, 3, 3, 1, 2, 0 ]));
