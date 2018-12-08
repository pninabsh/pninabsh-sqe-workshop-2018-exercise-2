import assert from 'assert';
import {parseBody} from '../src/js/parser';
import {parseCode} from '../src/js/code-analyzer';
import {getParamsValues, resetParamValues} from '../src/js/params';
import {resetSymbolTable} from '../src/js/symbolTable';
import {resetCodeResults, codeResults, performSymbolicSubstitution} from '../src/js/symbolicSubstitution';

describe('Test empty function symbolic substitution', () => {
    it('empty function', () => {
        let statementToTest = 'function test(x,y,z){\n}';
        resetSymbolTable();
        resetCodeResults();
        resetParamValues();
        performSymbolicSubstitution(statementToTest);
        getParamsValues('1,2,3');
        parseBody(parseCode(statementToTest));
        let resultArray = ['<div>' + 'function test(x,y,z){' + '</div>',
            '<div>' + '}' + '</div>'];
        assert.deepEqual(
            codeResults,
            resultArray
        );
    });
});

describe('Test function symbolic substitution with one local variable', () => {
    it('function with substitution in return statement', () => {
        let statementToTest = 'function test(x,y,z){\nlet c = 5;\nreturn c;\n}';
        resetSymbolTable();
        resetCodeResults();
        resetParamValues();
        performSymbolicSubstitution(statementToTest);
        getParamsValues('1,2,[1,2,3]');
        parseBody(parseCode(statementToTest));
        let resultArray = ['<div>' + 'function test(x,y,z){' + '</div>',
            '<div>' + 'return 5;' + '</div>',
            '<div>' + '}' + '</div>'];
        assert.deepEqual(
            codeResults,
            resultArray
        );
    });
});

describe('Test function symbolic substitution with one local variable and one parameter', () => {
    it('function with substitution in return statement', () => {
        let statementToTest = 'function test(x,y,z){\nlet c = 5;\nlet d = [1,2,3]\nreturn c + x;\n}';
        resetSymbolTable();
        resetCodeResults();
        resetParamValues();
        performSymbolicSubstitution(statementToTest);
        getParamsValues('1, 2,3');
        parseBody(parseCode(statementToTest));
        let resultArray = ['<div>' + 'function test(x,y,z){' + '</div>',
            '<div>' + 'return 5 + x;' + '</div>',
            '<div>' + '}' + '</div>'];
        assert.deepEqual(
            codeResults,
            resultArray
        );
    });
});