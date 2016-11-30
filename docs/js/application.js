let bilinear = (src, dst, sx, sy) => {
  for (let y = 0; y < dst.height; y++) {
    for (let x = 0; x < dst.width; x++) {
      let x0 = Math.floor(x / sx);
      let y0 = Math.floor(y / sy);
      if (x0 < src.width - 1 && y0 < src.height - 1) {
        let a = x / sx - x0;
        let b = y / sy - y0;
        let p1 = src.getRGBA(x0, y0);
        let p2 = src.getRGBA(x0 + 1, y0);
        let p3 = src.getRGBA(x0, y0 + 1);
        let p4 = src.getRGBA(x0 + 1, y0 + 1);
        let weighting = (c1, c2, c3, c4) => Math.round((1 - a) * (1 - b) * c1 + + a * (1 - b) * c2 + (1 - a) * b * c3 + a * b * c4);
 
        dst.setRGBA(x, y, new Color(weighting(p1.r, p2.r, p3.r, p4.r), weighting(p1.g, p2.g, p3.g, p4.g), weighting(p1.b, p2.b, p3.b, p4.b), weighting(p1.a, p2.a, p3.a, p4.a)));
      }
    }
  }
}
window.addEventListener("load", () => {
  let deviceNavigator = navigator.mediaDevices.getUserMedia({ audio: false, video: true });
  deviceNavigator.then((s) => {
    let target = document.getElementById("target");
    let ctracker = new clm.tracker();
    let result = document.getElementById("result");
    let context = result.getContext("2d");
    let update = () => {
      requestAnimationFrame(update);
      let positions = ctracker.getCurrentPosition();
      context.clearRect(0, 0, result.width, result.height);
      context.drawImage(target, 0, 0, result.width, result.height);
      let [x28, y28] = positions[28];
      let [x30, y30] = positions[30];
      ctracker.draw(result);
      let src = new Image(result, context, result.width, result.height, 0, 0);
      dst = new Image(result, context, result.width / 2, result.height / 2);
      bilinear(src, dst, 0.5, 0.5);
      context.putImageData(dst.data, 0, 0);
    };
    target.src = window.URL.createObjectURL(s);
    ctracker.init(pModel);
    ctracker.start(target);
    update();
  });
});
