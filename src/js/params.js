export let paramValues = [];

export function getParamsValues(paramsString){
    var i = 0;
    if(paramsString.length == 0){
        return;
    }
    else if(paramsString.charAt(i) === ' '){
        getParamsValues(paramsString.substring(1));
    }
    else if(paramsString.length > 0 && paramsString.charAt(i) === '['){
        while(i < paramsString.length && paramsString.charAt(i) !== ']'){
            i++;
        }
        paramValues.push(paramsString.substring(0, i+1));
        getParamsValues(paramsString.substring(i+1));
    }
    else{
        while(i < paramsString.length && paramsString.charAt(i) !== ','){
            i++;
        }
        paramValues.push(paramsString.substring(0, i));
        getParamsValues(paramsString.substring(i+1));
    }
}