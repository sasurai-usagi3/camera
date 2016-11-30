class Image {
  constructor(canvas, context, width, height, px, py) {
    this.width = width;
    this.height = height;
    if(px === undefined || py === undefined) {
      this.data = context.createImageData(this.width, this.height);
    } else if(px !== undefined && py != undefined) {
      this.data = context.getImageData(px, py, this.width, this.height);
    }
  }

  getHeadAddress(x, y) {
    if(x < 0 || y < 0 || x >= this.width || y >= this.width) {
      return null;
    }
    return 4 * (x + this.width * y);
  }

  getRGBA(x, y) {
    let p = this.getHeadAddress(x, y);
    if (p === null) {
      return new Color(0, 0, 0, 255);
    }
    return new Color(this.data.data[p], this.data.data[p + 1], this.data.data[p + 2], this.data.data[p + 3]);
  }

  setRGBA(x, y, c) {
    let p = this.getHeadAddress(x, y);
    this.data.data[p] = c.r;
    this.data.data[p + 1] = c.g;
    this.data.data[p + 2] = c.b;
    this.data.data[p + 3] = c.a;
  }
}
