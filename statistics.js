
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
  let mode = statistics.central_tendency.mode;
  if (mode.has(value))
      mode.set(value, mode.get(value) + 1);
  else
    mode.set(value, 1);
}

export default class statistics {

  constructor(array) {
    this.data = array;

    this.min = array[0];
    this.max = array[0];

    this.sum = 0;
    
    this.central_tendency = {};
    this.central_tendency.mode = new Map();

    let pass = [];
    pass.push(check_min, check_max, update_sum, update_mode_map);

    for (let value of array)
      for (let fn of pass)
        fn(this, value);

    this.central_tendency.mean = {
        arithmetic: this.sum / array.length,
        geometric: undefined,
        harmonic: undefined
    };
  }

}

console.log(new statistics([ 1, 3, 0, 2, 0, 0, 3, 3, 3, 1, 2, 0 ]));
