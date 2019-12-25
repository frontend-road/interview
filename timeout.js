setImmediate(function() {
  console.log(2);
});
setTimeout(function() {
  console.log(1)
}, 0);
new Promise(function(resolve, reject) {
  console.log(4);
  resolve(4);
}).then(function() {
  console.log(5);
});
process.nextTick(function() {
  console.log(3);
});
console.log(6);
// 4 6 3 5 1 2