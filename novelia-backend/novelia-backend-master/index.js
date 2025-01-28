// jshint esversion:6

import express from "express";
import _ from "lodash";
import cors from "cors";
import mongoose from "mongoose";
import moment from "moment";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

const data = "Working Properly!";
// Express Initiation
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

// Passport session initiation
app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Mongoose initiation
mongoose.connect("mongodb://localhost/noveliaDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));

// Mongoose Schema
const Schema = mongoose.Schema;

const UserConSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, required: true, unique: true },
});

UserConSchema.plugin(passportLocalMongoose);

const UserSchema = new Schema({
  UserID: Number,
  FirstName: String,
  LastName: String,
  DateOfBirth: Date,
  DateOfJoining: Date,
});

const BookFeedbackSchema = new Schema({
  BookID: String,
  Rating: Number,
  Comments: [{ Commenter: String, Comment: String }],
  Moderator: Number,
});

const LanguageSchema = new Schema({
  LanguageID: Number,
  Name: String,
  Mode: Number,
});

const AdminSchema = new Schema({
  AdminID: Number,
  FullName: String,
  Role: Number,
  DateOfBirth: Date,
});

const GenreSchema = new Schema({
  GenreID: Number,
  Name: String,
  Popularity: Number,
});

const BookInfoSchema = new Schema({
  Name: String,
  Author: String,
  // Cover: { data: Buffer, contentType: String },
  DateOfCreation: Date,
  NoOfChapter: Number,
  WrittenLang: Number,
  Genre: Number,
  Popularity: Number,
  LastUpdated: Date,
});

const BookSchema = new Schema({
  BookID: String,
  InBook: [{ Chapter: String, Content: String }],
});

// Mongoose models
const UserCon = mongoose.model("UserCon", UserConSchema);
const User = mongoose.model("User", UserSchema);
const BookFeedback = mongoose.model("BookFeedback", BookFeedbackSchema);
const Language = mongoose.model("Language", LanguageSchema);
const Admin = mongoose.model("Admin", AdminSchema);
const Genre = mongoose.model("Genre", GenreSchema);
const BookInfo = mongoose.model("BookInfo", BookInfoSchema);
const Book = mongoose.model("Book", BookSchema);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(UserCon.createStrategy());

app.get("/", (_, res) => {
  res.send(data);
});

app.get("/data/:name", (req, res) => {
  BookInfo.findOne({ Name: req.params.name }, (err, book) => {
    if (err) console.log(err);
    else res.send(book);
  });
});

app.get("/content/:name", (req, res) => {
  BookInfo.findOne({ Name: req.params.name }, (err, book) => {
    if (err) {
      console.log(err);
    } else {
      if (book) {
        Book.findOne({ BookID: book._id }, (err, content) => {
          if (err) console.log(err);
          else {
            // console.log(content);
            res.send(content);
          }
        });
      } else {
        res.send("No book found");
      }
    }
  });
});

app.get("/user", (req, res) => {
  User.findOne({ UserID: req.body.userid }, (err, userdetails) => {
    if (err) console.log(err);
    else res.send(userdetails);
  });
});

app.post("/createBook", (req, res) => {
  BookInfo.exists(
    { Name: req.body.name, Author: req.body.author },
    (err, result) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          message: "Book Creation Failed: ",
          err,
        });
      } else {
        console.log(result);
        if (!result) {
          let newBook = new BookInfo({
            Name: req.body.name,
            Author: req.body.author,
            DateOfCreation: moment(req.body.date, "YYYYMMDD"),
            NoOfChapter: 0,
          });
        
          let newBookContent = new Book({
            BookID: newBook._id,
            InBook: [],
          });
          newBook.save((err) => err && console.log(err));
          newBookContent.save((err) => err && console.log(err));
          res.json({
            success: result,
            message: "New Book Created",
          });
        } else {
          res.json({
            success: result,
            message: "Book Creation Failed: Book Already Exists",
          });
        }
      }
    }
  );
  
});

app.post("/register", (req, res) => {
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;

  console.log(email, username, password);

  UserCon.register(
    { email: email, username: username },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          message: "Your account could not be saved. Error: ",
          err,
        });
      } else {
        console.log(user);
        passport.authenticate("local")(req, res, () => {
          res.json({ success: true, message: "Your account has been saved" });
          let newUser = new User({
            UserID: user._id,
          });
          newUser.save((err) => err && console.log(err));
        });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const user = new UserCon({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Your account could not be logged in. Error: ",
        err,
      });
    } else {
      passport.authenticate("local")(req, res, function () {
        res.json({ success: true, message: "You are logged in!" });
      });
    }
  });
});

app.post("/addChapter", (req, res) => {
  // console.log(req.body);
  BookInfo.findOne({ Name: req.body.name, Author: req.body.author }, (err, book) => {
    if (err) {
      console.log(err);
    } else {
      if (book) {
        Book.findOne({ BookID: book._id }, (err, content) => {
          if (err) console.log(err);
          else {
            if (req.body.chapterName && req.body.chapterContent) {
              content.InBook.push({
                Chapter: req.body.chapterName,
                Content: req.body.chapterContent,
              });
              console.log({
                Chapter: req.body.chapterName,
                Content: req.body.chapterContent,
              });
              // console.log(content.InBook);
              content.save((err) => {
                if (err) console.log(err);
              });
              res.send("success");
            }
          }
        });
      } else {
        res.send("No book found");
      }
    }
  });
});

app.get("/allbooks", (req, res) => {
  BookInfo.find({}, (err, allBooks) => {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "There was some error. Error: ",
        err,
      });
    } else {
      res.json({
        success: true,
        message: "Successfull",
        allBooks: allBooks
      });
    }
  });
});

app.listen(9000, () => {
  console.log("Server started on port 9000");
});
