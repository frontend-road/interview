// 加入了状态
function MyPromise(fn) {
  var promise = this,
    value = null;
  promise._resolves = [];
  promise._status = 'PENDING';

  this.then = function (onFulfilled) {
    console.log('promise._status:', promise._status);
    if (promise._status === 'PENDING') {
      promise._resolves.push(onFulfilled);
      return this;
    }
    /**
     * 事件需要先注册(EventBus.on('click', () => {}))，然后进行触发(EventBus.emit('click'))。
     * 否则先触发后注册就不会执行，以下onFulfilled()的作用类似于保证后注册的能够执行先触发的事件。
     * 这个看具体需求要不要添加。
     */
    onFulfilled(value);
    return this;
  };

  function resolve(data) {
    // value = data;
    // promise._status = 'FULFILLED';
    // promise._resolves.forEach(function (callback) {
    //   callback(data);
    // })

    setTimeout(function () {
      promise._status = 'FULFILLED';
      promise._resolves.forEach(function (callback) {
        callback(data);
      })
    }, 0);
  }

  fn(resolve);
}

new MyPromise(function(resolve) {
  resolve('success promise3');
}).then(function(data) {
  console.log('then===', data);
});