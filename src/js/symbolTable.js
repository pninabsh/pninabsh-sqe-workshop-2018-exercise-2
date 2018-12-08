export let generalSymbolicTable = [];

export function addVariableToSymbolTable(symbolTable, variable, value, parameter){
    if(value.length > 1){
        if(value.indexOf('0') !== -1 && value.length-1 !== value.indexOf('0')){
            value = value.substring(0, value.indexOf('0')) + value.substring(value.indexOf('0') + 4);
            addVariableToSymbolTable(symbolTable, variable, value, parameter);
        }
        else if(value.indexOf('0')!==-1){
            value = value.substring(0, value.indexOf('0')-3);
        }
    }
    handleVariable(symbolTable, variable, value, parameter);
}

function handleVariable(symbolTable, variable, value, parameter){
    if(value.length > 1){
        value = '(' + value + ')';
    }
    if(existsVariable(symbolTable, variable)){
        changeValue(symbolTable, variable, value);
    }
    else{
        symbolTable.push({ variable: variable, value: value, parameter: parameter });
    }
}

export function isGlobal(symbolTable, variable){
    for(let variablesMap of symbolTable){
        if(variablesMap.variable === variable){
            return variablesMap.parameter;
        }
    }
}

export function resetSymbolTable(){
    generalSymbolicTable = [];
}

export function findValueToSubstitute(symbolTable, variable){
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
            if(variablesMap.value === '0'){
                return '';
            }
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




