const fs = require('fs')
const json = JSON.parse(fs.readFileSync(process.argv[2]))
const { Worker } = require("worker_threads");

const worker = new Worker('./src/transpiler.js', { workerData: json.expression })

worker.on("online", () => console.time("transpiler worker ->"))
worker.on("message", result => result);
worker.on("exit", () => console.timeEnd("transpiler worker ->"))
