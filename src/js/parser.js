import {parseWhileExp} from './whileParser';
import {parseIfExp, resetIfSymbolicTable} from './ifParser';
import {generalSymbolicTable, addVariableToSymbolTable, findValueToSubstitue} from './symbolTable';
import {replaceOneLineWithAnother} from './symbolicSubstitution';
import {paramValues} from './params';

function parseSmallExpressionHelp(binExp){
    if(binExp.type === 'UpdateExpression'){
        return binExp.prefix ? binExp.operator + '' + binExp.argument.name : binExp.argument.name + '' + binExp.operator;
    }
    else{
        return parseSmallExpression(binExp.left) + ' ' + binExp.operator + ' ' + parseSmallExpression(binExp.right);
    }
}

function parseSmallExpression(binExp) {
    if (binExp.type === 'Literal') {
        return binExp.value + '';
    }
    else if (binExp.type === 'Identifier') {
        return findValueToSubstitue(generalSymbolicTable, binExp.name);
    }
    else if (binExp.type === 'MemberExpression') {
        return parseSmallExpression(binExp.object) + '[' + parseSmallExpression(binExp.property) + ']';
    }
    else if(binExp.type === 'UnaryExpression') {
        return binExp.operator + '' + parseSmallExpression(binExp.argument);
    }
    else{
        return parseSmallExpressionHelp(binExp);
    }
}

function handleFunctionDeclaration(exp){
    let i = 0;
    for (let param of exp.params) {
        addVariableToSymbolTable(generalSymbolicTable, param.name, paramValues[i], true);
        i++;
    }
    parseExp(exp.body, false);
}

function handleBlockStatement(exp){
    for(let bodyElement of exp.body) {
        parseExp(bodyElement, false);
    }
}

function handleVariableDeclaration(exp){
    for(let bodyElement of exp.declarations){
        parseExp(bodyElement, false);
    }
}

function handleVariableDeclarator(exp){
    let value = exp.init == null ? '' : parseSmallExpression(exp.init, generalSymbolicTable);
    addVariableToSymbolTable(generalSymbolicTable, exp.id.name, value, false);
}

function handleExpressionStatement(exp){
    addVariableToSymbolTable(generalSymbolicTable, exp.expression.left.name, parseSmallExpression(exp.expression.right), false);
}

function handleWhileStatement(exp){


}

function handleIfStatement(exp, alternate){
    resetIfSymbolicTable();
    parseIfExp(exp, alternate, generalSymbolicTable);
}

function handleReturnStatement(exp){
    let newReturnLine = 'return ' + parseSmallExpression(exp.argument);
    replaceOneLineWithAnother(exp.loc.start.line, newReturnLine);
}

function parseExpHelpFunc2(exp, alternate){
    switch(exp.type){
    case 'WhileStatement': handleWhileStatement(exp); break;
    case 'IfStatement': handleIfStatement(exp, alternate); break;
    case 'ReturnStatement': handleReturnStatement(exp); break;
    }
}

function parseExpHelpFunc(exp, alternate){
    switch(exp.type){
    case 'BlockStatement': handleBlockStatement(exp); break;
    case 'FunctionDeclaration': handleFunctionDeclaration(exp); break;
    case 'ExpressionStatement': handleExpressionStatement(exp); break;
    default: parseExpHelpFunc2(exp, alternate);
    }
}

function parseExp (exp, alternate) {
    switch (exp.type) {
    case 'VariableDeclaration': handleVariableDeclaration(exp); break;
    case 'VariableDeclarator': handleVariableDeclarator(exp); break;
    default: parseExpHelpFunc(exp, alternate);
    }
}

function parseBody(parsedCode){
    for(let bodyElement of parsedCode.body){
        parseExp(bodyElement, false);
    }
}
export {parseBody};