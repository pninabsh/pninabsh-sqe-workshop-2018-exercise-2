import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {getParamsValues} from './params';
import {parseBody} from './parser';
import {performSymbolicSubstitution, presentSymbolicSubstitutedFunc} from './symbolicSubstitution';
import {resetSymbolTable} from './symbolTable';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        $('#parsedCode div').html('');
        resetSymbolTable();
        let codeToParse = $('#codePlaceholder').val();
        let paramsValue = $('#variablesValues').val();
        getParamsValues(paramsValue);
        let parsedCode = parseCode(codeToParse);
        performSymbolicSubstitution(codeToParse);
        parseBody(parsedCode);
        presentSymbolicSubstitutedFunc();
    });
});
