import { checkWinner } from "../util/game.util.js";

const rooms = new Map();

function generateRoomCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export function initGameSocket(io) {
    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on("create_room", ({ username }) => {
            let roomId = generateRoomCode();
            while (rooms.has(roomId)) {
                roomId = generateRoomCode();
            }

            const newRoom = {
                roomId,
                board: Array(25).fill(""),
                currentPlayer: "X",
                gameOver: false,
                winner: null,
                winLine: null,
                lastTurnChange: Date.now(),
                players: {
                    X: { socketId: socket.id, username: username || "Player 1" },
                    O: null,
                },
            };

            rooms.set(roomId, newRoom);
            socket.join(roomId);
            socket.roomId = roomId;

            socket.emit("room_created", {
                roomId,
                role: "X",
                room: newRoom,
            });
        });

        socket.on("join_room", ({ roomId, username }) => {
            const cleanRoomId = roomId ? roomId.trim() : "";
            const room = rooms.get(cleanRoomId);

            if (!room) {
                return socket.emit("error_message", "Room does not exist!");
            }

            if (room.players.O !== null) {
                return socket.emit("error_message", "Room is already full!");
            }

            room.players.O = { socketId: socket.id, username: username || "Player 2" };
            room.lastTurnChange = Date.now();
            socket.join(cleanRoomId);
            socket.roomId = cleanRoomId;

            socket.emit("room_joined", {
                roomId: cleanRoomId,
                role: "O",
                room,
            });

            io.to(cleanRoomId).emit("game_start", { room });
        });

        socket.on("make_move", ({ roomId, index }) => {
            const room = rooms.get(roomId);
            if (!room || room.gameOver) return;

            let playerRole = null;
            if (room.players.X && room.players.X.socketId === socket.id) playerRole = "X";
            if (room.players.O && room.players.O.socketId === socket.id) playerRole = "O";

            if (playerRole !== room.currentPlayer) {
                return socket.emit("error_message", "It is not your turn!");
            }

            if (index < 0 || index >= 25 || room.board[index] !== "") {
                return;
            }

            room.board[index] = room.currentPlayer;
            room.lastTurnChange = Date.now();
            const winResult = checkWinner(room.board);

            if (winResult) {
                room.gameOver = true;
                room.winner = winResult.winner;
                room.winLine = winResult.winLine;
            } else if (!room.board.includes("")) {
                room.gameOver = true;
                room.winner = "Draw";
                room.winLine = null;
            } else {
                room.currentPlayer = room.currentPlayer === "X" ? "O" : "X";
            }

            io.to(roomId).emit("move_made", {
                room,
                lastMoveIndex: index,
            });
        });

        socket.on("skip_turn", ({ roomId }) => {
            const room = rooms.get(roomId);
            if (!room || room.gameOver) return;

            const now = Date.now();
            if (room.lastTurnChange && now - room.lastTurnChange < 2000) {
                return;
            }
            room.lastTurnChange = now;

            room.currentPlayer = room.currentPlayer === "X" ? "O" : "X";
            io.to(roomId).emit("turn_skipped", { room });
        });

        socket.on("restart_game", ({ roomId }) => {
            const room = rooms.get(roomId);
            if (!room) return;

            room.board = Array(25).fill("");
            room.currentPlayer = "X";
            room.gameOver = false;
            room.winner = null;
            room.winLine = null;
            room.lastTurnChange = Date.now();

            io.to(roomId).emit("game_restarted", { room });
        });

        socket.on("disconnect", () => {
            if (socket.roomId && rooms.has(socket.roomId)) {
                io.to(socket.roomId).emit("opponent_left", "Opponent has left the room!");
                rooms.delete(socket.roomId);
            }
        });
    });
}