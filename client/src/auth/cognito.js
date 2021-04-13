import { Auth } from 'aws-amplify';

export const getIDToken = async () => {
    const session = await Auth.currentSession();
    return session.getIdToken().getJwtToken();
}

export const getUserGroup = async () => {
    const user = await Auth.currentAuthenticatedUser();
    return user.signInUserSession.accessToken.payload["cognito:groups"]
}
