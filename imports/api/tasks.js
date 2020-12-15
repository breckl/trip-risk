// import { check } from "meteor/check";

// export const TasksCollection = new Mongo.Collection("tasks");

// if (Meteor.isServer) {
//   Meteor.methods({
//     updateTask: (id, values) => {
//       check(id, String);
//       check(values, Object);
//       TasksCollection.update({ _id: id }, values);
//     },
//     addTask: (values, order) => {
//       check(values, Object);
//       check(order, Number);
//       TasksCollection.find({
//         aircraftId: values.aircraftId,
//         order: { $gt: order },
//       }).forEach((task) => {
//         TasksCollection.update(
//           { _id: task._id },
//           { ...task, order: task.order + 1 }
//         );
//       });
//       TasksCollection.insert({ ...values, order: order + 1 });
//     },
//     removeTask: (id) => {
//       check(id, String);
//       TasksCollection.remove({ _id: id });
//     },
//   });

//   Meteor.publish("aircraftTasks", function (aircraftId) {
//     check(aircraftId, String);
//     return TasksCollection.find({ aircraftId: aircraftId });
//   });
// }
