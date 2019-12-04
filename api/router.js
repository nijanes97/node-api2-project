const express = require('express');

const db = require('../data/db.js');

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    db
        .find()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

router.get('/:id', (req, res) => {
    db
        .findById(req.params.id)
        .then(post => {
            if(post.length > 0) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

router.get('/:id/comments', (req, res) => {
    db
        .findPostComments(req.params.id)
        .then(comments => {
            if(comments.length > 0) {
                res.status(200).json(comments);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})

router.post('/', (req, res) => {
    if(!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        db
            .insert(req.body)
            .then(newPost => {
                db.findById(newPost.id).then(post => res.status(201).json(post))
            })
            .catch(err => {
                res.status(500).json({ error: "There was an error while saving the post to the database" })
            })
    }
})

router.post('/:id/comments', (req, res) => {
    console.log(req.params)
    if(!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        db
            .findById(req.params.id)
            .then(post => {
                if(post.length > 0) {
                    db
                        .insertComment(req.body)
                        .then(newComment => {
                            db
                                .findCommentById(newComment.id)
                                .then(comment => {
                                    res.status(201).json(comment);
                                })
                        })
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(err => {
                res.status(500).json({ error: "There was an error while saving the comment to the database2" })
            })
    }
})

router.delete('/:id', (req, res) => {
    db
        .findById(req.params.id)
        .then(post => {
            if(post.length > 0){
                db
                    .remove(req.params.id)
                    .then(num => {
                        res.status(200).json(post);
                    })
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The post could not be removed" })
        })
})

router.put('/:id', (req, res) => {
    if(!req.body.title || !req.body.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        db
            .findById(req.params.id)
            .then(post => {
                if(post.length > 0){
                    db
                        .update(req.params.id, req.body)
                        .then(updatedPostId => {
                            db
                                .findById(req.params.id)
                                .then(updatedPost => {
                                    res.status(201).json(updatedPost);
                                })
                        })
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(err => {
                res.status(500).json({ error: "There was an error while saving the comment to the database" })
            })
    }
})

module.exports = router;