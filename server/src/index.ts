import express, { Application, Request, Response } from "express";
import cors from "cors";
import bookRoutes from "./routes/bookRoutes";
import userRoutes from "./routes/userRoutes";
import errorHandler from "./middlewares/errorHandler";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/books", bookRoutes);
app.use("/auth", userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
