const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const idLength = 8;

/**
 * @swagger
 * components:
 *  schemas:
 *    Book:
 *      type: object
 *      required:
 *        - title
 *        - author
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the book
 *        title:
 *          type: string
 *          description: The book title
 *        author:
 *          type: string
 *          description: The book author
 *      example:
 *        id: d5Fe_asz
 *        title: The New Turing Omnibus
 *        author: Alexander K. Dewdney
 */
/**
 * @swagger
 * tags:
 *  - name: Books
 *    description: Managing Books API
 */

/**
 * @swagger
 * /books:
 *   get:
 *    tags: [Books]
 *    summary: Return the list of all the books
 *    responses:
 *      200:
 *        description: The list of the books
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Book'
 */

router.get('/', (req, res) => {
  const books = req.app.db.get('books');

  res.send(books);
});

/**
 * @swagger
 * 
 * /books/{id}:
 *  get:
 *    summary: Get the Book by ID
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Book ID
 *    responses:
 *      200:
 *        description: The book description by ID
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book don't was found
 */
router.get('/:id', (req, res) => {
  const book = req.app.db.get('books').find({ id: req.params.id }).value();

  if (!book) {
    return res.sendStatus(404);
  }

  res.send(book);
});


/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */
router.post('/', (req, res) => {
  try {
    const book = {
      id: nanoid(idLength),
      ...req.body
    };

    req.app.db.get('books').push(book).write();
    res.send(book);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 * /books/{id}:
 *  put:
 *    summary: Update the book by the id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Book ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: Updated Book
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The books was not found
 *      500:
 *        description: Some server error
 */
router.put('/:id', (req, res) => {
  try {
    req.app.db.get('books').find({ id: req.params.id }).assign(req.body).write();
    res.send(req.app.db.get('books').find({ id: req.params.id }));
  } catch (error) {
    return req.status(500).send(error);
  }
});

/**
 * @swagger
 * /books/{id}:
 *  delete:
 *    summary: Delete book
 *    description: Endpoint for remove book by ID
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Books ID
 *    responses:
 *      200:
 *        description: Delete books by ID
 *            
 */
router.delete('/:id', (req, res) => {
  req.app.db.get('books').remove({ id: req.params.id }).write();

  res.sendStatus(200);
});

module.exports = router;