var person = {
  age: 27
};
var handler = {
  set(target, key, value) {
    console.log(key, value);
    if (typeof value !== 'number' && Number.isNaN(Number(value))) {
      console.warn('age must be a number');
    } else {
      target[key] = value;
    }
    // return true;
  }
}
// handler: 处理器对象
var personProxy = new Proxy(person, handler);
console.log(personProxy);
personProxy.age = '28'; // set
personProxy.age = 'hello'; // set
console.log(personProxy.age); // get

console.log('----------------');

// tree
function Tree() {
  return new Proxy({}, {
    get(target, key, receiver) {
      // console.log(target, key, receiver);
      if (!(key in target)) {
        target[key] = Tree();
      }
      return Reflect.get(target, key, receiver);
    }
  });
}
var tree = Tree();
tree.class.student.a = 'zhang';
console.log('tree:', tree);

console.log('----------------');

// 单例
class Test {
  constructor(name) {
    this.name = name;
  }
}
var test1 = new Test('Test1');
var test2 = new Test('Test2');
console.log(test1.name, test2.name);

var getSingleInstanceProxy = function(cls) {
  var instance = null;
  return new Proxy(cls, {
    // handler.construct(target, argumentsList, newTarget) 方法用于拦截new 操作符
    // construct 方法必须返回一个对象。
    // target 目标对象。
    // argumentsList constructor的参数列表。
    // newTarget 最初被调用的构造函数
    construct(target, argumentsList, newTarget) {
      if (!instance) {
        // instance = new target(...argumentsList);
        instance = Reflect.construct(target, argumentsList);
      }
      return instance;
    }
  });
};

var testProxy = getSingleInstanceProxy(Test);
// console.log(testProxy);
var test1 = new testProxy('test1');
var test2 = new testProxy('test2');
console.log(test1.name, test2.name);

console.log('----------------');

// 异步调用栈顺序
var callback = () => {
  console.log(new Date().toLocaleString(), 'callback')
};
var asyncFunc = (cb) => {
  setTimeout(() => {
    cb();
  }, 1000);
}
asyncFunc(callback);
asyncFunc(callback);
asyncFunc(callback);

// 异步并发改为异步串行
// 1. async await
var callback1 = () => {
  console.log(new Date().toLocaleString(), 'callback1')
};
var asyncFunc1 = (cb) => new Promise(resolve => {
  setTimeout(() => {
    cb();
    resolve();
  }, 1000);
})
async function task() {
  await asyncFunc1(callback1);
  await asyncFunc1(callback1);
  await asyncFunc1(callback1);
}
task();

// 2. Proxy
var callback2 = () => {
  console.log(new Date().toLocaleString(), 'callback2');
}
var asyncFunc2 = (cb) => {
  setTimeout(() => {
    cb();
  }, 2000);
}
function createAsyncQueueProxy(asyncFunc) {
  let promise = null;
  return new Proxy(asyncFunc, {
    // handler.apply(target, thisArg, argumentsList) 方法用于拦截函数的调用。
    // apply方法可以返回任何值。
    // target 目标对象（函数）。
    // thisArg 被调用时的上下文对象。
    // argumentsList 被调用时的参数数组。
    apply(target, context, [cb, ...args]) {
      promise = Promise.resolve(promise).then(() => {
        return new Promise((resolve) => {
          Reflect.apply(target, this, [() => {
            resolve();
            cb();
          }, ...args]);
        })
      })
    }
  })
}
var asyncFuncProxy = createAsyncQueueProxy(asyncFunc2);
asyncFuncProxy(callback2);
asyncFuncProxy(callback2);
asyncFuncProxy(callback2);

console.log('----------------');
