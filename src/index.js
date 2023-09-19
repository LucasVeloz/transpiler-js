// const json = require('../files/fib.json')
const json = require('../files/source.rinha.json')
const processNode = require('./transpiler')


console.time('transpiler')
processNode(json.expression, {})
console.timeEnd('transpiler')
