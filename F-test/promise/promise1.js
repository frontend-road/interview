// 初步构建
function MyPromise(fn){
  //需要一个成功时的回调
  var callback;
  //一个实例的方法，用来注册异步事件
  this.then = function(done){
    callback = done;
  }
  function resolve(data){
    // callback();
    setTimeout(function() {
      callback(data);
    }, 0);
  }
  fn(resolve);
}

function request(){
  return new MyPromise(function(resolve,reject){
    if(true){
      resolve('hello');
    }
  })
}
request().then(function(data){
  // success()
  console.log('success===', data);
},function(){
  // error();
  console.log('error');
})
// async(function(){
//   const result = await request();
//   const result2 = await request();
//   const result3 = await request();
// })