window.addEventListener("load", () => {
  let deviceNavigator = navigator.mediaDevices.getUserMedia({ audio: false, video: true });
  deviceNavigator.then((s) => {
    let target = document.getElementById("target");
    target.src = window.URL.createObjectURL(s);
  });
});
