var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var poolData = {
    UserPoolId : 'us-east-1_Yn89yKizn',
    ClientId : '6ktt0mtpks03r8sfticc3h1o6'
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
console.log(poolData);
var cognitoUser = userPool.getCurrentUser();

console.log("cognitoUser: " + cognitoUser);

if (cognitoUser != null) {
    cognitoUser.getSession(function(err, session) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        console.log('session validity: ' + session.isValid());

        // NOTE: getSession must be called to authenticate user before calling getUserAttributes
        cognitoUser.getUserAttributes(function(err, attributes) {
            if (err) {
                // Handle error
                console.log('error on getUserAttributes: ' + err);
            } else {
                // Do something with attributes
                console.log('attributes: ' + attributes);
            }
        });

//        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//            IdentityPoolId : '...', // your identity pool id here
//            Logins : {
//                // Change the key below according to the specific region your user pool is in.
//                'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>' : session.getIdToken().getJwtToken()
//            }
//        });

        // Instantiate aws sdk service objects now that the credentials have been updated.
        // example: var s3 = new AWS.S3();

    });
}