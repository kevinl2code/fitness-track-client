import { CognitoGender, User, UserAttribute } from '../model/Model'
import { Auth } from 'aws-amplify'
import Amplify from 'aws-amplify'
import { config } from './config'
import { CognitoUser } from '@aws-amplify/auth'
import * as AWS from 'aws-sdk'
import { Credentials } from 'aws-sdk/lib/credentials'

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: config.REGION,
    userPoolId: config.USER_POOL_ID,
    userPoolWebClientId: config.APP_CLIENT_ID,
    identityPoolId: config.IDENTITY_POOL_ID,
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  },
})

export type AmplifyUserInfo = {
  id: string
  username: string
  attributes: {
    birthdate: string
    'custom:height': string
    email: string
    email_verified: boolean
    family_name: string
    gender: CognitoGender
    given_name: string
    sub: string
  }
}

export class AuthService {
  public async confirmSignUp(
    username: string,
    code: string
  ): Promise<any | undefined> {
    try {
      const result = await Auth.confirmSignUp(username, code)
      return result
    } catch (error) {
      console.error(error)
      return undefined
    }
  }

  public async signUp(
    username: string,
    password: string,
    givenName: string,
    familyName: string,
    birthdate: string,
    gender: CognitoGender,
    height: string,
    email: string
  ): Promise<CognitoUser | undefined> {
    try {
      const result = await Auth.signUp({
        username,
        password,
        attributes: {
          given_name: givenName,
          family_name: familyName,
          birthdate,
          gender,
          email,
          'custom:height': height,
        },
      })
      return result.user
    } catch (error) {
      console.error(error)
      return undefined
    }
  }

  public async login(
    userName: string,
    password: string
  ): Promise<User | undefined> {
    try {
      const user = (await Auth.signIn(userName, password)) as CognitoUser
      return {
        cognitoUser: user,
        userName: user.getUsername(),
        isAdmin: false,
      }
    } catch (error) {
      return undefined
    }
  }

  public async logOut() {
    return await Auth.signOut()
  }

  public async getAWSTemporaryCreds(user: CognitoUser) {
    const cognitoIdentityPool = `cognito-idp.${config.REGION}.amazonaws.com/${config.USER_POOL_ID}`
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(
      {
        IdentityPoolId: config.IDENTITY_POOL_ID,
        Logins: {
          [cognitoIdentityPool]: user
            .getSignInUserSession()!
            .getIdToken()
            .getJwtToken(),
        },
      },
      {
        region: config.REGION,
      }
    )
    await this.refreshCredentials()
  }

  private async refreshCredentials(): Promise<void> {
    return new Promise((resolve, reject) => {
      ;(AWS.config.credentials as Credentials).refresh((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  //Good for getting the currently logged in user --formatted a little nicer
  public async currentUserInfo(): Promise<AmplifyUserInfo> {
    const result = await Auth.currentUserInfo()
    return result
  }

  public async getUserAttributes(user: CognitoUser): Promise<UserAttribute[]> {
    const result: UserAttribute[] = []
    const attributes = await Auth.userAttributes(user)
    result.push(...attributes)
    return result
  }

  public async updateProfilePicture(user: User, pictureUrl: string) {
    await this.updateUserAttribute(user, {
      picture: pictureUrl,
    })
  }

  private async updateUserAttribute(
    user: User,
    attribute: {
      [key: string]: string
    }
  ) {
    await Auth.updateUserAttributes(user.cognitoUser, attribute)
  }

  public isUserAdmin(user: User): boolean {
    const session = user.cognitoUser.getSignInUserSession()
    if (session) {
      const idTokenPayload = session.getIdToken().decodePayload()
      const cognitoGroups = idTokenPayload['cognito:groups']
      if (cognitoGroups) {
        return (cognitoGroups as string).includes('admins')
      } else {
        return false
      }
    } else {
      return false
    }
  }
}

//TODO - More of a reminder but if a logged in user is deleted from the UserPool in the Cognito console,
// they can still access the service through their current session until their JWT expires.
// Could look into adding an additional authentication check somewhere to prevent this.
