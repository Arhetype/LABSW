import passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  VerifiedCallback,
} from 'passport-jwt';
import { User } from '@models/User';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  id: number;
}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
  new JwtStrategy(
    options,
    async (payload: JwtPayload, done: VerifiedCallback) => {
      try {
        const user = await User.findByPk(payload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

export default passport;
