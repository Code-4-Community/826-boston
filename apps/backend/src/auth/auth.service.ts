import { Injectable } from '@nestjs/common';
import {
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AttributeType,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import CognitoAuthConfig from '../../../shared/aws-exports';

@Injectable()
export class AuthService {
  private readonly providerClient: CognitoIdentityProviderClient;

  constructor() {
    const cognitoRegion = CognitoAuthConfig.aws_cognito_region;

    this.providerClient = new CognitoIdentityProviderClient({
      region: cognitoRegion,
      // Work around endpoint rule resolution issues in the currently installed SDK tree.
      endpoint: `https://cognito-idp.${cognitoRegion}.amazonaws.com`,
      credentials: {
        accessKeyId: process.env.NX_AWS_ACCESS_KEY,
        secretAccessKey: process.env.NX_AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async getUser(userSub: string): Promise<AttributeType[]> {
    const listUsersCommand = new ListUsersCommand({
      UserPoolId: CognitoAuthConfig.aws_user_pools_id,
      Filter: `sub = "${userSub}"`,
    });

    // TODO need error handling
    const { Users } = await this.providerClient.send(listUsersCommand);
    return Users[0].Attributes;
  }

  async createManagedUser(
    email: string,
    firstName: string,
    lastName: string,
    role: string,
    title: string,
  ): Promise<void> {
    // user pool is configured with email aliases, so Username can't be an email value.
    const generatedUsername = `managed-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const adminCreateUserCommand = new AdminCreateUserCommand({
      UserPoolId: CognitoAuthConfig.aws_user_pools_id,
      Username: generatedUsername,
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'given_name', Value: firstName },
        { Name: 'family_name', Value: lastName },
        { Name: 'name', Value: `${firstName} ${lastName}`.trim() },
        { Name: 'custom:role', Value: role },
        { Name: 'custom:title', Value: title },
      ],
    });

    await this.providerClient.send(adminCreateUserCommand);
  }

  async deleteUser(email: string): Promise<void> {
    const adminDeleteUserCommand = new AdminDeleteUserCommand({
      Username: email,
      UserPoolId: CognitoAuthConfig.aws_user_pools_id,
    });

    await this.providerClient.send(adminDeleteUserCommand);
  }
}
