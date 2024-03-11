const express = require('express')
const router = express.Router()
const bookCtrl = require('../controllers/books')
const auth = require('../middleware/auth')

router.get('/', auth, bookCtrl.getAllBooks)
router.get('//:id', auth, bookCtrl.getOneBook)
// router.get('/bestrating', auth, bookCtrl.bestRatingBooks)

router.post('/', auth, bookCtrl.createBook)

router.put('/:id', auth, bookCtrl.modifyBook)

router.delete('/:id', auth, bookCtrl.deleteBook)

// router.post('/:id/rating', auth, bookCtrl.postOneRating)

module.exports = router
