function MyPromise(fn) {
  var promise = this,
    value = null;
  promise._resolves = [];

  this.then = function (onFulfilled) {
    promise._resolves.push(onFulfilled);
    return this; //链式支持
  };

  function resolve(value) {
    // 模拟异步
    setTimeout(function () {
      promise._resolves.forEach(function (callback) {
        callback(value);
      });
    }, 0);
  }

  fn(resolve);
}

new MyPromise(function(resolve) {
  resolve('success promise2');
}).then(function(data) {
  console.log('then===', data);
});
