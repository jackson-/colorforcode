'use strict'

const db = require('APP/db')
const {User, Employer} = db

module.exports = require('express').Router()

  .get('/', (req, res, next) =>
    User.findAll({include: [Employer]})
    .then(users => res.json(users))
    .catch(next))
  .post('/', (req, res, next) =>
    User.create(req.body)
    .then(user => {
      if (user.is_employer) {
        return Employer.findOrCreate({
          where: {
            name: req.body.company_name,
            company_site: req.body.company_site
          }
        })
        .spread((employer, created) => user.setEmployer(employer.id))
      } else {
        res.status(201).json(user)
      }
    })
    .then(user => res.status(201).json(user))
    .catch(next))
  .get('/:id', (req, res, next) =>
    User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(next))

  // var bCrypt = require('bcrypt');
  // const passport = require('passport')
  // const {mustBeLoggedIn, forbidden} = require('./auth.filters')
  // var LocalStrategy = require('passport-local').Strategy;
  //
  // passport.use('local-signin', new LocalStrategy({
  //         // by default, local strategy uses username and password, we will override with email
  //         usernameField: 'email',
  //         passwordField: 'password',
  //         passReqToCallback: true // allows us to pass back the entire request to the callback
  //     },
  //     function(req, email, password, done) {
  //         var isValidPassword = function(userpass, password) {
  //             return bCrypt.compareSync(password, userpass);
  //         }
  //         User.findOne({
  //             where: {
  //                 email: email
  //             }
  //         }).then(function(user) {
  //             if (!user) {
  //                 return done(null, false, {
  //                     message: 'Email does not exist'
  //                 });
  //             }
  //             if (!isValidPassword(user.password, password)) {
  //                 return done(null, false, {
  //                     message: 'Incorrect password.'
  //                 });
  //             }
  //             var userinfo = user.get();
  //             return done(null, userinfo);
  //         }).catch(function(err) {
  //             console.log("Error:", err);
  //             return done(null, false, {
  //                 message: 'Something went wrong with your Signin'
  //             });
  //         });
  //     }
  // ));
  // passport.use('local-signup', new LocalStrategy({
  //     usernameField: 'email',
  //     passwordField: 'password',
  //     passReqToCallback: true // allows us to pass back the entire request to the callback
  //
  // },(req, email, password, done) => {
  //   var generateHash = function(password) {
  //     return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
  //   };
  //   User.findOne({
  //       where: {
  //           email: email
  //       }
  //   }).then(function(user) {
  //       if (user){
  //           return done(null, false, {
  //               message: 'That email is already taken'
  //           });
  //       } else {
  //           var userPassword = generateHash(password);
  //           var data = {
  //                   email: email,
  //                   password: userPassword,
  //                   firstname: req.body.firstname,
  //                   lastname: req.body.lastname};
  //           User.create(data).then(function(newUser, created) {
  //               if (!newUser) {
  //                   return done(null, false);
  //               }
  //               if (newUser) {
  //                   return done(null, newUser);
  //               }
  //           });
  //       }
  //     });
  //   }));
  //
  //   passport.use('local-signin-employer', new LocalStrategy({
  //           // by default, local strategy uses username and password, we will override with email
  //           usernameField: 'email',
  //           passwordField: 'password',
  //           passReqToCallback: true // allows us to pass back the entire request to the callback
  //       },
  //       function(req, email, password, done) {
  //           var isValidPassword = function(userpass, password) {
  //               return bCrypt.compareSync(password, userpass);
  //           }
  //           Employer.findOne({
  //               where: {
  //                   email: email
  //               }
  //           }).then(function(employer) {
  //               if (!employer) {
  //                   return done(null, false, {
  //                       message: 'Email does not exist'
  //                   });
  //               }
  //               if (!isValidPassword(employer.password, password)) {
  //                   return done(null, false, {
  //                       message: 'Incorrect password.'
  //                   });
  //               }
  //               var userinfo = employer.get();
  //               return done(null, userinfo);
  //           }).catch(function(err) {
  //               console.log("Error:", err);
  //               return done(null, false, {
  //                   message: 'Something went wrong with your Signin'
  //               });
  //           });
  //       }
  //   ));
  //   passport.use('local-signup-employer', new LocalStrategy({
  //       usernameField: 'email',
  //       passwordField: 'password',
  //       passReqToCallback: true // allows us to pass back the entire request to the callback
  //
  //   },(req, email, password, done) => {
  //     var generateHash = function(password) {
  //       return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
  //     };
  //     Employer.findOne({
  //         where: {
  //             email: email
  //         }
  //     }).then(function(employer) {
  //         if (employer){
  //             return done(null, false, {
  //                 message: 'That email is already taken'
  //             });
  //         } else {
  //             var userPassword = generateHash(password);
  //             var data = {
  //                     email: email,
  //                     password: userPassword,
  //                     firstname: req.body.firstname,
  //                     lastname: req.body.lastname};
  //             Employer.create(data).then(function(newUser, created) {
  //                 if (!newUser) {
  //                     return done(null, false);
  //                 }
  //                 if (newUser) {
  //                     return done(null, newUser);
  //                 }
  //             });
  //         }
  //       });
  //     }));
  //   passport.serializeUser(function(user, done) {
  //       done(null, user.id);
  //
  //   });
  //   passport.deserializeUser(function(id, done) {
  //     User.findById(id).then(function(user) {
  //       if (user) {
  //         done(null, user.get());
  //       } else {
  //         done(user.errors, null);
  //       }
  //     });
  //   });

  // .get('/', (req, res, next) => {
  //     User.findAll()
  //       .then(users => res.json(users))
  //       .catch(next)
  //     })
  //
  // .post('/', (req, res, next) => {
  //   passport.authenticate('local-signup', function(err, user, info) {
  //     if (err) { return next(err); }
  //     // Redirect if it fails
  //     if (!user) { return res.redirect('http://www.google.com'); }
  //     req.logIn(user, function(err) {
  //       if (err) { return next(err); }
  //       // Redirect if it succeeds
  //       return res.redirect('http://localhost:3000');
  //     });
  //   })(req, res, next);
  // })
  // .post('/login', function(req, res, next) {
  //   passport.authenticate('local-signin', function(err, user, info) {
  //     if (err) { return next(err); }
  //     if (!user) { return res.redirect('http://localhost:3000'); }
  //     res.json(user)
  //   })(req, res, next);
  // })
  // .get('/logout', function(req, res){
  //   req.logout();
  //   res.redirect('http://localhost:3000/');
  // })
  // .get('/:id', (req, res, next) =>
  //     User.findById(req.params.id)
  //     .then(user => res.json(user))
  //     .catch(next))
  //
  // /* SEPARATE EMPLOYER AUTH */
  //
  // .get('/employer',
  //   // The forbidden middleware will fail *all* requests to list users.
  //   // Remove it if you want to allow anyone to list all users on the site.
  //   //
  //   // If you want to only let admins list all the users, then you'll
  //   // have to add a role column to the users table to support
  //   // the concept of admin users.
  //   forbidden('listing employers is not allowed'),
  //   (req, res, next) =>
  //     Employer.findAll()
  //       .then(users => res.json(users))
  //       .catch(next))
  //   .post('/employer', (req, res, next) => {
  //     passport.authenticate('local-signup-employer', function(err, employer, info) {
  //       if (err) { return next(err); }
  //       // Redirect if it fails
  //       if (!employer) { return res.redirect('http://www.google.com'); }
  //       req.logIn(employer, function(err) {
  //         if (err) { return next(err); }
  //         // Redirect if it succeeds
  //         return res.redirect('http://localhost:3000/employer-dashboard');
  //       });
  //     })(req, res, next);
  //   })
  //   .post('/employer/login', function(req, res, next) {
  //     passport.authenticate('local-signin-employer', function(err, employer, info) {
  //       if (err) { return next(err); }
  //       if (!employer) { return res.redirect('http://localhost:3000/employer-dashboard'); }
  //       res.json(employer)
  //     })(req, res, next);
  //   })
  //   .get('/employer/:id',
  //     mustBeLoggedIn,
  //     (req, res, next) =>
  //       Employer.findById(req.params.id)
  //       .then(user => res.json(user))
  //       .catch(next))
