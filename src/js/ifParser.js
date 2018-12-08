import {findValueToSubstitue, addVariableToSymbolTable} from './symbolTable';
import {replaceOneLineWithAnother} from './symbolicSubstitution';

let ifParsingResults = [];

export function resetIfSymbolicTable(){
    ifParsingResults = [];
}

function parseSmallExpressionHelp(binExp, symbolTable){
    if(binExp.type === 'UpdateExpression'){
        return binExp.prefix ? binExp.operator + '' + binExp.argument.name : binExp.argument.name + '' + binExp.operator;
    }
    else{
        return parseSmallExpression(binExp.left, symbolTable) + ' ' + binExp.operator + ' ' + parseSmallExpression(binExp.right, symbolTable);
    }
}

function parseSmallExpression(binExp, symbolTable) {
    if (binExp.type === 'Literal') {
        return binExp.value + '';
    }
    else if (binExp.type === 'Identifier') {
        return findValueToSubstitue(symbolTable,binExp.name);
    }
    else if (binExp.type === 'MemberExpression') {
        return parseSmallExpression(binExp.object, symbolTable) + '[' + parseSmallExpression(binExp.property, symbolTable) + ']';
    }
    else if(binExp.type === 'UnaryExpression') {
        return binExp.operator + '' + parseSmallExpression(binExp.argument, symbolTable);
    }
    else{
        return parseSmallExpressionHelp(binExp, symbolTable);
    }
}

function handleBlockStatement(exp, symbolTable){
    for(let bodyElement of exp.body) {
        parseIfExp(bodyElement, false, symbolTable);
    }
}

function handleVariableDeclaration(exp, symbolTable){
    for(let bodyElement of exp.declarations){
        parseIfExp(bodyElement, false, symbolTable);
    }
}

function handleVariableDeclarator(exp, symbolTable){
    let value = exp.init == null ? '' : parseSmallExpression(exp.init, symbolTable);
    addVariableToSymbolTable(ifParsingResults, exp.init.name, value, false);
}

function handleExpressionStatement(exp, symbolTable){
    addVariableToSymbolTable(symbolTable, exp.expression.left.name, parseSmallExpression(exp.expression.right, symbolTable), false);
}

function handleWhileStatement(exp, symbolTable){

}

function handleIfStatement(exp, alternate, symbolTable){
    let symbolTableIf = [];
    for(let symbol of symbolTable){
        symbolTableIf.push({variable: symbol.variable, value: symbol.value, parameter: symbol.parameter});
    }
    let typeExpression = alternate? 'else if ' : 'if ';
    let ifStatement = typeExpression + parseSmallExpression(exp.test, symbolTable) + '{';
    replaceOneLineWithAnother(exp.loc.start.line, ifStatement);
    parseIfExp(exp.consequent, false, symbolTableIf);
    if(exp.alternate != null && exp.alternate.type === 'IfStatement'){
        parseIfExp(exp.alternate, true, symbolTable);
    }
    else if(exp.alternate != null){
        let elseStatement = 'else{ ';
        replaceOneLineWithAnother(exp.loc.start.line, elseStatement);
        parseIfExp(exp.alternate, true, symbolTable);
    }
}

function handleReturnStatement(exp, symbolTable){
    let newReturnLine = 'return ' + parseSmallExpression(exp.argument, symbolTable);
    replaceOneLineWithAnother(exp.loc.start.line, newReturnLine);
}

function parseExpHelpFunc2(exp, alternate, symbolTable){
    switch(exp.type){
    case 'WhileStatement': handleWhileStatement(exp, symbolTable); break;
    case 'IfStatement': handleIfStatement(exp, alternate, symbolTable); break;
    case 'ReturnStatement': handleReturnStatement(exp, symbolTable); break;
    }
}

function parseExpHelpFunc(exp, alternate, symbolTable){
    switch(exp.type){
    case 'BlockStatement': handleBlockStatement(exp, symbolTable); break;
    case 'ExpressionStatement': handleExpressionStatement(exp, symbolTable); break;
    default: parseExpHelpFunc2(exp, alternate, symbolTable);
    }
}

export function parseIfExp (exp, alternate, symbolTable) {
    switch (exp.type) {
    case 'VariableDeclaration': handleVariableDeclaration(exp, symbolTable); break;
    case 'VariableDeclarator': handleVariableDeclarator(exp, symbolTable); break;
    default: parseExpHelpFunc(exp, alternate, symbolTable);
    }
}