
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

const memo = {}


function processNode(node, variables) {
  switch (node.kind) {
    case 'Int':
      return Number(node.value)
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
        const processArgs = args.map(item => processNode(item, variables))
        const scopeVariables = { ...variables }
        node.parameters.forEach((item, index) => {
          scopeVariables[item.text] = processArgs[index]
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

      // memorizar função com valor
      const search = `${node.callee.text}-${node.arguments.toString()}`;
      const memoized = memo[search]
      if (!memoized) {
        const returnValue = call(node.arguments, variables)
        memo[search] = returnValue
        return returnValue
      }
      return memoized

    default:
      break;
  }
};

module.exports = processNode

