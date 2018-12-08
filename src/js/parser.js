import {generalSymbolicTable, addVariableToSymbolTable, findValueToSubstitute, findValueforPredicate, isGlobal} from './symbolTable';
import {addLineToResult, getElementInArray} from './symbolicSubstitution';
import {paramValues} from './params';
import {parseCode} from './code-analyzer';

function handleArrayExpression(binExp, symbolTable, predicate){
    let valuesArrays = [];
    for(let arrayElement of binExp.elements){
        valuesArrays.push(parseSmallExpression(arrayElement, symbolTable, predicate));
    }
    return '[' + valuesArrays.join(',') + ']';
}

function parseSmallExpressionHelp(binExp, symbolTable, predicate){
    /*if(binExp.type === 'UpdateExpression'){
        return binExp.prefix ? binExp.operator + '' + binExp.argument.name : binExp.argument.name + '' + binExp.operator;
    }
    else */if(binExp.type === 'UnaryExpression') {
        return binExp.operator + '' + parseSmallExpression(binExp.argument, symbolTable, predicate);
    }
    else if(binExp.type === 'ArrayExpression'){
        return handleArrayExpression(binExp, symbolTable, predicate);
    }
    else{
        return parseSmallExpression(binExp.left, symbolTable, predicate) + ' ' + binExp.operator + ' ' + parseSmallExpression(binExp.right, symbolTable, predicate);
    }
}

function parseSmallExpression(binExp, symbolTable, predicate) {
    if (binExp.type === 'Literal') {
        return binExp.value + '';
    }
    else if (binExp.type === 'Identifier') {
        return predicate? findValueforPredicate(symbolTable,binExp.name) : findValueToSubstitute(symbolTable,binExp.name);
    }
    else if (binExp.type === 'MemberExpression') {
        return parseSmallExpression(binExp.object, symbolTable, predicate) + '[' + parseSmallExpression(binExp.property, symbolTable, predicate) + ']';
    }
    else{
        return parseSmallExpressionHelp(binExp, symbolTable, predicate);
    }
}

function handleFunctionDeclaration(exp, symbolTable){
    addLineToResult('<div>' + getElementInArray(exp.loc.start.line) + '</div>');
    let i = 0;
    for (let param of exp.params) {
        addVariableToSymbolTable(symbolTable, param.name, paramValues[i], true);
        i++;
    }
    parseExp(exp.body, false, symbolTable);
}

function handleBlockStatement(exp, symbolTable){
    for(let bodyElement of exp.body) {
        parseExp(bodyElement, false, symbolTable);
    }
    addLineToResult('<div>' + '}' + '</div>');
}

function handleVariableDeclaration(exp, symbolTable){
    for(let bodyElement of exp.declarations){
        parseExp(bodyElement, false, symbolTable);
    }
}

function handleVariableDeclarator(exp, symbolTable){
    let value = exp.init == null ? '' : parseSmallExpression(exp.init, symbolTable, false);
    addVariableToSymbolTable(symbolTable, exp.id.name, value, false);
}

function handleExpressionStatement(exp, symbolTable){
    addVariableToSymbolTable(symbolTable, exp.expression.left.name, parseSmallExpression(exp.expression.right, symbolTable, false), false);
    let assignmentLine = '<div>' + exp.expression.left.name + ' = ' + parseSmallExpression(exp.expression.right, symbolTable, false) + ';' + '</div>';
    isGlobal(symbolTable, exp.expression.left.name)? addLineToResult(assignmentLine) : '';
}

function handleWhileStatement(exp, symbolTable){
    let symbolTableWhile = [];
    for(let symbol of symbolTable){
        symbolTableWhile.push({variable: symbol.variable, value: symbol.value, parameter: symbol.parameter});
    }
    let whileStatement = '<div>' + 'while(' +  parseSmallExpression(exp.test, symbolTable, false)+ '){' + '</div>';
    addLineToResult(whileStatement);
    parseExp(exp.body, false, symbolTableWhile);
}

function handlePreducate(exp, alternate, symbolTable){
    let typeExpression = alternate? 'else if ' : 'if ';
    let valueSmallExpression = parseSmallExpression(exp.test, symbolTable, true);
    let parsedExpression = parseCode(valueSmallExpression);
    let predicate = eval((parseSmallExpression(parsedExpression.body[0].expression, symbolTable, true)));
    let ifStatement = predicate? '<div style="background-color:lightgreen">' + typeExpression + '(' + parseSmallExpression(exp.test, symbolTable, false) + ')' +'{</div>':
        '<div style="background-color:red">' + typeExpression + '(' + parseSmallExpression(exp.test, symbolTable, false) + ')' + '{</div>';
    addLineToResult(ifStatement);
}

function handleIfStatement(exp, alternate, symbolTable){
    let symbolTableIf = [];
    for(let symbol of symbolTable){
        symbolTableIf.push({variable: symbol.variable, value: symbol.value, parameter: symbol.parameter});
    }
    handlePreducate(exp, alternate, symbolTable);
    parseExp(exp.consequent, false, symbolTableIf);
    if(exp.alternate != null && exp.alternate.type === 'IfStatement'){
        parseExp(exp.alternate, true, symbolTable);
    }
    else if(exp.alternate != null){
        let elseStatement = 'else{';
        addLineToResult('<div>' + elseStatement + '</div>');
        parseExp(exp.alternate, true, symbolTable);
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
    case 'FunctionDeclaration': handleFunctionDeclaration(exp, symbolTable); break;
    case 'ExpressionStatement': handleExpressionStatement(exp, symbolTable); break;
    default: parseExpHelpFunc2(exp, alternate, symbolTable);
    }
}

function parseExp (exp, alternate, symbolTable) {
    switch (exp.type) {
    case 'VariableDeclaration': handleVariableDeclaration(exp, symbolTable); break;
    case 'VariableDeclarator': handleVariableDeclarator(exp, symbolTable); break;
    default: parseExpHelpFunc(exp, alternate, symbolTable);
    }
}

function parseBody(parsedCode){
    let symbolTable = [];
    for(let symbol of generalSymbolicTable){
        symbolTable.push({variable: symbol.variable, value: symbol.value, parameter: symbol.parameter});
    }
    for(let bodyElement of parsedCode.body){
        parseExp(bodyElement, false, symbolTable);
    }
}
export {parseBody};