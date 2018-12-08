export let arrayCode = [];

export let codeResults = [];

export function addLineToResult(lineToAdd){
    codeResults.push(lineToAdd);
}

export function resetCodeResults(){
    codeResults = [];
}

export function performSymbolicSubstitution(codeString){
    arrayCode = codeString.split('\n');
}

export function getElementInArray(lineNumber){
    return arrayCode[lineNumber-1];
}


