import express from 'express';
const app = express();
import 'dotenv/config';
const { PORT } = process.env;
import morgan from 'morgan';
import cors from "cors"

import summaryRoutes from "./routes/summary.route.js"
import errorMiddleware from './middlewares/error.middleware.js';

// middlewares
app.use(cors({
  origin: "*"
}))
app.use(morgan("tiny"))

app.get('/', async (_req, res) => {
    res.send("server running");
});

app.use("/api", summaryRoutes)

// error handler
app.use(errorMiddleware)

// Start the server
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
