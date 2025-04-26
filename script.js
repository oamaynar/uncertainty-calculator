// Initialize MathQuill
const MQ = MathQuill.getInterface(2); // Version 2 interface
const equationInput = MQ.MathField(document.getElementById('equationInput'), {
  spaceBehavesLikeTab: true,
  handlers: {
    edit: function() {
      const latex = equationInput.latex(); // Get the LaTeX string
      console.log("Live equation:", latex);

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
    const equation = math.parse(latex).toString();

    // Parse the equation and extract variables
    const node = math.parse(equation);
    const variables = node
      .filter(node => node.isSymbolNode) // Get all symbol nodes
      .map(node => node.name) // Extract variable names
      .filter(variable => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variable)); // Validate variable names

    console.log("Variables found:", variables);

    // Generate input fields for variables
    generateFields(variables);

    // Display the parsed expression for debugging
    document.getElementById('expressionInspector').innerText = JSON.stringify(node, null, 2);
  } catch (error) {
    console.log("Parsing error:", error.message);
    document.getElementById('expressionInspector').innerText = "Invalid equation.";
  }
}

// Function to dynamically generate input fields for variables
function generateFields(variables) {
  const container = document.getElementById('variableInputs');
  container.innerHTML = ""; // Clear existing fields

  variables.forEach(variable => {
    if (!existingVariables.has(variable)) {
      // Create label
      const label = document.createElement('label');
      label.innerText = `Value for ${variable}:`;
      container.appendChild(label);

      // Create value input
      const valueInput = document.createElement('input');
      valueInput.type = 'text';
      valueInput.id = `${variable}Value`;
      container.appendChild(valueInput);

      // Create uncertainty input
      const uncertaintyInput = document.createElement('input');
      uncertaintyInput.type = 'text';
      uncertaintyInput.id = `${variable}Uncertainty`;
      uncertaintyInput.placeholder = `Uncertainty for ${variable}`;
      container.appendChild(uncertaintyInput);

      // Add a line break
      container.appendChild(document.createElement('br'));

      // Track the variable
      existingVariables.add(variable);
    }
  });
}