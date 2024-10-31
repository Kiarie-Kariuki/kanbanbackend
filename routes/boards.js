const express = require('express');
const Board = require('../models/Board');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth'); 

const router = express.Router();

// Create a new board
router.post('/', authMiddleware, async (req, res) => {
    const { title } = req.body;

    try {
        const newBoard = new Board({ title, owner: req.user.id });
        await newBoard.save();

        await User.findByIdAndUpdate(req.user.id, { $push: { boards: newBoard._id } });
        res.status(201).json(newBoard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's boards
router.get('/', authMiddleware, async (req, res) => {
    try {
        const boards = await Board.find({ owner: req.user.id });
        res.status(200).json(boards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a board
router.put('/:id', authMiddleware, async (req, res) => {
    const { title } = req.body;

    try {
        const board = await Board.findById(req.params.id);

        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }

        // Check if the user is the owner of the board
        if (board.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Update the board
        board.title = title || board.title; // Update only if new title is provided
        await board.save();

        res.status(200).json(board);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Delete a board
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const board = await Board.findByIdAndDelete(req.params.id);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
