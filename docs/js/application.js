window.addEventListener("load", () => {
  let deviceNavigator = navigator.mediaDevices.getUserMedia({ audio: false, video: true });
  deviceNavigator.then((s) => {
    let target = document.getElementById("target");
    let ctracker = new clm.tracker();
    target.src = window.URL.createObjectURL(s);
    ctracker.init(pModel);
    ctracker.start(target);
  });
});
