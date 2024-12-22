import userModule from "./userItem";
import systemLog from "./systemLog";
import task from "./task";

declare module "userItem" {
  export default userModule;
}

declare module "systemLog" {
  export default systemLog;
}

declare module "task" {
  export default task;
}
