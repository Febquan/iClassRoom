const passport = require("passport");
const { signUp } = require("../controller/userAuthController");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
var GoogleStrategy = require("passport-google-oauth2").Strategy;
const bcrypt = require("bcrypt");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BACKEND_URL + "/user/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        let user = await prisma.user.findFirst({
          where: { email: profile.email },
        });
        if (!user) {
          const hashedPassword = await bcrypt.hash(profile.id, 10);
          user = await prisma.user.create({
            data: {
              userName: profile.displayName,
              email: profile.email,
              password: hashedPassword,
              avatar: profile.picture,
              isVerify: true,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});
