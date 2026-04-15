import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

import CognitoAuthConfig from '../../../shared/aws-exports';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const cognitoAuthority = `https://cognito-idp.${CognitoAuthConfig.aws_cognito_region}.amazonaws.com/${CognitoAuthConfig.aws_user_pools_id}`;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      audience: CognitoAuthConfig.aws_user_pools_web_client_id,
      issuer: cognitoAuthority,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: cognitoAuthority + '/.well-known/jwks.json',
      }),
    });
  }

  async validate(payload) {
    return {
      idUser: payload.sub,
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      role: payload['custom:role'],
      title: payload['custom:title'],
    };
  }
}
