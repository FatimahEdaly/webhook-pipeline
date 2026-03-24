import app from "./server.js";
import { worker } from "./worker.js";

worker().catch(console.error);

app.listen(3000, () => {
  console.log("server running");
});
