import express from "express";
import { Request, Response,NextFunction} from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import {BadRequestError, NotFoundError,ForbiddenError,UnauthorizedError} from "./classes/errors.js";
import {createPipe,setSource,getAllpipes,getPipeById,deletePipeById,updatePipe} from "./db/queries/pipelines.js"
import {createJob,getJobById,getAllJobs,getPipeJobs}from "./db/queries/jobs.js"
import {createSub,getSubs} from "./db/queries/subscribers.js"
import {getJobAttempts} from "./db/queries/attemps.js"
import {Subscriber} from "./db/schema.js"
import {worker} from "./worker.js"

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);// == npx drizzle-kit migrate


function errorHandler (err: Error,  req: Request,  res: Response,  next: NextFunction,){

console.log(err);

 
  if (err instanceof BadRequestError) {
    return res.status(400).json({ error: err.message });
  }
  
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({ error: err.message });
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).json({ error: err.message });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }

  
  res.status(500).json({    error: "Something went wrong on our end" });
}



const PORT=3000;
export const app = express();

app.use(express.json());
 worker().catch(console.error);

app.post("/api/pipelines",async(req: Request, res: Response,next: NextFunction)=>{

try{
  

  const {action,subscribers}=req.body;
  let source="";
 
  if(!action)
    throw new BadRequestError("the action shoud be spacified ");

  if (!Array.isArray(subscribers) || subscribers.length === 0)
    throw new BadRequestError("the subsicribers shoud be spacified ");

  
  const pipeline= await createPipe({action});

  if (!pipeline) {
  throw new ForbiddenError("pipeline creation failed");
}


  const pipelineId=pipeline.id;
  source=`/webhook/${pipelineId}`;  
  const result=await setSource(pipelineId,source);
  pipeline.source=source;

  const subs = subscribers.map((url: string) => ({
      subscriberUrl: url,
      pipelineId: pipeline.id,
    }));
    
    const createdSubscribers = await createSub(subs);

  res.status(201).json({
      pipeline,
      subscribers: createdSubscribers,
    });

}catch(err){


next(err);

}});



app.get("/api/pipelines",async(req: Request, res: Response,next: NextFunction)=>{


  try{

    const pipes=await getAllpipes();

    if(!Array.isArray(pipes) || pipes.length === 0)
      throw new NotFoundError("No pipelines in database yet");

    const result = [];

for (const pipe of pipes) {
  const subs = await getSubs(pipe.id);

  result.push({
    ...pipe,
    subscribers: subs ?? [],
  });
}

return res.status(200).json(result);

}catch(err){


next(err);

}});



app.get("/api/pipelines/:pipelineId",async(req: Request, res: Response,next: NextFunction)=>{

  try{

    const { pipelineId } = req.params;
    const pipe=await getPipeById(pipelineId  as string);  
    
    if(!pipe)
      throw new NotFoundError(`no pipeline with this id ${pipelineId }`);





  const subs = await getSubs(pipe.id);

  return res.status(200).json({
  ...pipe,
  subscribers: subs ?? [],
});



  


}catch(err){


next(err);

}});


app.put("/api/pipelines/:pipelineId",async(req: Request, res: Response,next: NextFunction)=>{

  try{
    const {action}=req.body;
    const { pipelineId } = req.params;
    if(!action)
      throw new BadRequestError(`you shoud spacify the action`);
    const pipe = await updatePipe(pipelineId as string, { action });

    if (!pipe)
      throw new NotFoundError(`no pipeline with this id ${pipelineId}`);
   

   
    return res.status(204).send();
     



}catch(err){


next(err);

}});



app.delete("/api/pipelines/:pipelineId",async(req: Request, res: Response,next: NextFunction)=>{

  try{

    const {pipelineId}=req.params;
  

    const deleted=await deletePipeById(pipelineId as string);

    if(!deleted)
      throw new NotFoundError(`no pipeline with this id ${pipelineId }`);

    return res.status(204).send();


}catch(err){


next(err);

}});



app.post("/webhook/:pipelineId",async( req: Request<{ pipelineId: string }>, res: Response,next: NextFunction)=>{

try{

const {pipelineId}=req.params;
const {payload}=req.body;

if(!payload)
  throw new BadRequestError("payload required");

const pipeline=await getPipeById(pipelineId );

if (!pipeline)
      throw new NotFoundError(`no pipeline with this id ${pipelineId}`);

const job=await createJob({pipelineId ,payload});

 return res.status(202).json({
      message: "job queued successfully",
      jobId: job.id
    });

}catch(err){


next(err);

}






});


app.get("/api/pipelines/:pipelineId/jobs",async(req: Request, res: Response,next: NextFunction)=>{

try{

   const { pipelineId } = req.params;
    const pipe=await getPipeById(pipelineId  as string);  
    
    if(!pipe)
      throw new NotFoundError(`no pipeline with this id ${pipelineId }`);





  const jobs = await getPipeJobs(pipe.id);

  return res.status(200).json({jobs});



}catch(err){


next(err);

}});


app.get("/api/jobs",async(req: Request, res: Response,next: NextFunction)=>{

try{
  const jobs = await getAllJobs();

   if(!Array.isArray(jobs) || jobs.length === 0)
      throw new NotFoundError("No jobs in database yet");

    return res.status(200).json(jobs);




}catch(err){


next(err);

}});


app.get("/api/jobs/:jobId",async(req: Request, res: Response,next: NextFunction)=>{

try{

 const { jobId } = req.params;

    const job = await getJobById(jobId as string);

    if (!job)
      throw new NotFoundError("job not found");

    return res.status(200).json(job);


}catch(err){


next(err);

}});




app.get("/api/jobs/:jobId/attemptsHistory",async(req: Request, res: Response,next: NextFunction)=>{

try{

const { jobId } = req.params;

    const job = await getJobById(jobId as string);

    if (!job)
      throw new NotFoundError("job not found");

    const attemps=await getJobAttempts(jobId as string);

   if (!Array.isArray(attemps) || attemps.length === 0)
      throw new NotFoundError("no attempts for this job yet");

    return res.status(200).json(attemps);



}catch(err){


next(err);

}});






app.use(errorHandler);

export default app;