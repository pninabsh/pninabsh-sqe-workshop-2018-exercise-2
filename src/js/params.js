export let paramValues = [];

export function getParamsValues(paramsString){
    const i = 0;
    if(paramsString.length > 0 && paramsString.charAt(i) === ' '){
        getParamsValues(paramsString.substring(1));
    }
    else if(paramsString.length > 0 && paramsString.charAt(i) === '['){
        handleArray(paramsString, i);
    }
    else{
        handleRegularLiteral(paramsString, i);
    }
}

function handleArray(paramsString, i){
    while(i < paramsString.length && paramsString.charAt(i) !== ']'){
        i++;
    }
    paramValues.push(paramsString.substring(0, i+1));
    getParamsValues(paramsString.substring(i+1));
}

function handleRegularLiteral(paramsString, i){
    if(paramsString.length > 0) {
        while (i < paramsString.length && paramsString.charAt(i) !== ',') {
            i++;
        }
        paramValues.push(paramsString.substring(0, i));
        getParamsValues(paramsString.substring(i + 1));
    }
}