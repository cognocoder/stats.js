
function check_min(stats, value) {
  if (value < stats.min) stats.min = value; 
}

function check_max(stats, value) {
  if (value > stats.max) stats.max = value; 
}

export default class statistics {

  constructor(array) {
    this.data = array;

    this.min = array[0];
    this.max = array[0];
    
    let pass = [];
    pass.push(check_min, check_max);

    for (let value of array)
      for (let fn of pass)
        fn(this, value);
  }

}

console.log(new statistics([ 1, 3, 0, 2, 0, 0, 3, 3, 3, 1, 2, 0 ]));
