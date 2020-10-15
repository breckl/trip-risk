import React from "react";
import { defaultTaskList } from "./data/defaultTaskList";
import { SecondaryButton, LinkButton } from "./common/Button";
import { HandThumbsDown } from "react-bootstrap-icons";

export const TaskView = ({ aircraft }) => {
  //const [failedTasks, setFailedTasks] = React.useState([]);
  const [tasks, setTasks] = React.useState(defaultTaskList);
  const [editMode, setEditMode] = React.useState(false)

  let tasksUI = [];
  tasks
    .sort((a, b) => a.order - b.order)
    .forEach((task, index) => {
      if (task.itemType == "section") {
        tasksUI.push(<Section key={index} section={task} />);
      } else {
        if (editMode)
        tasksUI.push(
          <EditTask 
            key={index}
            task={task}
          />
        )
        else 

        tasksUI.push(
          <Task
            key={index}
            task={task}
            clickEvent={() => updateTask(task.itemId, tasks, setTasks)}
          />
        )
      }
    });

  return (
    <div>
      <div>
        {aircraft}
        <LinkButton onClick={ ()=>setEditMode(true)}>Edit</LinkButton>
        <LinkButton>Delete</LinkButton>
      </div>
      <div>{tasksUI}</div>
    </div>
  );
};

function updateTask(taskId, tasks, setTasks) {
  const taskObject = tasks.find((task) => task.itemId == taskId);
  if (taskObject !== undefined) {
    let newTaskObject = {};
    if (taskObject.failed == undefined) {
      newTaskObject = { failed: true, ...taskObject };
    } else {
      newTaskObject = taskObject;
      newTaskObject.failed = !newTaskObject.failed;
    }
    newTasks = tasks.filter((task) => task.itemId !== taskId);
    newTasks.push(newTaskObject);
    console.log(newTasks);
    setTasks(newTasks);
  }
}

const Task = ({ task, clickEvent }) => {
  return (
    <div className="task-item">
      <SecondaryButton onClick={clickEvent}>
        <span
          style={
            task.failed ? { color: "red", textDecoration: "line-through" } : {}
          }
        >
          {task.description}
        </span>
        {/*<Text style={styles.taskText}>{task.riskValue}</Text>*/}
      </SecondaryButton>

      {/*<Button
        onClick={clickEvent}
        style={task.failed ? { backgroundColor: "red", color: "white" } : {}}
      >
      <HandThumbsDown style={{ color: "red" }} onClick={clickEvent} />
    </Button>*/}
    </div>
  );
};

const EditTask = ({task }) => {
  const [editMode, setEditMode] = React.useState(false)
  const [description, setDescription ] = React.useState(task.description)
  return (
    <div className="task-item">
      <SecondaryButton>
        {
          editMode ? <input style={{ width: "100%"}} type="text" value={description} onChange={e => setDescription(e.target.value)}/> : <>{task.description}</>
        }
        <LinkButton onClick={()=>setEditMode(true)}>Edit</LinkButton>
        <LinkButton>Delete</LinkButton>
      </SecondaryButton>
    </div>
  )
}

const Section = ({ section }) => {
  return <div className="section-header">{section.description}</div>;
};
