import gutil from 'gulp-util';

var colorsMap = new Map();

colorsMap.set('white', gutil.colors.white);
colorsMap.set('magenta', gutil.colors.magenta);
colorsMap.set('cyan', gutil.colors.cyan);
colorsMap.set('blue', gutil.colors.blue);
colorsMap.set('red', gutil.colors.red);
colorsMap.set('yellow', gutil.colors.yellow);
colorsMap.set('green', gutil.colors.green);


var colors = colorsMap.values();

var getNextColoring = () => {
  var color = colors.next();
  if (color.done) {
    colors = colorsMap.values();
  }

  return color.value;
};

var isEnabled = true;

export default class Log {
  constructor(task, color) {
    this.task = task;

    if (color && colors.has(color)) {
      this.coloring = colors.get(color);
    } else {
      this.coloring = getNextColoring();
    }
  }

  log(message) {
    if (isEnabled) {
      var coloring = this.coloring;
      var completeMessage = message.replace(/((_)([^_]+)(_))/g, coloring('$3'));
      gutil.log(`${coloring(this.task)} ${completeMessage}`);
    }
  }

  updated(options) {
    var coloring = this.coloring;
    var info = '';
    if (options.src) {
      info = coloring(options.src);
    }

    if (options.dest) {
      info += ` -> ${coloring(options.dest)}`;
    }

    this.log(`fired. ${info}`);
  }

  static enable() {
    isEnabled = true;
  }

  static disable() {
    isEnabled = false;
  }
}
