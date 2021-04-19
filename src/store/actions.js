/********************************************
 * passes data from interactions.js to the switch statements in reducers.js
 * 'type' refers to the case, and the value (if there is one) is passed to the action argument of the reducer function
 */

//WEB3
export function web3Loaded(connection){
	return {
		type: 'WEB3_LOADED',
		connection //== connection: connection
	}
}

export function web3AccountLoaded(account){
	return {
		type: 'WEB3_ACCOUNT_LOADED',
		account
	}
}

export function cryptogramLoaded(contract){ 
    return {
        type: 'CRYPTOGRAM_LOADED', 
        contract
    }
}
export function imageLoaded(image){
	return {
		type: 'IMAGE_LOADED',
		image
	}
}
export function allImagesLoaded(images){
	return {
		type: 'ALL_IMAGES_LOADED',
		images
	}
}
export function allUsersLoaded(users){
	return{
		type: 'ALL_USERS_LOADED',
		users
	}
}