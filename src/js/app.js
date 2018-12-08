import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {getParamsValues, resetParamValues} from './params';
import {parseBody} from './parser';
import {codeResults, performSymbolicSubstitution, resetCodeResults} from './symbolicSubstitution';
import {resetSymbolTable} from './symbolTable';

function presentSymbolicSubstitutedFunc(){
    const ResultsList = $('#parsedCode');
    let content = '';
    $.each(codeResults, function () {
        content += this;
    });
    ResultsList.append(content);
}

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        $('#parsedCode div').html('');
        resetSymbolTable();
        resetCodeResults();
        resetParamValues();
        let codeToParse = $('#codePlaceholder').val();
        let paramsValue = $('#variablesValues').val();
        getParamsValues(paramsValue);
        let parsedCode = parseCode(codeToParse);
        performSymbolicSubstitution(codeToParse);
        parseBody(parsedCode);
        presentSymbolicSubstitutedFunc();
    });
});
