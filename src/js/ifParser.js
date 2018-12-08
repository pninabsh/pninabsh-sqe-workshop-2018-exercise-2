import {findValueToSubstitue, findValueforPredicate, addVariableToSymbolTable} from './symbolTable';
import {addLineToResult} from './symbolicSubstitution';

function parseSmallExpressionHelp(binExp, symbolTable){
    if(binExp.type === 'UpdateExpression'){
        return binExp.prefix ? binExp.operator + '' + binExp.argument.name : binExp.argument.name + '' + binExp.operator;
    }
    else{
        return '(' + parseSmallExpression(binExp.left, symbolTable) + ' ' + binExp.operator + ' ' + parseSmallExpression(binExp.right, symbolTable) + ')';
    }
}

function parseSmallExpression(binExp, symbolTable, predicate) {
    if (binExp.type === 'Literal') {
        return binExp.value + '';
    }
    else if (binExp.type === 'Identifier') {
        return predicate? findValueforPredicate(symbolTable,binExp.name) : findValueToSubstitue(symbolTable,binExp.name);
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
    addLineToResult('<div>' + '}' + '</div>');
}

function handleVariableDeclaration(exp, symbolTable){
    for(let bodyElement of exp.declarations){
        parseIfExp(bodyElement, false, symbolTable);
    }
}

function handleVariableDeclarator(exp, symbolTable){
    let value = exp.init == null ? '' : parseSmallExpression(exp.init, symbolTable, false);
    addVariableToSymbolTable(symbolTable, exp.init.name, value, false);
}

function handleExpressionStatement(exp, symbolTable){
    addVariableToSymbolTable(symbolTable, exp.expression.left.name, parseSmallExpression(exp.expression.right, symbolTable, false), false);
}

function handleWhileStatement(exp, symbolTable){

}

function handleIfStatement(exp, alternate, symbolTable){
    let symbolTableIf = [];
    for(let symbol of symbolTable){
        symbolTableIf.push({variable: symbol.variable, value: symbol.value, parameter: symbol.parameter});
    }
    let typeExpression = alternate? 'else if ' : 'if ';
    let predicate = eval(parseSmallExpression(exp.test, symbolTable, true));
    let ifStatement = predicate? '<div style="background-color:lightgreen">' + typeExpression + '(' + parseSmallExpression(exp.test, symbolTable, false) + ')' +'{</div>':
        '<div style="background-color:red">' + typeExpression + '(' + parseSmallExpression(exp.test, symbolTable, false) + ')' + '{</div>';
    addLineToResult(ifStatement);
    parseIfExp(exp.consequent, false, symbolTableIf);
    if(exp.alternate != null && exp.alternate.type === 'IfStatement'){
        parseIfExp(exp.alternate, true, symbolTable);
    }
    else if(exp.alternate != null){
        let elseStatement = 'else{';
        addLineToResult('<div>' + elseStatement + '</div>');
        parseIfExp(exp.alternate, true, symbolTable);
    }
}

function handleReturnStatement(exp, symbolTable){
    let newReturnLine = 'return ' + parseSmallExpression(exp.argument, symbolTable, false) + ';';
    addLineToResult('<div>' + newReturnLine + '</div>');
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