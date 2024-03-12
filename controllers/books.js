const Book = require('../models/Book')
const fs = require('fs')

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }))
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ error }))
}

exports.bestRatingBooks = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then((bestBooks) => res.status(200).json(bestBooks))
        .catch((error) => res.status(400).json({ error }))
}

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book)
    delete bookObject._id
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    })
    book.save()
        .then(() => {
            res.status(201).json({ message: 'Livre enregistré' })
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

exports.postOneRating = (req, res, next) => {
    const bookId = req.params.id
    const { userId, rating } = req.body
    const updatedRating = {
        userId: req.auth.userId,
        grade: req.body.rating,
    }
    if (updatedRating.grade < 0 || updatedRating.grade > 5) {
        return res
            .status(400)
            .json({ message: 'La note doit être comprise entre 0 et 5' })
    }
    Book.findById(bookId).then((book) => {
        Book.findOne({ _id: bookId, 'ratings.userId': userId }).then(
            (alreadyRated) => {
                if (alreadyRated) {
                    throw new Error('ALREADY_RATED')
                }
                const grades = book.ratings.map((rating) => rating.grade)
                const sumRatings = grades.reduce(
                    (total, grade) => total + grade,
                    0
                )
                const newTotalRating = sumRatings + rating
                const newAverageRating = Number(
                    (newTotalRating / (book.ratings.length + 1)).toFixed(2)
                )
                book.ratings.push({ userId, grade: rating })
                book.averageRating = newAverageRating
                return book.save().then((updatedBook) => {
                    res.status(201).json({
                        ...updatedBook._doc,
                        id: updatedBook._doc._id,
                    })
                })
            }
        )
    })
}

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
          }
        : { ...req.body }

    delete bookObject._userId
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' })
            } else {
                Book.updateOne(
                    { _id: req.params.id },
                    { ...bookObject, _id: req.params.id }
                )
                    .then(() =>
                        res.status(200).json({ message: 'Objet modifié!' })
                    )
                    .catch((error) => res.status(401).json({ error }))
            }
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' })
            } else {
                const filename = book.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: 'Objet supprimé !',
                            })
                        })
                        .catch((error) => res.status(401).json({ error }))
                })
            }
        })
        .catch((error) => {
            res.status(500).json({ error })
        })
}
