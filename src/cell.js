class Cell {
  constructor(x, y, size) {
    this.starEligible = true;

    this.selected = false;

    this.x = x;

    this.y = y;

    this.size = size;

    this.state = 0; // 0 = empty, 1 = filled
  }

  display() {
    stroke(0);

    noFill();

    rect(this.x, this.y, this.size, this.size);

    if (this.state === 1) {
      fill(100);

      rect(this.x, this.y, this.size, this.size);
    } else if (!this.starEligible) {
      fill("blue");

      rect(this.x, this.y, this.size, this.size);
    }

    if (this.selected) {
      fill("red");

      rect(this.x, this.y, this.size, this.size);
    }
  }

  toggleState() {
    this.state = this.state === 0 ? 1 : 0;
  }
}
