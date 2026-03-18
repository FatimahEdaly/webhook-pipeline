import express from "express";
import { Request, Response} from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);// == npx drizzle-kit migrate


const PORT=3000;
const app = express();

app.use(express.json());



app.post("/api/pipelines",async(req: Request, res: Response)=>{});
app.get("/api/pipelines",async(req: Request, res: Response)=>{});
app.put("/api/pipelines/:pipelineId",async(req: Request, res: Response)=>{});
app.delete("/api/pipelines/:pipelineId",async(req: Request, res: Response)=>{});
app.get("/api/jobs",async(req: Request, res: Response)=>{});



app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});