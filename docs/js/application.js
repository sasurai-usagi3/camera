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
        let weighting = (c1, c2, c3, c4) => Math.round((1 - a) * (1 - b) * c1 + a * (1 - b) * c2 + (1 - a) * b * c3 + a * b * c4);
 
        dst.setRGBA(x, y, new Color(weighting(p1.r, p2.r, p3.r, p4.r), weighting(p1.g, p2.g, p3.g, p4.g), weighting(p1.b, p2.b, p3.b, p4.b), weighting(p1.a, p2.a, p3.a, p4.a)));
      }
    }
  }
}

let expand_eye = (canvas, context, center, positions) => {
  let minX = Math.min.apply(null, positions.map(x => x[0]));
  let maxX = Math.max.apply(null, positions.map(x => x[0]));
  let minY = Math.min.apply(null, positions.map(x => x[1]));
  let maxY = Math.max.apply(null, positions.map(x => x[1]));
  let width = maxX - minX;
  let height = maxY - minY;
  let l = Math.max(width, height) * 1.2;
  let r = 1.25;
  let src = new Image(canvas, context, l, l, center[0] - l / 2, center[1] - l / 2);
  let dst = new Image(canvas, context, l * r, l * r);
  bilinear(src, dst, r, r);

  context.putImageData(dst.data, center[0] - l * r / 2, center[1] - l * r / 2);
};

window.addEventListener("load", () => {
  let deviceNavigator = navigator.mediaDevices.getUserMedia({ audio: false, video: true });
  let stamp1 = document.createElement("img"), stamp2 = document.createElement("img"), stamp3 = document.createElement("img");

  stamp1.src = "./img/1.png";
  stamp2.src = "./img/2.png";
  stamp3.src = "./img/3.png";
  deviceNavigator.then((s) => {
    let target = document.getElementById("target");
    let ctracker = new clm.tracker();
    let result = document.getElementById("result");
    let context = result.getContext("2d");
    flag = false;
    let update = () => {
      requestAnimationFrame(update);
      let positions = ctracker.getCurrentPosition();
      context.clearRect(0, 0, result.width, result.height);
      context.drawImage(target, 0, 0, result.width, result.height);
      let left_eye_positions = [positions[28], positions[29], positions[30], positions[31], positions[67], positions[68], positions[69], positions[70]];
      let right_eye_positions = [positions[23], positions[24], positions[25], positions[26], positions[63], positions[64], positions[65], positions[66]];
      expand_eye(result, context, positions[32], left_eye_positions);
      expand_eye(result, context, positions[27], right_eye_positions);
      context.drawImage(stamp1, positions[20][0] - 40, positions[20][1] - 350, 75, 250);
      context.drawImage(stamp1, positions[16][0] - 40, positions[16][1] - 350, 75, 250);
      context.drawImage(stamp3, positions[3][0] - 20, positions[3][1] - 80, 100, 100);
      context.drawImage(stamp3, positions[11][0] - 90, positions[11][1] - 80, 100, 100);
      if(flag) {
        ctracker.draw(result);
      }
    };
    target.src = window.URL.createObjectURL(s);
    ctracker.init(pModel);
    ctracker.start(target);
    update();
  });
});
