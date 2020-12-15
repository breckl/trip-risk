import React, { useRef } from "react";
import { SecondaryButton, PrimaryButton } from "./common/Button";
import { PencilFill, TrashFill, ChevronLeft } from "react-bootstrap-icons";
import { useHistory, useParams } from "react-router-dom";
import Modal from "react-bootstrap/modal";
import { MdMenu } from "react-icons/md";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import localforage from "localforage";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  // padding: grid * 2,
  // margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  // background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  // background: isDraggingOver ? "lightblue" : "lightgrey",
});

export const NewAircraft = () => {
  let history = useHistory();
  let { id: aircraftId } = useParams();
  const [tasks, setTasks] = React.useState([]);
  const [newTasks, setNewTasks] = React.useState({});
  const [aircraft, setAircraft] = React.useState({});
  const [editAircraftName, setEditAircraftName] = React.useState(false);
  const [deletingTask, setDeletingTask] = React.useState({});
  const fetchData = (data) => {
    setTasks(data.filter((i) => i.aircraftId == aircraftId));
  };
  const aircraftNameInput = useRef(null);

  const updateTask = (task) => {
    let list = tasks.filter((i) => i.id != task.id);
    const updatedList = [...list, task].sort((a, b) => a.order - b.order);
    setTasks(updatedList);
  };

  const tasksUI = tasks
    .sort((a, b) => a.order - b.order)
    .map((item, index) => {
      const task = (
        <Task
          task={item}
          key={item.id}
          id={item.id}
          updateTask={(value) => updateTask(value)}
          fetchData={(data) => {
            return fetchData(data);
          }}
          setDeletingTask={(task) => setDeletingTask(task)}
          aircraftId={aircraftId}
        />
      );
      return (
        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
          {(provided, snapshot) => (
            <div
              key={item.id}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
            >
              {task}
            </div>
          )}
        </Draggable>
      );
    });

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(tasks, result.source.index, result.destination.index);
    const movedTasks = items.map((task, index) => {
      return { ...task, order: index + 1 };
    });
    setTasks(movedTasks);
  };

  return (
    <div id="task-view">
      <div className="header-container">
        <div className="aircraft-header">
          <div
            className="section"
            style={{ width: "80px", padding: "0px" }}
            onClick={() => history.push("/")}
          >
            <ChevronLeft size={23} />
          </div>
          {/* {!editAircraftName && (
            <span
              onClick={() => {
                setEditAircraftName(true);
                console.log(
                  "🚀 ~ file: NewAircraft.js ~ line 170 ~ NewAircraft ~ aircraftNameInput.current.focus()",
                  aircraftNameInput.current.focus
                );
                aircraftNameInput.current.focus();
              }}
            >
              {aircraft?.name || "Enter Name Here"}
            </span>
          )}
          <input
            style={!editAircraftName ? { display: "none" } : {}}
            ref={aircraftNameInput}
            onBlur={() => setEditAircraftName(false)}
            placeholder="Enter Name Here"
            value={aircraft?.name}
            onChange={(e) => setAircraft({ ...aircraft, name: e.target.value })}
          /> */}
          {!editAircraftName ? (
            <span
              onClick={() => {
                setEditAircraftName(true);
              }}
            >
              {aircraft?.name || "Click to Edit Name"}
            </span>
          ) : (
            <input
              ref={aircraftNameInput}
              autoFocus
              onBlur={() => setEditAircraftName(false)}
              placeholder="Aircraft Name"
              value={aircraft.name}
              onChange={(e) =>
                setAircraft({ ...aircraft, name: e.target.value })
              }
            />
          )}
          <div style={{ width: "80px" }} />
        </div>
        <div className="section-header">
          Pilot Qualifications and Experience
        </div>
      </div>
      <div>
        <div className="tasks-container">
          <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {tasksUI}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className="task-item">
            <div className="edit-risk">
              <textarea
                className="edit-description-input"
                value={newTasks.description}
                onChange={(e) =>
                  setNewTasks({
                    ...newTasks,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="number"
                className="form-control edit-risk-input"
                value={newTasks.riskValue}
                onChange={(e) =>
                  setNewTasks({
                    ...newTasks,
                    riskValue: e.target.value * 1,
                  })
                }
              ></input>
            </div>
            <div className="edit-description-actions">
              <PrimaryButton
                onClick={(e) => {
                  e.preventDefault();
                  tasks.push({
                    ...newTasks,
                    order: tasks.length + 1,
                    id: tasks.length + 1,
                  });
                  setNewTasks({ description: "", riskValue: "" });
                }}
              >
                Add Task
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
      <div className="assessment-container" style={{ boxShadow: "none" }}>
        <div className="done-editing">
          <PrimaryButton
            onClick={() => {
              var newAircraftId;
              localforage.getItem("aircrafts").then((resp) => {
                newAircraftId =
                  resp.map((i) => i.aircraftId).sort((a, b) => b - a)[0] * 1;
                localforage
                  .setItem("aircrafts", [
                    ...resp,
                    { ...aircraft, aircraftId: newAircraftId + 1 },
                  ])
                  .then(() => {
                    localforage.getItem("tasks").then((resp) => {
                      let nextId =
                        resp.map((i) => i.id).sort((a, b) => b - a)[0] + 1;
                      const newTasks = tasks.map((i, index) => {
                        return {
                          ...i,
                          aircraftId: newAircraftId + 1,
                          id: nextId + index,
                          itemType: "task",
                        };
                      });
                      localforage
                        .setItem("tasks", [...resp, ...newTasks])
                        .then(() => {
                          history.push("/");
                        });
                    });
                  });
              });
            }}
            style={{ width: "80%", height: "45px" }}
          >
            Save Aircraft
          </PrimaryButton>
        </div>
      </div>
      {deletingTask.id && (
        <div className="modal-container">
          <div className="modal">
            <Modal.Body>
              Are you sure that you want to delete this task?
            </Modal.Body>
            <Modal.Footer>
              <PrimaryButton
                onClick={(e) => {
                  const newArray = tasks.filter((i) => i.id != deletingTask.id);
                  setTasks(newArray);
                  setDeletingTask({});
                }}
              >
                Yes
              </PrimaryButton>
              <PrimaryButton onClick={() => setDeletingTask({})}>
                No
              </PrimaryButton>
            </Modal.Footer>
          </div>
        </div>
      )}
    </div>
  );
};

const Task = ({ task, updateTask, setDeletingTask }) => {
  const [editTask, setEditTask] = React.useState(false);
  const [updatedTask, setUpdatedTask] = React.useState(task);

  React.useEffect(() => {
    setUpdatedTask(task);
  }, [task.id]);

  return (
    <div
      key={task.id}
      className="task"
      style={{
        minHeight: "85px",
        cursor: "pointer",
      }}
    >
      <span className="drag-menu">
        <MdMenu size={22} />
      </span>
      <div className="task-item">
        {editTask ? (
          <>
            <div className="edit-risk">
              <textarea
                className="edit-description-input"
                value={updatedTask.description}
                onChange={(e) =>
                  setUpdatedTask({
                    ...updatedTask,
                    description: e.target.value,
                  })
                }
              />
              <input
                type="number"
                className="form-control edit-risk-input"
                value={updatedTask.riskValue}
                onChange={(e) =>
                  setUpdatedTask({
                    ...updatedTask,
                    riskValue: e.target.value * 1,
                  })
                }
              ></input>
            </div>
            <div className="edit-description-actions">
              <PrimaryButton
                onClick={(e) => {
                  e.preventDefault();
                  updateTask(updatedTask);
                  setEditTask(false);
                }}
              >
                Save
              </PrimaryButton>
              <SecondaryButton onClick={() => setEditTask(false)}>
                Cancel
              </SecondaryButton>
            </div>
          </>
        ) : (
          <>
            <div className="section">
              <span>{task.description}</span>
            </div>
          </>
        )}
      </div>
      {!editTask && (
        <div className="task-risk-status">
          <div
            className="section"
            onClick={(e) => {
              e.preventDefault();
              setEditTask(true);
            }}
          >
            <PencilFill size={21} color="blue" />
          </div>
          <div className="section" onClick={() => setDeletingTask(task)}>
            <TrashFill color="red" size={21} />
          </div>
        </div>
      )}
    </div>
  );
};
