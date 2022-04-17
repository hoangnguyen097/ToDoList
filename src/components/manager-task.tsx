import React, { useState, useEffect } from 'react';
import { ACTION_TASK_TYPE, MESSAGE_SUCCESS, MESSAGE_VALIDATE, TaskType, TIME_DEBOUNCE, TYPE_SEARCH } from '../const/constants';
import useDebounce from '../helpers/useDebounce';
import CreateEditTask from './create-edit-task';
import TaskItem from './task-item';
import _ from 'lodash';
import moment from 'moment';
import { compareDate } from '../helpers/logic';

export default function ManagerTask() {
  /**
   * Get Data list default in local storage
   */
  const getDataInLocalStorage = () => {
    const listTaskLocalStorage = localStorage.getItem('listTask');
    if (!_.isNil(listTaskLocalStorage)) {
      return JSON.parse(listTaskLocalStorage);
    }
    return Array<TaskType>();
  }

  const [listTask, setListTask] = useState(() => {
    const data = getDataInLocalStorage();
    return data;
  });

  const [listTaskDisplay, setListTaskDisplay] = useState<TaskType[]>([]);
  const [listTaskSelectUpdate, setListTaskSelectUpdate] = useState<TaskType[]>([]);
  const [textSearch, setTextSearch] = useState('');
  const [checkEditTask, setCheckEditTask] = useState(false);
  const debouncedTextSearch = useDebounce(textSearch, TIME_DEBOUNCE);

  /**
   * Update data into localstorage
   * @param listTask 
   */
  const updateDataListTask = (listTask: TaskType[]) => {
    setListTask(listTask);
    localStorage.setItem('listTask', JSON.stringify(listTask));
  }

  /**
   * Find list task have taskName includes textSearch input
   * @param text 
   */
  const findListByName = (taskName: string, typeSearch: string) => {
    if (typeSearch === TYPE_SEARCH.INCLUDES) {
      return listTask.filter((elm: { taskName: string | string[]; }) => elm.taskName.includes(taskName));
    } else {
      return listTask.filter((elm: { taskName: string | string[]; }) => elm.taskName === taskName);
    }
  }

  useEffect(() => {
    if (textSearch !== '' && listTask.length > 0) {
      const listFilter = findListByName(textSearch, TYPE_SEARCH.INCLUDES);
      setListTaskDisplay(listFilter);
    } else {
      setListTaskDisplay(listTask);
    }
  }, [debouncedTextSearch])

  /**
   * Action to task (update, remove, remove tasks check)
   * @param task 
   * @param typeActionTask 
   */
  const onActionTask = (task: TaskType, typeActionTask: string) => {
    if (task.taskName === '') {
      alert(MESSAGE_VALIDATE.TASK_NAME_IS_EMPTY);
      return;
    }

    if (findListByName(task.taskName, TYPE_SEARCH.EQUALS).length > 0 && typeActionTask === ACTION_TASK_TYPE.CREATE) {
      alert(MESSAGE_VALIDATE.TASK_NAME_EXIST);
      return;
    }

    if (typeActionTask === ACTION_TASK_TYPE.UPDATE_DISPLAY) {
      let taskUpdateInList = listTaskDisplay.find(elm => elm.taskId === task.taskId);
      let taskSameName = findListByName(task.taskName, TYPE_SEARCH.EQUALS);
      if (taskUpdateInList && !_.isNil(taskSameName[0]) && taskUpdateInList.taskName !== taskSameName[0].taskName) {
        alert(MESSAGE_VALIDATE.TASK_NAME_EXIST);
        return;
      }
    }

    if (task.dateTime < moment().format('YYYY-MM-DD')) {
      alert(MESSAGE_VALIDATE.DUE_DATE_PAST_DAY);
      return;
    }

    switch (typeActionTask) {
      case ACTION_TASK_TYPE.CREATE: {
        let listTaskClone = _.cloneDeep(listTask);
        listTaskClone.push(task);
        setTextSearch('');
        listTaskClone.sort(compareDate);
        setListTaskDisplay(listTaskClone);
        updateDataListTask(listTaskClone);
        break;
      }

      case ACTION_TASK_TYPE.UPDATE_DISPLAY: {
        let listTaskClone = _.cloneDeep(listTaskDisplay);
        let indexTask = listTaskDisplay.findIndex(elm => elm.taskId === task.taskId);
        if (indexTask >= 0) {
          listTaskClone[indexTask] = task;
          setListTaskDisplay(listTaskClone);
          updateDataListTask(listTaskClone);
          alert(MESSAGE_SUCCESS.UPDATE_SUCCESS);
        }
        break;
      }

      case ACTION_TASK_TYPE.REMOVE_DISPLAY: {
        let listTaskClone = _.cloneDeep(listTaskDisplay);
        let indexTask = listTaskDisplay.findIndex(elm => elm.taskId === task.taskId);
        if (indexTask >= 0) {
          listTaskClone.splice(indexTask, 1);
          setListTaskDisplay(listTaskClone);
          updateDataListTask(listTaskClone);
          // check if remove all list Update => bulk action area will be hidden
          const found = listTaskSelectUpdate.some(r => listTaskClone.findIndex(e => e.taskId === r.taskId) >= 0);
          if (!found) {
            setCheckEditTask(false);
          }
        }
        break;
      }
    }
  }

  /**
   * Check task select remove tasks check
   * @param taskId 
   * @param typeCheck 
   */
  const clickCheckBoxTask = (taskId: string, typeCheck: any) => {
    const listTaskUpdate = _.cloneDeep(listTaskSelectUpdate);

    if (typeCheck) {
      const taskUpdate = listTaskDisplay.find(e => e.taskId === taskId);
      if (taskUpdate) {
        listTaskUpdate.push(taskUpdate);
        setListTaskSelectUpdate(listTaskUpdate);
      }
      setCheckEditTask(true);
    } else {
      let indexRemove = listTaskUpdate.findIndex(task => task.taskId === taskId);
      listTaskUpdate.splice(indexRemove, 1);
      setListTaskSelectUpdate(listTaskUpdate);
      if (listTaskUpdate.length === 0) {
        setCheckEditTask(false);
      }
    }
  }

  /**
   * Get list Task checked (after remove other task)
   * @param task 
   */
  const getIsChecked = (task: TaskType) => {
    return listTaskSelectUpdate.findIndex(elmTask => elmTask.taskId === task.taskId) >= 0;
  }

  /**
   * Remove all task checked
   */
  const removeAllTaskChecked = () => {
    const listTaskAffterRemove = listTaskDisplay.filter((elem) => !listTaskSelectUpdate.find(({ taskId }) => elem.taskId === taskId));
    setListTaskDisplay(listTaskAffterRemove);
    updateDataListTask(listTaskAffterRemove);
  }

  const getClassNameScrollList = () => {
    return checkEditTask ? 'list-task calc-210' : 'list-task calc-145';
  }

  return (
    <>
      <div className="wrap-container">
        <div className="wrap-container-create-edit">
          <h1 className="title">New Task</h1>
          <CreateEditTask
            typeActionTask={ACTION_TASK_TYPE.CREATE}
            actionTask={onActionTask}
          />
        </div>
        <div className="wrap-container-list">
          <h1 className="title">To Do List</h1>
          <div className="enter-name-task">
            <input className="mr-b20 wd-100" value={textSearch} onChange={envent => setTextSearch(envent.target.value)} placeholder="Search..." />
          </div>
          <ul className={getClassNameScrollList()}>
            {listTaskDisplay.map((task, index) => (
              <TaskItem
                key={index}
                task={task}
                actionTask={onActionTask}
                setCheckEditTask={clickCheckBoxTask}
                isCheck={getIsChecked(task)}
              />
            ))}
            {checkEditTask &&
              <div className="bulk-action">
                <label>Bulk Action</label>
                <div className="item-action">
                  <div className="item-action-button">
                    <button className="btn btn-action btn-blue w-120px h-35 mr-r10">Done</button>
                    <button className="btn btn-action btn-red h-35 w-120px" onClick={removeAllTaskChecked}>Remove</button>
                  </div>
                </div>
              </div>}
          </ul>
        </div>
      </div>
    </>
  )
}
