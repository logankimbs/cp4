const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({  extended: false  }));
app.use(bodyParser.json());

const multer = require('multer');
const upload = multer({
    dest: '../front-end/public/images/',
    limits: {
        fileSize: 10000000
    }
});
app.post('/api/photos', upload.single('photo'), async (req, res) => {
    if (!req.file) {  return res.sendStatus(400);  }
    res.send({  path: "/images/" + req.file.filename  })
});

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cp4', {  useNewUrlParser: true, useUnifiedTopology: true  });
const authorSchema = new mongoose.Schema({  name: String  });
const Author = mongoose.model('Author', authorSchema);
const articleSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'Author'
    },
    title: String,
    path: String,
    content: String,
    tag: String,
    timestamp: String
});
const Article = mongoose.model('Article', articleSchema);

// create author
app.post('/api/authors', async (req, res) => {
    let author = new Author({  name: req.body.name  });
    try {
        await author.save();
        res.send(author);
    } catch (error) {
        res.sendStatus(500);
    }
});

// create article
app.post('/api/authors/:authorID/articles', async (req, res) => {
    try {
        let author = await Author.findOne({  _id: req.params.authorID  });
        let article = new Article({
            author: author,
            title: req.body.title,
            path: req.body.path,
            content: req.body.content,
            tag: req.body.tag,
            timestamp: req.body.timestamp
        });
        await article.save();
        res.send(article);
    } catch (error) {
        res.sendStatus(500);
    }
});

// read all authors
app.get('/api/authors', async (req, res) => {
    try {
        let authors = await Author.find();
        res.send(authors);
    } catch (error) {
        res.sendStatus(500);
    }
});

// read all articles
app.get('/api/authors/:authorID/articles', async (req, res) => {
    try {
        let author = await Author.findOne({  _id: req.params.authorID  });
        if (!author) {
            res.send(404);
            return;
        }
        let articles = await Article.find({  author: author  }).populate('author');
        res.send(articles);
    } catch (error) {  res.sendStatus(500);  }
});

// edit article
app.put('/api/authors/:authorID/articles/:articleID', async (req, res) => {
    try {
        let article = await Article.findOne({  _id:req.params.articleID, author: req.params.authorID  });
        article.title = req.body.title;
        article.tag = req.body.tag;
        article.content = req.body.content;
        article.save();
        res.send(article);
    } catch (error) {  res.sendStatus(500);  }
});

// delete article
app.delete('/api/authors/:authorID/articles/:articleID', async (req, res) => {
    try {
        let article = await Article.findOne({  _id:req.params.articleID, author: req.params.authorID  });
        await article.delete();
        res.sendStatus(200);
    } catch (error) {  res.sendStatus(500);  }
});

app.listen(3000, () => {  console.log('CP4 listening at http://localhost:3000')  });