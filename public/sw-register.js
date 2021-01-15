// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     console.log("in listener");
//     navigator.serviceWorker
//       .register("./sw.js")
//       .then((registration) => {
//         // Registration was successful
//         // eslint-disable-next-line no-console
//         console.log(
//           "ServiceWorker registration successful with scope: ",
//           registration.scope
//         );
//       })
//       .catch((err) => {
//         // registration failed :(
//         // eslint-disable-next-line no-console
//         console.log("ServiceWorker registration failed: ", err);
//       });
//   });
// } else {
//   console.log({ navigator });
// }

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => {
      console.info("[Dev] service worker registered");
    })
    .catch((error) => {
      console.info("[Dev] ServiceWorker registration failed");
      console.error(error);
    });
} else {
  console.info("[Dev] Your browser does not support the Service-Worker!");
}
