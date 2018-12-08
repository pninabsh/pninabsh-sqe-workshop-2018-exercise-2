export let generalSymbolicTable = [];

export function addVariableToSymbolTable(symbolTable, variable, value, parameter){
    if(existsVariable(symbolTable, variable)){
        changeValue(symbolTable, variable, value);
    }
    else{
        symbolTable.push({ variable: variable, value: value, parameter: parameter });
    }
}

export function resetSymbolTable(){
    generalSymbolicTable = [];
}

export function findValueToSubstitue(symbolTable, variable){
    for(let variablesMap of symbolTable){
        if(variablesMap.variable === variable && !variablesMap.parameter){
            return variablesMap.value;
        }
    }
    return variable;
}

export function findValueforPredicate(symbolTable, variable){
    for(let variablesMap of symbolTable){
        if(variablesMap.variable === variable){
            return variablesMap.value;
        }
    }
    return variable;
}

function existsVariable(symbolTable, variable){
    for(let variableValue of symbolTable){
        if(variableValue.variable === variable){
            return true;
        }
    }
    return false;
}

function changeValue(symbolTable, variable, newValue){
    for(let variableValue of symbolTable) {
        if (variableValue.variable === variable) {
            variableValue.value = newValue;
        }
    }
}




