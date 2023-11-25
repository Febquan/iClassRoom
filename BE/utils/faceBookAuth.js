const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
var FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcrypt");

console.log(process.env.BACKEND_URL + "/user/auth/facebook/callback");
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.BACKEND_URL + "/user/auth/facebook/callback",
      profileFields: [
        "id",
        "displayName",
        "name",
        "gender",
        "email",
        "picture.type(large)",
      ],
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        let user;
        if (profile.id) {
          user = await prisma.user.findFirst({
            where: { email: profile.id },
          });
        }

        if (!user) {
          const hashedPassword = await bcrypt.hash(profile.id, 10);
          user = await prisma.user.create({
            data: {
              userName: profile.displayName,
              email: profile.id,
              password: hashedPassword,
              avatar: profile.photos[0].value,
              isVerify: true,
            },
          });
        }
        console.log(profile);
        return cb(null, user);
      } catch (error) {
        return cb(error);
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
