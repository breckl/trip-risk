import React from "react";
import { defaultTaskList } from "./data/defaultTaskList";
import { SecondaryButton, LinkButton } from "./common/Button";
import { PencilFill, TrashFill } from "react-bootstrap-icons";

export const AircraftChecklistView = ({ aircraft, goBack }) => {
  const [tasks, setTasks] = React.useState(defaultTaskList);
  const [editMode, setEditMode] = React.useState(false);

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
              newTask={() => newTask(tasks, setTasks)}
            />
          );
        else
          tasksUI.push(
            <Task
              key={index}
              task={task}
              clickEvent={() => updateTask(task.itemId, tasks, setTasks)}
            />
          );
      }
    });

  return (
    <div>
      <div>
        <LinkButton onClick={() => goBack()}>{`< Back`}</LinkButton>
        {aircraft}
        <LinkButton onClick={() => setEditMode(!editMode)}>
          {editMode ? "Done Editing" : <PencilFill />}
        </LinkButton>
        <LinkButton>
          <TrashFill />
        </LinkButton>
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

function newTask(tasks, setTasks) {
  console.log("new task")
  let newTasks = tasks
  newTasks.push({ order: 0, description: "", itemType: "task"})
  console.log(newTasks)
  setTasks(newTasks);
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

const EditTask = ({ task, newTask }) => {
  const [editMode, setEditMode] = React.useState(false);
  const [description, setDescription] = React.useState(task.description);
  return (
    <div className="task-item">
      <>
        <SecondaryButton>
          {editMode ? (
            <>
              <input
                style={{ width: "100%" }}
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <LinkButton
                onClick={() => {
                  // save
                  setEditMode(false);
                }}
              >
                Save
              </LinkButton>
              <LinkButton onClick={() => setEditMode(false)}>Cancel</LinkButton>
            </>
          ) : (
            <>
              {task.description}
              <LinkButton onClick={() => setEditMode(true)}>
                <PencilFill />
              </LinkButton>
              <LinkButton>
                <TrashFill />
              </LinkButton>
            </>
          )}
        </SecondaryButton>
        <LinkButton onClick={() => newTask()}>+ New Task</LinkButton>
      </>
    </div>
  );
};

const Section = ({ section }) => {
  return <div className="section-header">{section.description}</div>;
};
