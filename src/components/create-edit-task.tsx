import React, { useState, useEffect } from 'react';
import { ACTION_TASK_TYPE, OPTION_PIORITY, TaskType } from '../const/constants';
import moment from 'moment';
import Select from 'react-select';
import { v4 as uuidV4 } from 'uuid';
import _ from 'lodash';

export interface ICreateEditTaskProps {
  typeActionTask: string, //Add || Edit
  task?: any; // Task for case Edit
  actionTask: (task: TaskType, typeActionTask: string) => void
}

const CreateEditTask: React.FC<ICreateEditTaskProps> = (props) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [taskPiority, setTaskPiority] = useState(OPTION_PIORITY[1]);

  useEffect(() => {
    if (_.isNil(props.task)) {
      setDateTime(moment().format('YYYY-MM-DD'));
      setTaskPiority(OPTION_PIORITY[1]);// default is normal
    } else {
      setTaskName(props.task.taskName);
      setTaskDescription(props.task.taskDescription);
      setDateTime(props.task.dateTime);
      setTaskPiority(props.task.taskPiority);
    }
  }, [])

  /**
   *  Action to task (update, remove, remove tasks check)
   */
  const actionTaskClick = () => {
    console.log("action task chlick")
    if (props.actionTask) {
      props.actionTask(
        {
          taskId: props.task ? props.task.taskId : uuidV4(),
          taskName,
          taskDescription,
          dateTime,
          taskPiority,
        },
        props.typeActionTask);
    }
  }

  /**
   * change select piority task
   * @param selectedOption 
   */
  const changeSelectPiority = (selectedOption: any) => {
    setTaskPiority(selectedOption);
  }

  return (
    <>
      <div className="content-add-edit-task">
        <input className="mr-b20 wd-80"
          placeholder={props.typeActionTask === ACTION_TASK_TYPE.CREATE ? 'Add new Task...' : props.task.taskName}
          defaultValue={_.isNil(props.task) ? '' : props.task.taskName}
          onBlur={event => setTaskName(event.target.value)} />
        <div className="description mr-b20">
          <label>Description</label>
          <textarea defaultValue={_.isNil(props.task) ? '' : props.task.taskDescription} onBlur={(e) => setTaskDescription(e.target.value)} />
        </div>
        <div className="option-task mr-b20">
          <div className="option-task-item">
            <label>Due Date</label>
            <input type="date"
              defaultValue={dateTime}
              onChange={event => setDateTime(event.target.value)} />
          </div>
          <div className="option-task-item">
            <label>Piority</label>
            <Select
              classNamePrefix="mySelect"
              onChange={changeSelectPiority}
              className="option-piority"
              value={taskPiority}
              options={OPTION_PIORITY} />
          </div>
        </div>
        <button className="btn btn-add-edit btn-green wd-80 mr-t20" onClick={actionTaskClick}>{_.isNil(props.task) ? 'Add' : 'Update'}</button>
      </div>
    </>
  )
}

export default CreateEditTask;