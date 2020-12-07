import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { SecondaryButton, LinkButton, PrimaryButton } from "./common/Button";
import { PencilFill, TrashFill, ChevronLeft } from "react-bootstrap-icons";
import { useHistory, useParams } from "react-router-dom";
import { TasksCollection } from "/imports/api/tasks";
import { AircraftsCollection } from "/imports/api/aircrafts";
import Modal from "react-bootstrap/modal";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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

export const AircraftChecklistView = () => {
  let history = useHistory();
  let { id: aircraftId } = useParams();
  const [editAircraft, setEditAircraft] = React.useState(false);
  let { tasks, loading, aircraft } = useTracker(() => {
    let subscriptions = [
      Meteor.subscribe("aircraftTasks", aircraftId),
      Meteor.subscribe("aircraft", aircraftId),
    ];

    return {
      loading: subscriptions.some((s) => !s.ready()),
      aircraft: AircraftsCollection.findOne({
        aircraftId: parseInt(aircraftId),
      }),
      tasks: TasksCollection.find({
        aircraftId: parseInt(aircraftId),
      }).fetch(),
    };
  });

  const tasksUI = tasks
    .sort((a, b) => a.order - b.order)
    .map((item, index) => {
      const task = <Task task={item} editing={editAircraft} id={item._id} />;
      return editAircraft ? (
        <Draggable key={item._id} draggableId={item._id} index={index}>
          {(provided, snapshot) => (
            <div
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
    items.forEach((task, index) => {
      Meteor.call("updateTask", task._id, { ...task, order: index + 1 });
    });
  };

  return loading ? (
    <div>Loading</div>
  ) : (
    <div id="task-view">
      <div className="aircraft-header">
        <div
          className="section"
          style={{ width: "80px", padding: "0px" }}
          onClick={() => history.push("/")}
        >
          <ChevronLeft size={23} />
        </div>
        {aircraft?.name}
        {!editAircraft ? (
          <div className="aircraft-edit-actions">
            <div
              className="section"
              onClick={() => {
                return setEditAircraft(!editAircraft);
              }}
            >
              <PencilFill size={23} color="blue" />
            </div>
            <div
              className="section"
              // onClick={() => Meteor.call('removeTask'())}
            >
              <TrashFill color="red" size={23} />
            </div>
          </div>
        ) : (
          <div style={{ width: "80px" }} />
        )}
      </div>
      <div>
        <div className="section-header">
          Pilot Qualifications and Experience
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
      </div>
      {editAircraft && (
        <div className="done-editing">
          <PrimaryButton
            onClick={() => setEditAircraft(!editAircraft)}
            style={{ width: "80%", height: "45px" }}
          >
            Save Checklist
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};

const Task = ({ task, editing }) => {
  const [editTask, setEditTask] = React.useState(false);
  const [updatedTask, setUpdatedTask] = React.useState(task);
  const [completed, setCompleted] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const [removing, setRemoving] = React.useState(false);
  const [newTask, setNewTask] = React.useState({
    description: "",
    riskValue: "",
    itemType: "task",
    aircraftId: task.aircraftId,
  });

  return (
    <div
      key={task._id}
      className="task"
      style={{
        minHeight: editing ? "85px" : "65px",
        color: completed ? "#7d7d7d" : "unset",
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
                  setUpdatedTask({ ...updatedTask, riskValue: e.target.value })
                }
              ></input>
            </div>
            <div className="edit-description-actions">
              <PrimaryButton
                onClick={(e) => {
                  e.preventDefault();
                  Meteor.call("updateTask", task._id, updatedTask);
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
            <div className="section" onClick={() => setCompleted(!completed)}>
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
              <PencilFill size={21} color="blue" />
            </div>
            <div className="section" onClick={() => setRemoving(true)}>
              <TrashFill color="red" size={21} />
            </div>
          </div>
        )
      ) : (
        <div className="task-risk-status">
          <span>{task.riskValue}</span>
          {completed ? (
            <FaCheck color="green" size={23} />
          ) : (
            <HiThumbDown color="red" size={30} />
          )}
        </div>
      )}
      {removing && (
        <div className="modal-container">
          <div className="modal">
            <Modal.Body>
              Are you sure that you want to delete this task?
            </Modal.Body>
            <Modal.Footer>
              <PrimaryButton
                onClick={(e) => {
                  e.preventDefault();
                  Meteor.call("removeTask", task._id);
                  setRemoving(false);
                }}
              >
                Yes
              </PrimaryButton>
              <PrimaryButton onClick={() => setRemoving(false)}>
                No
              </PrimaryButton>
            </Modal.Footer>
          </div>
        </div>
      )}
      {adding && (
        <div className="modal-container">
          <div className="modal">
            <Modal.Header>Add a new task</Modal.Header>
            <Modal.Body>
              <div className="modal-add-section">
                <div className="modal-description">
                  Description:
                  <textarea
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                  />
                </div>
                <div className="modal-risk">
                  Risk Value:
                  <input
                    style={{
                      width: "25px",
                      height: "25px",
                      fontSize: "19px",
                      paddingLeft: "15px",
                    }}
                    onChange={(e) =>
                      setNewTask({ ...newTask, riskValue: e.target.value })
                    }
                    type="number"
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <PrimaryButton
                onClick={(e) => {
                  e.preventDefault();
                  // save
                  Meteor.call("addTask", newTask, task.order);
                  setAdding(false);
                }}
              >
                Save
              </PrimaryButton>
              <SecondaryButton onClick={() => setAdding(false)}>
                Cancel
              </SecondaryButton>
            </Modal.Footer>
          </div>
        </div>
      )}
      {editing && (
        <LinkButton
          onClick={() => {
            setEditTask(false);
            setAdding(!adding);
          }}
          style={{
            position: "absolute",
            bottom: "-18px",
            zIndex: "100",
            width: "50px",
          }}
        >
          <BsFillPlusCircleFill size={25} />
        </LinkButton>
      )}
    </div>
  );
};
