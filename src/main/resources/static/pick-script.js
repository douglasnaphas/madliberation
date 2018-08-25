let code = getUrlParameter('code');
let returnedCode;
fetch('https://294csan61i.execute-api.us-east-1.amazonaws.com/Prod/print-auth-code?auth-code=' + code)
    .then(response => response.json())
    .then((data) => {returnedCode = data['auth-code'];})
    .then(() => {console.log('the server confirms my auth code is: ' + returnedCode);});