import { TaskType } from "../const/constants";

/**
 * compare betweens Date1 and Date2 
 * @param taskFist 
 * @param taskSecond 
 */
export const compareDate = (taskFist: TaskType, taskSecond: TaskType) => {
  if (taskFist.dateTime < taskSecond.dateTime) {
    return -1;
  }
  if (taskFist.dateTime > taskSecond.dateTime) {
    return 1;
  }
  return 0;

}