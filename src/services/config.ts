const baseUrl = 'https://c82hrtfi53.execute-api.us-east-2.amazonaws.com/prod/'

export const config = {
  REGION: 'us-east-2',
  USER_POOL_ID: 'us-east-2_kxLPWXVP8',
  APP_CLIENT_ID: 'saugtiqjqrddi446a3trcqm5n',
  IDENTITY_POOL_ID: 'us-east-2:9e1084e0-f178-4adf-a7e0-9494946e30c6',
  api: {
    baseUrl: baseUrl,
    userUrl: `${baseUrl}user/`,
    foodsUrl: `${baseUrl}foods/`,
  },
}
