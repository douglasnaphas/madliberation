var authData = {
	ClientId : '6ktt0mtpks03r8sfticc3h1o6',
	AppWebDomain : 'madliberationfederated.auth.us-east-1.amazoncognito.com',
	TokenScopesArray : ['email'],
	RedirectUriSignIn : 'https://madliberationgame.com/pick-script.html',
	RedirectUriSignOut : 'https://madliberationgame.com/logout.html',
//	IdentityProvider : '<TODO: add identity provider you want to specify>', // e.g. 'Facebook',
	UserPoolId : 'us-east-1_Yn89yKizn'//,
//	AdvancedSecurityDataCollectionFlag : '<TODO: boolean value indicating whether you want to enable advanced security data collection>', // e.g. true
//        Storage: '<TODO the storage object>' // OPTIONAL e.g. new CookieStorage(), to use the specified storage provided
};
var auth = new AmazonCognitoIdentity.CognitoAuth(authData);
var curUrl = window.location.href;
var parsedResponse = auth.parseCognitoWebResponse(curUrl);
console.log(parsedResponse);