

function processImage () {

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    var avgRed = imageData.data[0];
    var avgGreen = imageData.data[1];
    var avgBlue = imageData.data[2];

    // invert colors
    var i;
    for (i = 0; i < imageData.data.length; i += 4) {
        avgRed += imageData.data[i]; avgRed /= 2;
        avgGreen += imageData.data[i+1]; avgGreen /= 2;
        avgBlue += imageData.data[i+2]; avgBlue /= 2;
    }

    console.log({
        red: avgRed,
        green: avgGreen,
        blue: avgBlue
    })

    if (cv) {

      let src = cv.imread('canvas');
      cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
      let srcVec = new cv.MatVector();
      srcVec.push_back(src);
      let accumulate = false;
      let channels = [0];
      let histSize = [256];
      let ranges = [0, 255];
      let hist = new cv.Mat();
      let mask = new cv.Mat();
      let color = new cv.Scalar(255, 255, 255);
      let scale = 2;
      // You can try more different parameters
      cv.calcHist(srcVec, channels, mask, hist, histSize, ranges, accumulate);
      let result = cv.minMaxLoc(hist, mask);
      let max = result.maxVal;
      let dst = new cv.Mat.zeros(src.rows, histSize[0] * scale,
                                  cv.CV_8UC3);
        // draw histogram
        for (let i = 0; i < histSize[0]; i++) {
            let binVal = hist.data32F[i] * src.rows / max;
          let point1 = new cv.Point(i * scale, src.rows - 1);
          let point2 = new cv.Point((i + 1) * scale - 1, src.rows - binVal);
          cv.rectangle(dst, point1, point2, color, cv.FILLED);
        }

        let histvalue = hist.data32F;
        let length = histvalue.length;
        histvalue = histvalue.reduce((previous, current) => current += previous);
        histvalue /= length;
        console.log('HISTVALUE:', histvalue);
        src.delete(); dst.delete(); srcVec.delete(); mask.delete(); hist.delete();

        window.RTImageMetadata = {
          hue: histvalue,
          contrast: histvalue,
          brightness: histvalue,
          rgb: {
              red: avgRed,
              green: avgBlue,
              blue: avgGreen
          }
      }
  }
}


(function() {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
  
    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream
  
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
  
    var streaming = false;
  
    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.
  
    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;
  
    function startup() {
      video = document.getElementById('video');
      canvas = document.getElementById('canvas');
      photo = document.getElementById('photo');
      startbutton = document.getElementById('startbutton');

      canvas.style.display = "none";
      photo.style.display = "none";
  
      navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(function(stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function(err) {
        console.log("An error occurred: " + err);
      });
  
      video.addEventListener('canplay', function(ev){
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth/width);
        
          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.
        
          if (isNaN(height)) {
            height = width / (4/3);
          }
        
          video.setAttribute('width', width);
          video.setAttribute('height', height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          streaming = true;
        }
      }, false);
  
      startbutton.addEventListener('click', function(ev){
        takepicture();
        ev.preventDefault();
      }, false);
      
      clearphoto();
    }
  
    // Fill the photo with an indication that none has been
    // captured.
  
    function clearphoto() {
      var context = canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    }
    
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.
  
    function takepicture() {
      var context = canvas.getContext('2d');
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
      
        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
      } else {
        clearphoto();
      }
    }
  
    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);

    setInterval(() => {
        takepicture();
        processImage();
    }, 1000)
  
  })();
  
  