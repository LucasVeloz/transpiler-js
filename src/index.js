const fs = require('fs')
const { Worker } = require("worker_threads");

const json = JSON.parse(fs.readFileSync(process.argv[2]))
new Worker('./src/transpiler.js', { workerData: json.expression })
