import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {getParamsValues} from './params';
import {parseBody} from './parser';
import {performSymbolicSubstitution} from'./symbolicSubstitution';
import {resetSymbolTable} from './symbolTable';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        resetSymbolTable();
        let codeToParse = $('#codePlaceholder').val();
        let paramsValue = $('#variablesValues').val();
        getParamsValues(paramsValue);
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        performSymbolicSubstitution(codeToParse);
        parseBody(parsedCode);
    });
});
