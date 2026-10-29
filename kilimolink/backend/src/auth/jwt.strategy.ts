import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { resolveJwtSecret } from '../common/jwt.secret';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: resolveJwtSecret()
    });
  }

  validate(payload: { sub: string; role?: string }) {
    return { userId: payload.sub, role: payload.role || 'user' };
  }
}

