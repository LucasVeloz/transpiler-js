const { parentPort, workerData } = require("worker_threads");

const memo = {}

// function operations(type, first, second) {
//   switch (type) {
//     case 'Add':
//       return first + second;
//     case 'Sub':
//       return first - second;
//     case 'Mul':
//       return first * second;
//     case 'Div':
//       return first / second;
//     case 'Rem':
//       return first % second;
//     case 'Eq':
//       return first === second;
//     case 'Neq':
//       return first !== second;
//     case 'Lt':
//       return first < second;
//     case 'Gt':
//       return first > second;
//     case 'Lte':
//       return first <= second;
//     case 'Gte':
//       return first >= second;
//     case 'And':
//       return first && second;
//     case 'Or':
//       return first || second;
//   }
// }

// function processNode(node, variables) {
//   switch (node.kind) {
//     case 'File':
//       return node.expression
//     case 'Int':
//       return BigInt(node.value)
//     case 'Str':
//       return String(node.value)
//     case 'Print':
//       const valueToPrint = processNode(node.value, variables)
//       if (typeof valueToPrint === 'function') {
//         return console.log('<#closure>')
//       }

//       if (Array.isArray(valueToPrint)) {
//         return console.log(`(${valueToPrint})`)
//       }

//       if (typeof valueToPrint === 'bigint') {
//         return console.log(valueToPrint.toString())
//       }

//       return console.log(valueToPrint)
//     case 'Bool':
//       return Boolean(node.value)
//     case 'Let':
//       variables[node.name.text] = processNode(node.value, variables)
//       return processNode(node.next, {...variables })
//     case 'Var':
//       const value = variables[node.text];
//       if (value === undefined) throw new Error('Variável não definida')
//       return value
//     case 'Binary':
//       return operations(node.op, processNode(node.lhs, variables), processNode(node.rhs, variables))
//     case 'Function':
//       return (args, variables) => {
//         const scopeVariables = { ...variables }
//         node.parameters.forEach((item, index) => {
//           scopeVariables[item.text] = args[index]
//         })
//         return processNode(node.value, { ...scopeVariables })
//       }
//     case 'If':
//       if (processNode(node.condition, variables)) {
//         return processNode(node.then, variables)
//       } else {
//         return processNode(node.otherwise, variables)
//       }
//     case 'Call':
//       const call = processNode(node.callee, variables)
//       const processArgs = node.arguments.map(item => processNode(item, variables))

//       const search = `${node.callee.text}-${processArgs.toString()}`;
//       const memoized = memo[search]
//       if (memoized === undefined) {
//         const returnValue = call(processArgs, variables)
//         memo[search] = returnValue
//         return returnValue
//       }
//       return memoized

//     case 'Tuple':
//       return [processNode(node.first), processNode(node.second)]
//     case 'First':
//       return processNode(node.value.first)
//     case 'Second':
//       return processNode(node.value.second)
//     default:
//       console.error('Termo não encontrado', node.kind)
//       break;
//   }
// };

function operations(type, first, second) {
  const dict = {
    'Add': '+',
    'Sub': '-',
    'Mul': '*',
    'Div': '/',
    'Rem': '%',
    'Eq': '===',
    'Neq': '!==',
    'Lt': '<',
    'Gt': '>',
    'Lte': '<=',
    'Gte': '>=',
    'And': '&&',
    'Or': '||',
  }
  return `${first} ${dict[type]} ${second}`
}

function processNode(node) {
  switch (node.kind) {
    case "Let":
      return `const ${node.name.text} = ${processNode(node.value)}; ${processNode(node.next)}`;
    case "Binary":
      return operations(
        node.op,
        processNode(node.lhs),
        processNode(node.rhs)
      );
    case "Int":
      return node.value;
    case "Str":
      return node.value.toString();
    case "Bool":
      return node.value;
    case "Var":
      return node.text;
    case "Print":
      return `console.log(${processNode(node.value)});`;
    case "Function":
      const params = node.parameters.map((item) => item.text).join(", ");
      return `(${params}) => {
        ${processNode(node.value)}
      }`
    case "Call":
      const functionToCall = `${processNode(node.callee)}`;

      const args = node.arguments
      .map((item) => processNode(item))
      .join(", ");
      return `(() => {
        const search = '${functionToCall}-${args}';
        const memoized = memo[search]
        console.log('---->', memoized)
        if (memoized === undefined) {
          const returnValue = ${functionToCall}(${args});
          memo[search] = returnValue
          return returnValue
        }
        return memoized
      })()`;
    case "If":
      return `if (${processNode(node.condition)}) {
        return ${processNode(node.then)}
      } else {
        return ${processNode(node.otherwise)}
      }`;
    case "Tuple":
      return `[${processNode(node.first)}, ${processNode(node.second)}]`;
    case "First":
      return `${processNode(node.value)}[0]`;
    case "Second":
      return `${processNode(node.value)}[1]`;
    default:
      console.error("Termo não encontrado", node.kind);
      break;
  }
}

function execute(data) {
  const code = "const memo = {};\n" + processNode(data);
  // console.log(code);
  eval(code);
}

parentPort.postMessage(execute(workerData))
// parentPort.postMessage(processNode(workerData, {}))
