const { parentPort, workerData } = require("worker_threads");

const memo = {}

function operations(type, first, second) {
  switch (type) {
    case 'Add':
      return first + second;
    case 'Sub':
      return first - second;
    case 'Mul':
      return first * second;
    case 'Div':
      return first / second;
    case 'Rem':
      return first % second;
    case 'Eq':
      return first === second;
    case 'Neq':
      return first !== second;
    case 'Lt':
      return first < second;
    case 'Gt':
      return first > second;
    case 'Lte':
      return first <= second;
    case 'Gte':
      return first >= second;
    case 'And':
      return first && second;
    case 'Or':
      return first || second;
  }
}

function processNode(node, variables) {
  switch (node.kind) {
    case 'Int':
      return BigInt(node.value)
    case 'Str':
      return String(node.value)
    case 'Print':
      return console.log(processNode(node.value, variables))
    case 'Bool':
      return Boolean(node.value)
    case 'Let':
      variables[node.name.text] = processNode(node.value, variables)
      return processNode(node.next, {...variables })
    case 'Var':
      const value = variables[node.text];
      if (value === undefined) throw new Error('Variável não definida')
      return value
    case 'Binary':
      const toReturn =  operations(node.op, processNode(node.lhs, variables), processNode(node.rhs, variables))
      return toReturn;
    case 'Function':
      return (args, variables) => {
        const scopeVariables = { ...variables }
        node.parameters.forEach((item, index) => {
          scopeVariables[item.text] = args[index]
        })
        return processNode(node.value, { ...scopeVariables })
      }
    case 'If':
      if (processNode(node.condition, variables)) {
        return processNode(node.then, variables)
      } else {
        return processNode(node.otherwise, variables)
      }
    case 'Call':
      const call = processNode(node.callee, variables)
      const processArgs = node.arguments.map(item => processNode(item, variables))

      const search = `${node.callee.text}-${processArgs.toString()}`;
      const memoized = memo[search]
      if (memoized === undefined) {
        const returnValue = call(processArgs, variables)
        memo[search] = returnValue
        return returnValue
      }
      return memoized
    default:
      console.error('Termo não encontrado', node.kind)
      break;
  }
};

parentPort.postMessage(processNode(workerData, {}))
