const json = require('../files/fib.json')
// const json = require('./files/source.rinha.json')
const transpiler = require('./transpiler')


console.time('transpiler')
transpiler(json.expression)
console.timeEnd('transpiler')
