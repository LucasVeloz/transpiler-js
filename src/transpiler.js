const variables = {};

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


function decisions(node) {
  switch (node.kind) {
    case 'Int':
      return node.value
    case 'Str':
      return node.value
    case 'Print':
      return console.log(decisions(node.value))
    case 'Bool':
      return node.value
    case 'Let':
      variables[node.name.text] = decisions(node.value)
      return decisions(node.next)
    case 'Var':
      const value = variables[node.text];
      if (value === undefined) throw new Error('Variavel não definida')
      return value
    case 'Binary':
      return operations(node.op, decisions(node.lhs), decisions(node.rhs))
    case 'Function':
      const params = node.parameters.map(item => item.text);
      return (params => {
        console.log('---> função', params)
      })()
    default:
      break;
  }
};

module.exports = decisions

