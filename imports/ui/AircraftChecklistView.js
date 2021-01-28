import React from "react";
import { SecondaryButton, LinkButton, PrimaryButton } from "./common/Button";
import { useHistory, useParams } from "react-router-dom";
import Modal from "react-bootstrap/modal";
import { FaChevronLeft, FaThumbsUp } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import {
  BsFillPlusCircleFill,
  BsFillTrashFill,
  BsPencil,
} from "react-icons/bs";
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

export default AircraftChecklistView = () => {
  let history = useHistory();
  let { id: aircraftId } = useParams();
  const [editAircraft, setEditAircraft] = React.useState(false);
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [aircraft, setAircraft] = React.useState({});
  const [currentValue, setCurrentValue] = React.useState(0);
  const [deletingTask, setDeletingTask] = React.useState({});
  const [addingTask, setAddingTask] = React.useState({});
  const [deletingAircraft, setDeleteAircraft] = React.useState(false);
  React.useEffect(() => {
    localforage.getItem("aircrafts").then((resp) => {
      const aircraft = resp.filter((i) => i.aircraftId == aircraftId);
      if (aircraft.length == 0) {
        history.replace("/");
      }
      setAircraft(aircraft[0]);
      setLoading(false);
    });
    localforage.getItem("tasks").then((resp) => {
      const aircraftTasks = resp.filter((i) => i.aircraftId == aircraftId);
      setTasks(aircraftTasks);
      setLoading(false);
    });
  }, [aircraftId]);
  const fetchData = (data) => {
    setTasks(data.filter((i) => i.aircraftId == aircraftId));
  };

  const addNewTask = (newTask, order) => {
    localforage.getItem("tasks").then((resp) => {
      let nextId = tasks.map((i) => i.id).sort((a, b) => b - a)[0] + 1;
      let currentAircraftTasks = resp.filter((i) => i.aircraftId == aircraftId);
      currentAircraftTasks.sort((a, b) => a.order - b.order);
      let updatedTasks;
      if (order == 1) {
        updatedTasks = currentAircraftTasks.map((i, index) => {
          if (index > 0) {
            return { ...i, order: index + 1 };
          } else {
            return i;
          }
        });
      } else {
        updatedTasks = currentAircraftTasks.map((i, index) => {
          if (i.order > order) {
            return { ...i, order: index + order - 1 };
          } else {
            return i;
          }
        });
      }
      updatedTasks.splice(order, 0, {
        ...newTask,
        id: nextId,
      });
      const otherAircrafts = resp.filter((i) => i.aircraftId != aircraftId);
      localforage
        .setItem("tasks", [...updatedTasks, ...otherAircrafts])
        .then(() => {
          setTasks(updatedTasks);
        });
    });
  };

  const tasksUI = tasks
    .sort((a, b) => a.order - b.order)
    .map((item, index) => {
      const task = (
        <Task
          task={item}
          editing={editAircraft}
          key={item.id}
          id={item.id}
          setAddingTask={(value) => setAddingTask(value)}
          setCurrentValue={(value) => setCurrentValue(currentValue + value)}
          fetchData={(data) => {
            return fetchData(data);
          }}
          setDeletingTask={(task) => setDeletingTask(task)}
          aircraftId={aircraftId}
          addNewTask={(newTask, order) => addNewTask(newTask, order)}
        />
      );
      const sectionHeader = (
        <div className="section-header">{item.description}</div>
      );
      return editAircraft ? (
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
      ) : item.itemType == "section" ? (
        sectionHeader
      ) : (
        task
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
  const riskValues = tasks.length
    ? tasks.reduce((a, b) => ({
        riskValue: a.riskValue + b.riskValue,
      })).riskValue
    : 0;

  const riskValueCalc = riskValues - currentValue;
  const progressMessage =
    riskValueCalc > aircraft.cautionValue ? (
      <span>No Go</span>
    ) : riskValueCalc > aircraft.passingValue ? (
      <span>Caution</span>
    ) : (
      <span>You're good to go.</span>
    );
  // const progressMessage =
  //   riskValueCalc < aircraft.cautionValue ? (
  //     <span>No Go</span>
  //   ) : currentValue < aircraft.passingValue ? (
  //     <span>Caution</span>
  //   ) : (
  //     <span>You're good to go.</span>
  //   );

  return loading ? (
    <div>Loading</div>
  ) : (
    <div id="task-view">
      <div className="header-container">
        <div
          className="aircraft-header"
          style={editAircraft ? { padding: 0 } : {}}
        >
          {!editAircraft ? (
            <div
              className="section"
              style={{ width: "80px", padding: "0px" }}
              onClick={() => history.push("/")}
            >
              <FaChevronLeft size={26} color="#377feb" />
            </div>
          ) : (
            <div></div>
          )}
          {!editAircraft ? (
            aircraft?.name
          ) : (
            <div
              style={{
                display: "flex",
                maxWidth: "40%",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: "15px", marginTop: "18px" }}>
                Airfraft Name
              </span>
              <input
                value={aircraft.name}
                className="edit-passing-value-input"
                onChange={(e) =>
                  setAircraft({ ...aircraft, name: e.target.value })
                }
                style={{ width: "90%" }}
              />
            </div>
          )}
          {!editAircraft ? (
            <div className="aircraft-edit-actions">
              <div
                className="section"
                onClick={() => {
                  setCurrentValue(0);
                  return setEditAircraft(!editAircraft);
                }}
              >
                <BsPencil size={23} color="#377feb" />
              </div>
              <div className="section" onClick={() => setDeleteAircraft(true)}>
                <BsFillTrashFill color="#e64e4e" size={23} />
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginRight: "5px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    width: "80px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "15px" }}>Go / No Go</span>
                  <span style={{ fontSize: "15px" }}>Value</span>
                  <input
                    type="number"
                    placeholder={aircraft.passingValue}
                    className="edit-passing-value-input"
                    onChange={(e) => {
                      e.persist();
                      localforage.getItem("aircrafts").then((resp) => {
                        const newData = resp.map((a) => {
                          if (a.aircraftId == aircraft.aircraftId) {
                            setAircraft({
                              ...a,
                              passingValue: e.target.value * 1,
                            });
                            return { ...a, passingValue: e.target.value * 1 };
                          } else {
                            return a;
                          }
                        });
                        localforage.setItem("aircrafts", newData);
                      });
                    }}
                  ></input>
                </div>
                <div
                  style={{
                    width: "80px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "15px" }}>Caution</span>
                  <span style={{ fontSize: "15px" }}>Value</span>
                  <input
                    type="number"
                    placeholder={aircraft.cautionValue}
                    className="edit-passing-value-input"
                    onChange={(e) => {
                      e.persist();
                      localforage.getItem("aircrafts").then((resp) => {
                        const newData = resp.map((a) => {
                          if (a.aircraftId == aircraft.aircraftId) {
                            setAircraft({
                              ...a,
                              cautionValue: e.target.value * 1,
                            });
                            return { ...a, cautionValue: e.target.value * 1 };
                          } else {
                            return a;
                          }
                        });
                        localforage.setItem("aircrafts", newData);
                      });
                    }}
                  ></input>
                </div>
              </div>
              <div style={{ fontSize: "18px" }}>
                Total risk points: {riskValues}
              </div>
            </div>
          )}
        </div>
      </div>
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
      </div>
      <div className="assessment-container">
        {editAircraft ? (
          <div className="done-editing">
            <PrimaryButton
              onClick={() => setEditAircraft(!editAircraft)}
              style={{ width: "80%", height: "45px" }}
            >
              Done Editing
            </PrimaryButton>
          </div>
        ) : (
          <>
            {/* <div className="total">
              {currentValue}/{aircraft.passingValue}
            </div> */}
            <div className="progress-message">{progressMessage}</div>
          </>
        )}
      </div>
      {deletingAircraft && (
        <div className="modal-container">
          <div className="modal">
            <Modal.Body>
              {`Are you sure you want to delete the ${aircraft?.name} checklist?`}
            </Modal.Body>
            <Modal.Footer>
              <PrimaryButton
                onClick={(e) => {
                  e.preventDefault();
                  localforage.getItem("tasks").then((resp) => {
                    localforage
                      .setItem("tasks", [
                        ...resp.filter((i) => i.aircraftId != aircraftId),
                      ])
                      .then(() => {
                        localforage.getItem("aircrafts").then((resp) => {
                          localforage
                            .setItem("aircrafts", [
                              ...resp.filter((i) => i.aircraftId != aircraftId),
                            ])
                            .then(() => {
                              history.replace("/");
                            });
                        });
                      });
                  });
                }}
              >
                Yes
              </PrimaryButton>
              <PrimaryButton onClick={() => setDeleteAircraft(false)}>
                No
              </PrimaryButton>
            </Modal.Footer>
          </div>
        </div>
      )}
      {deletingTask.id && (
        <div className="modal-container">
          <div className="modal">
            <Modal.Body>
              Are you sure that you want to delete this task?
            </Modal.Body>
            <Modal.Footer>
              <PrimaryButton
                onClick={(e) => {
                  e.preventDefault();
                  localforage.getItem("tasks").then((resp) => {
                    let filtered = resp.filter((i) => i.id != deletingTask.id);
                    const list = filtered
                      .filter((i) => i.aircraftId == aircraftId)
                      .sort((a, b) => a.order - b.order);
                    const orderUpdated = list.map((i, index) => {
                      return { ...i, order: index + 1 };
                    });
                    localforage
                      .setItem("tasks", [
                        ...orderUpdated,
                        ...resp.filter((i) => i.aircraftId != aircraftId),
                      ])
                      .then((data) => {
                        fetchData(data);
                        setDeletingTask({});
                      });
                  });
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
      {addingTask.order && (
        <div className="modal-container">
          <div className="modal">
            <Modal.Header>Add a new task</Modal.Header>
            <Modal.Body>
              <div className="modal-add-section">
                <div
                  style={{
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "rgb(117, 117, 117)",
                    marginTop: "10px",
                  }}
                  onClick={() => {
                    if (addingTask.itemType == "section") {
                      setAddingTask({ ...addingTask, itemType: "task" });
                    } else {
                      setAddingTask({ ...addingTask, itemType: "section" });
                    }
                  }}
                >
                  <input
                    style={{ marginRight: "5px", cursor: "pointer" }}
                    type="checkbox"
                    id="section-header"
                    name="Is a new Section"
                    value="Is a new Section"
                    checked={addingTask.itemType == "section"}
                  ></input>
                  Create a New Section Header
                </div>
                <div className="modal-description">
                  <textarea
                    placeholder={
                      addingTask.itemType == "section"
                        ? "Section Name"
                        : "Task description"
                    }
                    style={{ fontSize: "15px" }}
                    onChange={(e) =>
                      setAddingTask({
                        ...addingTask,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                {addingTask.itemType !== "section" && (
                  <div className="modal-risk">
                    <input
                      style={{
                        width: "25px",
                        height: "25px",
                        fontSize: "19px",
                        paddingLeft: "15px",
                        marginRight: "10px",
                        marginLeft: 0,
                      }}
                      onChange={(e) =>
                        setAddingTask({
                          ...addingTask,
                          riskValue: e.target.value,
                        })
                      }
                      type="number"
                    />
                    Risk Value
                  </div>
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <PrimaryButton
                disabled={
                  addingTask.itemType !== "section"
                    ? !addingTask.description || !addingTask.riskValue
                    : !addingTask.description
                }
                onClick={(e) => {
                  e.preventDefault();
                  addNewTask(addingTask, addingTask.order - 1);
                  setAddingTask(false);
                }}
              >
                Save
              </PrimaryButton>
              <SecondaryButton onClick={() => setAddingTask(false)}>
                Cancel
              </SecondaryButton>
            </Modal.Footer>
          </div>
        </div>
      )}
    </div>
  );
};

const Task = ({
  task,
  editing,
  fetchData,
  addNewTask,
  setAddingTask,
  aircraftId,
  setCurrentValue,
  setDeletingTask,
}) => {
  const [editTask, setEditTask] = React.useState(false);
  const [updatedTask, setUpdatedTask] = React.useState(task);
  const [completed, setCompleted] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const [removing, setRemoving] = React.useState(false);

  React.useEffect(() => {
    setUpdatedTask(task);
  }, [task.id]);

  return (
    <div
      key={task.id}
      className="task"
      style={{
        minHeight: editing ? "85px" : "65px",
        color: completed ? "#7d7d7d" : "unset",
        cursor: "pointer",
        fontWeight: task.itemType == "section" ? "bold" : "unset",
        // backgroundColor: completed ? "" : "#ff00004f",
      }}
      onClick={() => {
        if (editing) return;
        setCompleted(!completed);
        setCurrentValue(!completed ? task.riskValue * 1 : -task.riskValue * 1);
      }}
    >
      <span className="drag-menu">
        {editing ? <MdMenu size={22} /> : task.order}
      </span>
      <div className="task-item">
        {editTask ? (
          <>
            <div className="edit-risk">
              <textarea
                style={{ fontSize: "15px" }}
                placeholder="Task description"
                className="edit-description-input"
                value={updatedTask.description}
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
                  onChange={(e) =>
                    setUpdatedTask({
                      ...updatedTask,
                      riskValue: e.target.value * 1,
                    })
                  }
                ></input>
              )}
            </div>
            <div className="edit-description-actions">
              <PrimaryButton
                disabled={
                  updatedTask.itemType !== "section"
                    ? !updatedTask.description || !updatedTask.riskValue
                    : !updatedTask.description
                }
                onClick={(e) => {
                  e.preventDefault();
                  localforage.getItem("tasks").then((resp) => {
                    let list = resp.filter((i) => i.id != task.id);
                    list.push(updatedTask);
                    localforage.setItem("tasks", [...list]).then((data) => {
                      fetchData(data);
                      setEditTask(false);
                    });
                  });
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
              <span
                style={
                  completed
                    ? { color: "#7d7d7d", textDecoration: "line-through" }
                    : {}
                }
              >
                {task.description}
              </span>
            </div>
          </>
        )}
      </div>
      {editing ? (
        !editTask && (
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
        )
      ) : (
        <div className="task-risk-status">
          {/* <span>{task.riskValue}</span> */}
          {completed ? (
            <FaThumbsUp color="green" size={23} />
          ) : (
            <span>{task.riskValue}</span>
          )}
          {/*{completed ? (
            <FaCheck color="green" size={23} />
          ) : (*/}
          {/* <HiThumbDown color={completed ? "#ababab" : "#e64e4e"} size={30} /> */}
          {/*})}*/}
        </div>
      )}
      {editing && (
        <LinkButton
          onClick={() => {
            setAddingTask({
              description: "",
              riskValue: "",
              itemType: "task",
              aircraftId: parseInt(aircraftId),
              order: task.order + 1,
            });
          }}
          style={{
            position: "absolute",
            bottom: "-18px",
            zIndex: "100",
            width: "50px",
          }}
        >
          <BsFillPlusCircleFill className="plus-icon" />
        </LinkButton>
      )}
    </div>
  );
};
