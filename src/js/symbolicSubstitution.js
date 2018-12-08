import $ from 'jquery';

export let arrayCode = [];

export let codeResults = [];

export function addLineToResult(lineToAdd){
    codeResults.push(lineToAdd);
}

export function performSymbolicSubstitution(codeString){
    arrayCode = codeString.split('\n');
}

export function getElementInArray(lineNumber){
    return arrayCode[lineNumber-1];
}

export function presentSymbolicSubstitutedFunc(){
    $('#parsedCode div').html('');
    const ResultsList = $('#parsedCode');
    let content = '';
    $.each(codeResults, function () {
        content += this;
    });
    ResultsList.append(content);
}


