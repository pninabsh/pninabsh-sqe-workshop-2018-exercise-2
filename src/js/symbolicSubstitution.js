export let arrayCode = [];

export function performSymbolicSubstitution(codeString){
    arrayCode = codeString.split('\n');
}

export function removeLine(lineNumber){
    arrayCode.remove(arrayCode[lineNumber]);
}

export function replaceOneLineWithAnother(lineNumberToReplace, newElement){
    arrayCode[lineNumberToReplace-1] = newElement;
}

function mergeAllLines(){
    return arrayCode.join();
}
