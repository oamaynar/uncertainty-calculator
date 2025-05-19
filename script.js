// Initialize MathQuill
const MQ = MathQuill.getInterface(2); // Version 2 interface
const equationInput = MQ.MathField(document.getElementById('equationInput'), {
  spaceBehavesLikeTab: true,
  handlers: {
    edit: function() {
      const latex = equationInput.latex(); // Get the LaTeX string
      console.log("Live equation: ", latex);

      // Parse the equation and update variable fields
      updateVariableFields(latex);
    }
  }
});

// Set to track existing variable fields
let existingVariables = new Set();

// Function to update variable fields based on the equation
function updateVariableFields(latex) {
  try {
    // Convert LaTeX to a math.js-compatible string
    const cleaned = cleanLatex(latex);

    // Parse the equation and extract variables
    const node = math.parse(equation);

    const knownFunctions = new setInterval([
      "sin", "cos", "tan", "sec", "csc", "cot",
      "asin", "acos", "atan",
      "sqrt", "log", "ln", "exp",
      "abs", "floor", "ceil", "round",
      "min", "max", "pow", "mod",
      "e", "pi"
    ]);

  
    const rawSymbols = node
      .filter(n => n.isSymbolNode)
      .map(n => n.name);

    const variables = [...new Set(rawSymbols)].filter(name => !knownFunctions.has(name));

    console.log("User parameters:", variables);
    generateFields(variables);

    document.getElementById('expressionInspector').innerText = JSON.stringify(node, null, 2);

  } catch (error) {
    console.log("Parse error:", error.message);
    document.getElementById('expressionInspector').innerText = "Invalid equation.";
  }
}

function generateFields(variables) {
  const container = document.getElementById('variableInputs');

  // Step 1: Remove fields for variables that no longer exist
  for (const oldVar of existingVariables) {
    if (!variables.includes(oldVar)) {
      // Remove the inputs for this variable
      const valueInput = document.getElementById(`${oldVar}Value`);
      const uncertaintyInput = document.getElementById(`${oldVar}Uncertainty`);
      const label = document.getElementById(`${oldVar}Label`);
      const br = document.getElementById(`${oldVar}Break`);

      if (valueInput) valueInput.remove();
      if (uncertaintyInput) uncertaintyInput.remove();
      if (label) label.remove();
      if (br) br.remove();

      existingVariables.delete(oldVar);
    }
  }

  // Step 2: Add fields for new variables
  for (const variable of variables) {
    if (!existingVariables.has(variable)) {
      const label = document.createElement('label');
      label.innerText = `Value for ${variable}:`;
      label.id = `${variable}Label`;
      container.appendChild(label);

      const valueInput = document.createElement('input');
      valueInput.type = 'text';
      valueInput.id = `${variable}Value`;
      container.appendChild(valueInput);

      const uncertaintyInput = document.createElement('input');
      uncertaintyInput.type = 'text';
      uncertaintyInput.id = `${variable}Uncertainty`;
      uncertaintyInput.placeholder = `Uncertainty for ${variable}`;
      container.appendChild(uncertaintyInput);

      const br = document.createElement('br');
      br.id = `${variable}Break`;
      container.appendChild(br);

      existingVariables.add(variable);
    }
  }
}