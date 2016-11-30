window.addEventListener("load", () => {
  let deviceNavigator = navigator.mediaDevices.getUserMedia({ audio: false, video: true });
  deviceNavigator.then((s) => {
    let target = document.getElementById("target");
    let ctracker = new clm.tracker();
    let result = document.getElementById("result");
    let context = result.getContext("2d");
    let update = () => {
      requestAnimationFrame(update);
      context.clearRect(0, 0, result.width, result.height);
      context.drawImage(target, 0, 0, result.width, result.height);
      ctracker.draw(result);
    };
    target.src = window.URL.createObjectURL(s);
    ctracker.init(pModel);
    ctracker.start(target);
    update();
  });
});
