var loadingTask = pdfjsLib.getDocument('IMSLP23765-PMLP01595-Beethoven_Symphony6_Cls.pdf');
loadingTask.promise.then(function(pdf) {
  // you can now use *pdf* here
  pdf.getPage(1).then(function(page) {
    // you can now use *page* here
    var scale = 1;
    var viewport = page.getViewport({ scale: scale, });
    // Support HiDPI-screens.
    var outputScale = window.devicePixelRatio || 1;

    var canvas = document.getElementById('layer1');
    var context = canvas.getContext('2d');

    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);

    var transform = outputScale !== 1
    ? [outputScale, 0, 0, outputScale, 0, 0]
    : null;

    var renderContext = {
        canvasContext: context,
        transform: transform,
        viewport: viewport
    };

    var renderingTask = page.render(renderContext);

    renderingTask.promise.then(function() {    
        const cursor = createCursor();
        showImageData(cursor);
    });
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

    return cursor;
}

function showImageData(cursor) {
    const canvas = document.getElementById('layer1');
    const context = canvas.getContext('2d');

    const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    console.log(imgData);

    let i = 0;
    let count = 0;
    let whiteCount = 0;
    while (4*i < data.length) {
        const red = data[4*i];
        const green = data[4*i + 1];
        const blue = data[4*i + 2];
        const alpha = data[4*i + 3];
    
        if ((data[4*i] !== 255) || 
            (data[4*i+1] !== 255) || 
            (data[4*i+2] !== 255)) {
            count += 1;
            row = i / canvas.width;
            column = i % canvas.width;

            cursor.clear();
            cursor.y = row;
            cursor.x = column;
            cursor.update();

            break;
        } else {
            whiteCount += 1;
        }
        i += 1;
    }
    const totalPixels = count+whiteCount;
    console.log(count, count / totalPixels);
    console.log(whiteCount, whiteCount / totalPixels);
    console.log(totalPixels);
}

let i = 0;

function advanceOnePixel() {
    const canvas = document.getElementById('layer1');
    const context = canvas.getContext('2d');

    const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    
    if (i < data.length) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        const alpha = data[i + 3];
    
        data[i] = 0
        data[i+1] = 255;
        data[i+2] = 0;

        context.putImageData(imgData, 0, 0);
        i += 4;
    }
}

document.addEventListener("keydown", advanceOnePixel);