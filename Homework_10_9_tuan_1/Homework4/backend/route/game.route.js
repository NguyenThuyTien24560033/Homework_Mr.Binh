import {getBoard, makeMove, skipTurn, newGame} from "../service/game.service.js";

import express from "express";

const router = express.Router();

router.get("/board", (req, res) => {
    res.json(getBoard());
});

router.post("/move", (req, res) => {
    const { index } = req.body;

    const result = makeMove(index);

    if (result.error) {
        return res.status(400).json({
            message: result.error
        });
    }

    res.json(result);
});

router.post("/skip-turn", (req, res) => {
    res.json(skipTurn());
});

router.post("/new-game", (req, res) => {
    res.json(newGame());
});

export default router;