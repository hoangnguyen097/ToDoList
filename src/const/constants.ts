export const ACTION_TASK_TYPE = {
  CREATE: 'create',
  UPDATE_DISPLAY: 'update-display',
  REMOVE_DISPLAY: 'remove-display',
  DONE: 'update-item-select',
  REMOVE: 'remove-item-select'
};

export const TIME_DEBOUNCE = 500;

export const MESSAGE_VALIDATE = {
  TASK_NAME_IS_EMPTY: 'Please enter task name!!!',
  TASK_NAME_EXIST: 'Task name is exist!!! Enter another task name',
  DUE_DATE_PAST_DAY: 'Date do not accept days in the past as due date'
}

export const MESSAGE_SUCCESS = {
  UPDATE_SUCCESS: 'Update success!!!'
}

export const TYPE_SEARCH = {
  INCLUDES: 'includes',
  EQUALS: 'equals'
}

export const OPTION_PIORITY = [
  { value: '1', label: 'Low' },
  { value: '2', label: 'Normal' },
  { value: '3', label: 'High' },
]

export type TaskType = {
  taskId: string,
  taskName: string,
  taskDescription: string,
  dateTime: string,
  taskPiority: {}
}