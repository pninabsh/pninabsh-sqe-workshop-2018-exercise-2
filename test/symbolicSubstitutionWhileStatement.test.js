import assert from 'assert';
import {parseBody} from '../src/js/parser';
import {parseCode} from '../src/js/code-analyzer';
import {getParamsValues, resetParamValues} from '../src/js/params';
import {resetSymbolTable} from '../src/js/symbolTable';
import {resetCodeResults, codeResults, performSymbolicSubstitution} from '../src/js/symbolicSubstitution';

describe('Test function with while statement', () => {
    it('while statement in function', () => {
        let statementToTest = 'function test(x,y,z){\nlet a = x + 1;\nlet b = a + y;\nlet c = 0;\nlet d;\nwhile (a < z) {\nc = a + b;\nz = c * 2;\n}\nreturn z[0];\n}\n';
        resetSymbolTable();
        resetCodeResults();
        resetParamValues();
        performSymbolicSubstitution(statementToTest);
        getParamsValues('1,2,[1,2,3]');
        parseBody(parseCode(statementToTest));
        let resultArray = ['<div>' + 'function test(x,y,z){' + '</div>',
            '<div>' + 'while((x + 1) < z){' + '</div>',
            '<div>' + 'z = ((x + 1) + ((x + 1) + y)) * 2;' + '</div>',
            '<div>' + '}' + '</div>',
            '<div>' + 'return z[0];' + '</div>', '<div>' + '}' + '</div>'];
        assert.deepEqual(
            codeResults,
            resultArray
        );
    });
});

