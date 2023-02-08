var loadingTask = pdfjsLib.getDocument('IMSLP23765-PMLP01595-Beethoven_Symphony6_Cls.pdf');
loadingTask.promise.then(function(pdf) {
  // you can now use *pdf* here
  pdf.getPage(1).then(function(page) {
    // you can now use *page* here
    var scale = 1.5;
    var viewport = page.getViewport({ scale: scale, });
    // Support HiDPI-screens.
    var outputScale = window.devicePixelRatio || 1;

    var canvas = document.getElementById('layer1');
    var context = canvas.getContext('2d');

    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = Math.floor(viewport.width) + "px";
    canvas.style.height =  Math.floor(viewport.height) + "px";

    var transform = outputScale !== 1
    ? [outputScale, 0, 0, outputScale, 0, 0]
    : null;

    var renderContext = {
    canvasContext: context,
    transform: transform,
    viewport: viewport
    };
    page.render(renderContext);

    createCursor();
  });
});

function createCursor() {
    const canvas = document.getElementById('layer2');
    canvas.width = document.getElementById('layer1').width;
    canvas.height = document.getElementById('layer1').height;

    const context = canvas.getContext('2d');
    context.globalAlpha = 0.5;
    
    function component(width, height, x, y, color) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.clear = function() {
            context.clearRect(this.x, this.y, this.width, this.height);
        };
        this.update = function() {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
        };
    }
    
    const cursor = new component(10, 50, 50, 50, "red");
    cursor.update();
    
    document.addEventListener("keydown", (e) => {
        e.preventDefault();
        if (e.key === "ArrowRight") {
            cursor.clear();
            cursor.x += 10;
            cursor.update();
        } else if (e.key === "ArrowLeft") {
            cursor.clear();
            cursor.x -= 10;
            cursor.update();
        } else if (e.key === "ArrowDown") {
            cursor.clear();
            cursor.y += 10;
            cursor.update();
        } else if (e.key === "ArrowUp") {
            cursor.clear();
            cursor.y -= 10;
            cursor.update();
        }
    });
}


