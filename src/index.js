const fs = require('fs')
const { Worker } = require("worker_threads");

const json = JSON.parse(fs.readFileSync(process.argv[2]))
const worker = new Worker('./src/transpiler.js', { workerData: json.expression })

worker.on("online", () => console.time("transpiler worker ->"))
worker.on("exit", () => console.timeEnd("transpiler worker ->"))
