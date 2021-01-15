import React, { useRef } from "react";
import { SecondaryButton, PrimaryButton } from "./common/Button";
import { useHistory, useParams } from "react-router-dom";
import Modal from "react-bootstrap/modal";
import { MdMenu } from "react-icons/md";
import { BsFillTrashFill, BsPencil } from "react-icons/bs";
import { FaChevronLeft } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import localforage from "localforage";

function isNumberKey(evt) {
  console.log("🚀 ~ file: NewAircraft.js ~ line 12 ~ isNumberKey ~ evt", evt);
  var charCode = evt.which ? evt.which : event.keyCode;
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
    return false;

  return true;
}

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

export default NewAircraft = () => {
  let history = useHistory();
  let { id: aircraftId } = useParams();
  const [tasks, setTasks] = React.useState([]);
  const [newTasks, setNewTasks] = React.useState({});
  const [aircraft, setAircraft] = React.useState({});
  const [editAircraftName, setEditAircraftName] = React.useState(false);
  const [deletingTask, setDeletingTask] = React.useState({});
  const [goValue, setGoValue] = React.useState();
  const [cautionValue, setCautionValue] = React.useState();
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
            <FaChevronLeft size={26} color="#377feb" />
          </div>
          {!editAircraftName ? (
            <span
              className="aircraft-name"
              onClick={() => {
                setEditAircraftName(true);
              }}
            >
              {aircraft?.name || (
                <span style={{ color: "#377feb" }}>Unnamed Aircraft</span>
              )}
              <span
                onClick={() => {
                  setEditAircraftName(true);
                }}
                style={{ marginLeft: 10 }}
              >
                <BsPencil size={21} color="#377feb" />
              </span>
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
              style={{ fontSize: 21, padding: 5 }}
            />
          )}
          <div className="spacer" />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            width: "140px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "15px" }}>Go / No Go Value</span>
          <input
            type="number"
            value={goValue || ""}
            className="edit-passing-value-input"
            style={{ width: "70px" }}
            onChange={(e) => {
              e.persist();
              setGoValue(e.target.value);
            }}
          ></input>
        </div>
        <div
          style={{
            width: "140px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "15px" }}>Caution Value</span>
          <input
            type="number"
            value={cautionValue || ""}
            className="edit-passing-value-input"
            style={{ width: "70px" }}
            onChange={(e) => {
              e.persist();
              setCautionValue(e.target.value);
            }}
          ></input>
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
            <div
              style={{
                fontSize: "15px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                color: "rgb(117, 117, 117)",
                marginTop: "10px",
              }}
              onClick={() => {
                if (newTasks.itemType == "section") {
                  setNewTasks({ ...newTasks, itemType: "task" });
                } else {
                  setNewTasks({ ...newTasks, itemType: "section" });
                }
              }}
            >
              <input
                style={{ marginRight: "5px", cursor: "pointer" }}
                type="checkbox"
                id="section-header"
                name="Is a new Section"
                value="Is a new Section"
                checked={newTasks.itemType == "section"}
              ></input>
              Create a New Section Header
            </div>
            <div className="edit-risk">
              <textarea
                placeholder={
                  newTasks.itemType == "section"
                    ? "Section Name"
                    : "Task description"
                }
                style={{ fontSize: "15px" }}
                className="edit-description-input"
                value={newTasks.description}
                onChange={(e) => {
                  setNewTasks({
                    ...newTasks,
                    description: e.target.value,
                  });
                }}
              />
              {newTasks.itemType !== "section" && (
                <div>
                  <input
                    placeholder="Risk value"
                    type="number"
                    className="form-control edit-risk-input"
                    value={newTasks.riskValue}
                    style={{ width: 80, fontSize: "15px" }}
                    onChange={(e) => {
                      setNewTasks({
                        ...newTasks,
                        riskValue: e.target.value * 1,
                      });
                    }}
                  ></input>
                  <div style={{ marginTop: 3 }}>Use 1-10</div>
                </div>
              )}
            </div>
            <div className="edit-description-actions">
              <PrimaryButton
                disabled={
                  newTasks.itemType !== "section"
                    ? !newTasks.description || !newTasks.riskValue
                    : !newTasks.description
                }
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
                Add{" "}
                {newTasks.itemType !== "section" ? "Task" : "Section Header"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
      <div className="assessment-container" style={{ boxShadow: "none" }}>
        <div className="done-editing">
          <PrimaryButton
            disabled={!tasks || !aircraft.name || !cautionValue || !goValue}
            onClick={() => {
              var newAircraftId;
              localforage.getItem("aircrafts").then((resp) => {
                newAircraftId =
                  resp.map((i) => i.aircraftId).sort((a, b) => b - a)[0] * 1;
                localforage
                  .setItem("aircrafts", [
                    ...resp,
                    {
                      ...aircraft,
                      aircraftId: newAircraftId + 1,
                      passingValue: goValue,
                      cautionValue: cautionValue,
                    },
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
                          itemType: i.itemType ? i.itemType : "task",
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
                style={{ fontSize: "15px" }}
                onChange={(e) =>
                  setUpdatedTask({
                    ...updatedTask,
                    description: e.target.value,
                  })
                }
              />
              {task.itemType !== "section" && (
                <input
                  type="number"
                  style={{ fontSize: "15px" }}
                  className="form-control edit-risk-input"
                  value={updatedTask.riskValue}
                  onChange={(e) => {
                    setUpdatedTask({
                      ...updatedTask,
                      riskValue: e.target.value * 1,
                    });
                  }}
                ></input>
              )}
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
            <BsPencil size={21} color="#377feb" />
          </div>
          <div className="section" onClick={() => setDeletingTask(task)}>
            <BsFillTrashFill color="#e64e4e" size={21} />
          </div>
        </div>
      )}
    </div>
  );
};
