import assert from 'assert';
import {parseBody} from '../src/js/parser';
import {parseCode} from '../src/js/code-analyzer';
import {getParamsValues, resetParamValues} from '../src/js/params';
import {resetSymbolTable} from '../src/js/symbolTable';
import {resetCodeResults, codeResults, performSymbolicSubstitution} from '../src/js/symbolicSubstitution';

describe('Test function with single if statement - wrong predicate', () => {
    it('empty function', () => {
        let statementToTest = 'function test(x,y,z){\n' + 'let c = 0;\n' + 'if(x > 5){\n' + 'c = c + 5;\n' + 'return c;\n' + '}\n' + 'return -1;\n' + '}';
        resetSymbolTable();
        resetCodeResults();
        resetParamValues();
        performSymbolicSubstitution(statementToTest);
        getParamsValues('1,2,3');
        parseBody(parseCode(statementToTest));
        let resultArray = ['<div>' + 'function test(x,y,z){' + '</div>',
            '<div style="background-color:red">' + 'if (x > 5){' + '</div>',
            '<div>' + 'return 5;' + '</div>',
            '<div>' + '}' + '</div>',
            '<div>' + 'return -1;' + '</div>', '<div>' + '}' + '</div>'];
        assert.deepEqual(
            codeResults,
            resultArray
        );
    });
});

describe('Test function with single if statement - correct predicate', () => {
    it('empty function', () => {
        let statementToTest = 'function test(x,y,z){\nlet c = 0;\nif(x > 0){\nc = c + 5;\nreturn c;\n}\nreturn c;\n}';
        resetSymbolTable();
        resetCodeResults();
        resetParamValues();
        performSymbolicSubstitution(statementToTest);
        getParamsValues('1,2,3');
        parseBody(parseCode(statementToTest));
        let resultArray = ['<div>' + 'function test(x,y,z){' + '</div>',
            '<div style="background-color:lightgreen">' + 'if (x > 0){' + '</div>',
            '<div>' + 'return 5;' + '</div>',
            '<div>' + '}' + '</div>',
            '<div>' + 'return 0;' + '</div>', '<div>' + '}' + '</div>'];
        assert.deepEqual(
            codeResults,
            resultArray
        );
    });
});

describe('Test function if, else if and else statements with 0 not in the end of the line', () => {
    it('empty function', () => {
        let statementToTest = 'function test(x,y,z){\nlet a = x + 1;\nlet b = a + y;\nlet c = 0;\nif (b < z) {\nc = c + 5;\nreturn x + y + z + c;\n} else if (b < z * 2) {c = c + x + 5;\nreturn x + y + z + c;\n} else {\nc = c + z + 5;\nreturn x + y + z + c;\n}\n}';
        resetSymbolTable();
        resetCodeResults();
        resetParamValues();
        performSymbolicSubstitution(statementToTest);
        getParamsValues('1,2,3');
        parseBody(parseCode(statementToTest));
        let resultArray = ['<div>' + 'function test(x,y,z){' + '</div>',
            '<div style="background-color:red">' + 'if (((x + 1) + y) < z){' + '</div>',
            '<div>' + 'return x + y + z + 5;' + '</div>',
            '<div>' + '}' + '</div>',
            '<div style="background-color:lightgreen">' + 'else if (((x + 1) + y) < z * 2){' + '</div>', '<div>' + 'return x + y + z + (x + 5);' + '</div>', '<div>' + '}' + '</div>', '<div>' + 'else{' + '</div>', '<div>' + 'return x + y + z + (z + 5);' + '</div>', '<div>' + '}' + '</div>', '<div>' + '}' + '</div>',];
        assert.deepEqual(
            codeResults,
            resultArray
        );
    });
});

describe('Test function if, else if and else statements with 0 in the end of the line', () => {
    it('empty function', () => {
        let statementToTest = 'function test(x,y,z){\nlet a = x + 1;\nlet b = a + y;\nlet c = 0;\nif (b < z) {\nc = 5 + c;\nreturn x + y + z + c;\n}else if (b < z * 2) {\nc = c + x + 5;\nreturn x + y + z + c;\n} else {\nc = c + z + 5;\nreturn x + y + z + c;\n}\n}';
        resetSymbolTable();
        resetCodeResults();
        resetParamValues();
        performSymbolicSubstitution(statementToTest);
        getParamsValues('1,2,3');
        parseBody(parseCode(statementToTest));
        let resultArray = ['<div>' + 'function test(x,y,z){' + '</div>',
            '<div style="background-color:red">' + 'if (((x + 1) + y) < z){' + '</div>',
            '<div>' + 'return x + y + z + 5;' + '</div>',
            '<div>' + '}' + '</div>',
            '<div style="background-color:lightgreen">' + 'else if (((x + 1) + y) < z * 2){' + '</div>', '<div>' + 'return x + y + z + (x + 5);' + '</div>', '<div>' + '}' + '</div>', '<div>' + 'else{' + '</div>', '<div>' + 'return x + y + z + (z + 5);' + '</div>', '<div>' + '}' + '</div>', '<div>' + '}' + '</div>',];
        assert.deepEqual(
            codeResults,
            resultArray
        );
    });
});