// const paiza_io = require('paiza-io');
const fetch = require("node-fetch");
// paiza_io('python3', 'print(2+3)', '', function (error, result) {
//   if (error) throw error;
//   console.log('python result:');
//   console.log(result.stdout); //=> Hello, Python World!
// });
const mySet1 = new Set();
const arr = [];
var obj = {};
var obj1 = { id: "21221", val: 2312 };
var obj2 = { id: "21221", val: 2312 };

arr.push(obj1);
arr.push(obj2);
// mySet1.add({
//     arr.push()
//   arr[1].push("amit");
// });

console.log(arr);
var code = {
  code: "print(3)",
  language: "python3",
};
const getResult = async (code) => {
  fetch(`https://codify-mini-fast.herokuapp.com/api/codeall`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(code),
  })
  .then((response) => response.json())
  .then((result) => {
  console.log(result);
  })
    .catch((err) => console.error(err));
};
getResult(code);
