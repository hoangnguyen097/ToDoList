import React, { useState, useEffect, useMemo } from 'react';
import { ACTION_TASK_TYPE, TaskType } from '../const/constants';
import CreateEditTask from './create-edit-task';

export interface ITaskItemProps {
  task?: any; // task for case EDIT
  actionTask: (task: TaskType, typeActionTask: string) => void
  setCheckEditTask: (taskId: string, typeCheck: any) => void;
  isCheck?: boolean
}

const TaskItem: React.FC<ITaskItemProps> = (props) => {
  const [showDetail, setShowDetail] = useState(false);
  const togleShowDetail = () => {
    setShowDetail(!showDetail)
  }

  /**
   * on remove task is focusing
   */
  const onRemoveTaskDisplay = () => {
    props.actionTask(props.task, ACTION_TASK_TYPE.REMOVE_DISPLAY);
  }

  return (
    <li className="item">
      <div className="item-action">
        <label className="checkbox-container">{props.task.taskName}
          <input type="checkbox" onChange={event => props.setCheckEditTask(props.task.taskId, event.target.checked)} checked={props.isCheck} />
          <span className="checkmark"></span>
        </label>
        <div className="item-action-button">
          <button className="btn btn-action btn-iris-blue w-100px mr-r10" onClick={togleShowDetail}>{showDetail ? "Hide Detail" : "Detail"}</button>
          <button className="btn btn-action btn-red w-100px" onClick={onRemoveTaskDisplay}>Remove</button>
        </div>
      </div>
      {showDetail &&
        <CreateEditTask
          task={props.task}
          typeActionTask={ACTION_TASK_TYPE.UPDATE_DISPLAY}
          actionTask={props.actionTask}
        />
      }
    </li>
  )
}

export default TaskItem;