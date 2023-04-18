// const express = require('express');
// const multer = require('multer');

// //../ means we go up one level and then go to models folder
// // const Post = require('../models/post');

// const router = express.Router();
// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         const isValid = MIME_TYPE_MAP[file.mimetype]; //undefined/null if type doesn't match keys
//         let error = new Error('Invalid mime type');
//         if (isValid) {
//             error = null;
//         }
//         //arg1 is error, arg2 is the folder path relative to server.js file
//         callback(error, 'backend/images');
//     },
//     filename: (req, file, callback) => {
//         const name = file.originalname.toLowerCase().split(' ').join('-');
//         const ext = MIME_TYPE_MAP[file.mimetype];
//         callback(null, name + '-' + Date.now() + '.' + ext);
//     }
// });
// const MIME_TYPE_MAP = { 
//     'image/png': 'png',
//     'image/jpeg': 'jpg',
//     'image/jpg': 'jpg'
// };

// //multer will now try to extract single file from incoming request and get details with "image" property
// router.post('', multer({storage: storage}).single("image"), (req, res, next) => {
//     const url = req.protocol + "://" + req.get("host"); //construct a full url to our server
//     const post = new Post({
//         title: req.body.title,
//         content: req.body.content,
//         imagePath: url + "/images/" + req.file.filename
//     });
//     post.save().then(createdPost => {
//         console.log(post);
//         res.status(201).json({
//             message: 'Post added successfully',
//             post: {
//                 ...createdPost, //makes a copy
//                 id: createdPost._id //overloads the id property
//             }
//         });
//     });
// });

// router.get('', (req, res, next) => {
//     //all results that are returned from the database are stored in the variable
//     Post.find()
//         .then(documents => {
//             //waits for it to finish
//             console.log(documents);
//             res.status(200).json({
//                 message: 'Posts fetched successfully!',
//                 posts: documents
//             });
//         }).catch(error => {
//             console.log(error)
//         });
// });

// // :postId is the dynamci path variable
// router.delete('/:postId', (req, res, next) => {
//     console.log(req.params.postId);
//     Post.deleteOne({ _id: req.params.postId }).then(result => {
//         console.log(result);
//         res.status(200).json({ message: 'Post deleted!' });
//     });
// });

// /**
//  * Edit post
//  */
// router.put(
//     '/:postId', 
//     multer({ storage: storage }).single('image'), 
//     (req, res, next) => {

//         let imagePath = req.body.imagePath;
//         if (req.file) {
//             const url = req.protocol + '://' + req.get('host');
//             req.body.imagePath = url + '/images/' + req.file.filename;
//         } else {
//             req.body.imagePath = req.body.imagePath;
//         }

//         const post = new Post({
//             _id: req.body.postId,
//             title: req.body.title,
//             content: req.body.content,
//             imagePath: imagePath
//         });
//         //notice the _id that is unique to Mongoose created Schema
//         Post.updateOne({ _id: req.params.postId }, post)
//             .then(result => {
//                 console.log(result);
//                 res.status(200).json({ message: 'Update successful!' });
//             });
// });

// /**
//  * We are getting one single post so we can fetch one on edit page initially
//  */
// router.get('/:postId', (req, res, next) => {
//     Post.findById(req.params.postId).then(post => {
//         if (post) {
//             res.status(200).json(post);
//         } else {
//             res.status(404).json({ message: 'Post not found!' });
//         }
//     });
// });

// module.exports = router;