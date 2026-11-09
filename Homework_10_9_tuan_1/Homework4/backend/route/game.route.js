import { getBoard, makeMove, skipTurn, newGame } from "../service/game.service.js";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Game
 *     description: Single-machine Caro game endpoints
 */

/**
 * @swagger
 * /board:
 *   get:
 *     summary: Get current board state
 *     tags: [Game]
 *     responses:
 *       200:
 *         description: Board state retrieved successfully
 */
router.get("/board", (req, res) => {
    res.json(getBoard());
});

/**
 * @swagger
 * /move:
 *   post:
 *     summary: Make a move on the board
 *     tags: [Game]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - index
 *             properties:
 *               index:
 *                 type: integer
 *                 example: 12
 *                 description: Cell index from 0 to 24
 *     responses:
 *       200:
 *         description: Move played successfully
 *       400:
 *         description: Invalid cell or cell already occupied
 */
router.post("/move", (req, res) => {
    const { index } = req.body;

    const result = makeMove(index);

    if (result.error) {
        return res.status(400).json({
            message: result.error,
        });
    }

    res.json(result);
});

/**
 * @swagger
 * /skip-turn:
 *   post:
 *     summary: Skip current player turn (Timeout)
 *     tags: [Game]
 *     responses:
 *       200:
 *         description: Turn skipped successfully
 */
router.post("/skip-turn", (req, res) => {
    res.json(skipTurn());
});

/**
 * @swagger
 * /new-game:
 *   post:
 *     summary: Reset and start a new game
 *     tags: [Game]
 *     responses:
 *       200:
 *         description: New game created successfully
 */
router.post("/new-game", (req, res) => {
    res.json(newGame());
});

export default router;