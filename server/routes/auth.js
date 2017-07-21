const app = require('APP')
const {env} = app
const debug = require('debug')(`${app.name}:auth`)
const passport = require('passport')
const bCrypt = require('bcrypt')
const bc = require('bcryptjs')
const {User, OAuth, Employer, Job, Project, Skill} = require('APP/db')
const auth = require('express').Router()
const LocalStrategy = require('passport-local').Strategy;

/*************************
 * Auth strategies
 *
 * The OAuth model knows how to configure Passport middleware.
 * To enable an auth strategy, ensure that the appropriate
 * environment variables are set.
 *
 * You can do it on the command line:
 *
 *   FACEBOOK_CLIENT_ID=abcd FACEBOOK_CLIENT_SECRET=1234 npm run dev
 *
 * Or, better, you can create a ~/.$your_app_name.env.json file in
 * your home directory, and set them in there:
 *
 * {
 *   FACEBOOK_CLIENT_ID: 'abcd',
 *   FACEBOOK_CLIENT_SECRET: '1234',
 * }
 *
 * Concentrating your secrets this way will make it less likely that you
 * accidentally push them to Github, for example.
 *
 * When you deploy to production, you'll need to set up these environment
 * variables with your hosting provider.
 **/

// LinkedIn needs the LINKEDIN_API_ID and LINKEDIN_SECRET_KEY
// environment variables.
// OAuth.setupStrategy({
//   provider: 'linkedin',
//   strategy: require('passport-linkedin').Strategy,
//   config: {
//     clientID: env.LINKEDIN_API_ID,
//     clientSecret: env.LINKEDIN_SECRET_KEY,
//     callbackURL: `https://127.0.0.1:1137/api/auth/login/linkedin`,
//   },
//   passport
// })

// Other passport configuration:
// Passport review in the Week 6 Concept Review:
// https://docs.google.com/document/d/1MHS7DzzXKZvR6MkL8VWdCxohFJHGgdms71XNLIET52Q/edit?usp=sharing
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(
  (id, done) => {
    debug('will deserialize user.id=%d', id)
    User.findById(id, {
      include: [
        {model: Employer},
        {model: Project, include: [Skill]},
        {model: Job, as: 'applications', through: "JobApplication"},
      ],
    })
      .then(user => {
        if (!user) debug('deserialize retrieved null user for id=%d', id)
        else debug('deserialize did ok user.id=%d', id)
        done(null, user)
      })
      .catch(err => {
        debug('deserialize did fail err=%s', err)
        done(err)
      })
  }
)

// require.('passport-local').Strategy => a function we can use as a constructor, that takes in a callback
passport.use('local-signup', new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
  },
  (req, email, password, done) => {
    const generateHash = (password) => {return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null)};
    User.findOne({
          where: {
              email: email
          }
      }).then(function(user) {
          if (user){return done(null, false, {
            message: 'That email is already taken'})}
          else{
            var userPassword = generateHash(password);
            var data = {
                    email: email,
                    password: userPassword,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname
                };
            User.create(data).then(function(newUser, created) {
                if (!newUser) {return done(null, false);}
                if (newUser) {return done(null, newUser);}
            });
          }
      });
    }
));

passport.use('local-signin', new LocalStrategy({
    usernameField:'email',
    passwordField:'password',
  },
  (email, password, done) => {
    debug('will authenticate user(email: "%s")', email)
    User.findOne({
      where: {email},
      include: [
        {model: Employer},
        {model: Job, as: 'applications', through: {attributes: []}}
      ],
      attributes: {include: ['password_digest']}
    }).then(user => {
        if (!user) {
          debug('authenticate user(email: "%s") did fail: no such user', email)
          return done(null, false, { message: 'Login incorrect' })
        }
        bc.compare('123', user.password_digest).then((ok) => {
          console.log("OK", ok)
        })
        user.authenticate(password)
          .then(ok => {
            if (!ok) {
              debug('authenticate user(email: "%s") did fail: bad password')
              return done(null, false, { message: 'Login incorrect' })
            }
            debug('authenticate user(email: "%s") did ok: user.id=%d', email, user.id)
            done(null, user)
          })
      })
      .catch(done)
  }
))

auth.get('/whoami', (req, res) => res.send(req.user))

// POST requests for local login:
auth.post('/login/local', passport.authenticate('local-signin', {
  successRedirect:'/'
}));

// GET requests for OAuth login:
// Register this route as a callback URL with OAuth provider
auth.get('/login/:strategy', (req, res, next) =>
  passport.authenticate(req.params.strategy, {
    scope: 'email', // You may want to ask for additional OAuth scopes. These are
                    // provider specific, and let you access additional data (like
                    // their friends or email), or perform actions on their behalf.
    successRedirect: '/',
    // Specify other config here
  })(req, res, next)
)

auth.post('/logout', (req, res) => {
  req.logout()
  // destroy the session
  req.session = null
  res.redirect('/api/auth/whoami')
})

module.exports = auth
