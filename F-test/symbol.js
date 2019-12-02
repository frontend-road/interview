// symbol不能被for in遍历
// 需要使用Object.getOwnPropertySymbols进行遍历
var b = {};
var name1 = Symbol('flag');
b.name1 = 'hello'; // name1为字符串
b[name1] = 'world'; // name1为变量
for (const key in b) {
  console.log('key===', key);
  // if (b.hasOwnProperty(key)) {}
}

Object.getOwnPropertySymbols(b).forEach(symbol => console.log('symbol===', symbol));

console.log('----------------');

var c = {
  [Symbol.toPrimitive](hint) {
    console.log('hint===', hint);
    if (hint === 'number') {
      return 3;
    }
    return null;
  }
};
console.log(+c); // hint: number
console.log(Number(c)); // hint: number÷
console.log('' + c); // hint: default
console.log(`${c}`); // hint: string
console.log(String(c)); // hint: string

// console.log(Boolean(c));
// console.log(c.toString());

console.log('----------------');

// var a = 1;
var a = {
  // [Symbol.toPrimitive]: (function(i) {
  //   // console.log('hint----', hint);
  //   console.log('i---', i);
  //   return function() {
  //     return ++i;
  //   }
  // })(0),
  [Symbol.toPrimitive]: (i => (() => ++i))(0),
};
if (a == 1 && a == 2 && a == 3) {
  console.log('in here a...');
}

console.log('----------------');

var arr = [1, 2, 3, 4, 5, 6];
arr[Symbol.iterator] = function* () {
  let idx = 1;
  console.table(this);
  do {
    yield this[idx];
  } while ((idx += 2) < this.length);
}
for (const v of arr) {
  console.log('v---', v);
}

console.log('----------------');
