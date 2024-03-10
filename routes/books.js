const express = require('express')
const router = express.Router()
const bookCtrl = require('../controllers/books')

router.get('/', bookCtrl.getAllBooks)
router.get('//:id', bookCtrl.getOneBook)
// router.get('/bestrating', bookCtrl.bestRatingBooks)

router.post('/book', bookCtrl.createBook)

router.put('/:id', bookCtrl.modifyBook)

router.delete('/:id', bookCtrl.deleteBook)

// router.post('/:id/rating', bookCtrl.postOneRating)

module.exports = router
