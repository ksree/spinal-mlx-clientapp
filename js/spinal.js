 // Variables for referencing the canvas and 2dcanvas context
        var canvas, ctx;

        // Variables to keep track of the mouse position and left-button status
        var mouseX, mouseY, mouseDown = 0;

        // Variables to keep track of the touch position
        var touchX, touchY;

        // Keep track of the old/last position when drawing a line
        // We set it to -1 at the start to indicate that we don't have a good value for it yet
        var lastX, lastY = -1;

        // Draws a line between the specified position on the supplied canvas name
        // Parameters are: A canvas context, the x position, the y position, the size of the dot
        function drawLine(ctx, x, y, size) {

            // If lastX is not set, set lastX and lastY to the current position
            if (lastX == -1) {
                lastX = x;
                lastY = y;
            }

            // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
            r = 255; g = 255; b = 255; a = 255;

            // Select a fill style
            ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";

            // Set the line "cap" style to round, so lines at different angles can join into each other
            ctx.lineCap = "round";
            //ctx.lineJoin = "round";


            // Draw a filled line
            ctx.beginPath();

            // First, move to the old (previous) position
            ctx.moveTo(lastX, lastY);

            // Now draw a line to the current touch/pointer position
            ctx.lineTo(x, y);

            // Set the line thickness and draw the line
            ctx.lineWidth = size;
            ctx.stroke();

            ctx.closePath();

            // Update the last position to reference the current position
            lastX = x;
            lastY = y;
        }

        // Clear the canvas context using the canvas width and height
        function clearCanvas(canvas, ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            document.getElementById('rightside').innerHTML = '';
            document.getElementById('rightsidePosibility').innerHTML = '';
        }

        // Keep track of the mouse button being pressed and draw a dot at current location
        function sketchpad_mouseDown() {
            mouseDown = 1;
            drawLine(ctx, mouseX, mouseY, 12);
        }

        // Keep track of the mouse button being released
        function sketchpad_mouseUp() {
            mouseDown = 0;

            // Reset lastX and lastY to -1 to indicate that they are now invalid, since we have lifted the "pen"
            lastX = -1;
            lastY = -1;
        }

        // Keep track of the mouse position and draw a dot if mouse button is currently pressed
        function sketchpad_mouseMove(e) {
            // Update the mouse co-ordinates when moved
            getMousePos(e);

            // Draw a dot if the mouse button is currently being pressed
            if (mouseDown == 1) {
                drawLine(ctx, mouseX, mouseY, 12);
            }
        }

        // Get the current mouse position relative to the top-left of the canvas
        function getMousePos(e) {
            if (!e)
                var e = event;

            if (e.offsetX) {
                mouseX = e.offsetX;
                mouseY = e.offsetY;
            }
            else if (e.layerX) {
                mouseX = e.layerX;
                mouseY = e.layerY;
            }
        }

        // Draw something when a touch start is detected
        function sketchpad_touchStart() {
            // Update the touch co-ordinates
            getTouchPos();

            drawLine(ctx, touchX, touchY, 12);

            // Prevents an additional mousedown event being triggered
            event.preventDefault();
        }

        function sketchpad_touchEnd() {
            // Reset lastX and lastY to -1 to indicate that they are now invalid, since we have lifted the "pen"
            lastX = -1;
            lastY = -1;
        }

        // Draw something and prevent the default scrolling when touch movement is detected
        function sketchpad_touchMove(e) {
            // Update the touch co-ordinates
            getTouchPos(e);

            // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
            drawLine(ctx, touchX, touchY, 12);

            // Prevent a scrolling action as a result of this touchmove triggering.
            event.preventDefault();
        }

        // Get the touch position relative to the top-left of the canvas
        // When we get the raw values of pageX and pageY below, they take into account the scrolling on the page
        // but not the position relative to our target div. We'll adjust them using "target.offsetLeft" and
        // "target.offsetTop" to get the correct values in relation to the top left of the canvas.
        function getTouchPos(e) {
            if (!e)
                var e = event;

            if (e.touches) {
                if (e.touches.length == 1) { // Only deal with one finger
                    var touch = e.touches[0]; // Get the information for finger #1
                    touchX = touch.pageX - touch.target.offsetLeft;
                    touchY = touch.pageY - touch.target.offsetTop;
                }
            }
        }


        // Set-up the canvas and add our event handlers after the page has loaded
        async function init() {
            // Get the specific canvas element from the HTML document
            canvas = document.getElementById('sketchpad');

            // If the browser supports the canvas tag, get the 2d drawing context for this canvas
            if (canvas.getContext)
                ctx = canvas.getContext('2d');

            // Check that we have a valid context to draw on/with before adding event handlers
            if (ctx) {
                // React to mouse events on the canvas, and mouseup on the entire document
                canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
                canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
                window.addEventListener('mouseup', sketchpad_mouseUp, false);

                // React to touch events on the canvas
                canvas.addEventListener('touchstart', sketchpad_touchStart, false);
                canvas.addEventListener('touchend', sketchpad_touchEnd, false);
                canvas.addEventListener('touchmove', sketchpad_touchMove, false);
            }
            model = await tf.loadModel('model.json');
        }

        function predictFromNodeJs(){
            const imageData = ctx.getImageData(0, 0, 140, 140);

            //convert to tensor
            var tfImg = tf.fromPixels(imageData, 1);
            var smalImg = tf.image.resizeBilinear(tfImg, [28, 28]);
            smalImg = tf.cast(smalImg, 'float32');
            var tensor = smalImg.expandDims(0);
            var tensorRes = tensor.div(tf.scalar(255));

            var tensorBuffer = tensorRes.buffer();
            console.log(tensorBuffer);

            var tensorDataArray = new Array(tensorBuffer.values.length);

            for (var i = 0 ; i < tensorBuffer.values.length; i++ ){
              tensorDataArray[i] = tensorBuffer.values[i]
            }

            var newJson = {
                "data":{
                    "names": ["x1", "x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10", "x11", "x12", "x13", "x14", "x15", "x16", "x17", "x18", "x19", "x20", "x21", "x22", "x23", "x24", "x25", "x26", "x27", "x28", "x29", "x30", "x31", "x32", "x33", "x34", "x35", "x36", "x37", "x38", "x39", "x40", "x41", "x42", "x43", "x44", "x45", "x46", "x47", "x48", "x49", "x50", "x51", "x52", "x53", "x54", "x55", "x56", "x57", "x58", "x59", "x60", "x61", "x62", "x63", "x64", "x65", "x66", "x67", "x68", "x69", "x70", "x71", "x72", "x73", "x74", "x75", "x76", "x77", "x78", "x79", "x80", "x81", "x82", "x83", "x84", "x85", "x86", "x87", "x88", "x89", "x90", "x91", "x92", "x93", "x94", "x95", "x96", "x97", "x98", "x99", "x100", "x101", "x102", "x103", "x104", "x105", "x106", "x107", "x108", "x109", "x110", "x111", "x112", "x113", "x114", "x115", "x116", "x117", "x118", "x119", "x120", "x121", "x122", "x123", "x124", "x125", "x126", "x127", "x128", "x129", "x130", "x131", "x132", "x133", "x134", "x135", "x136", "x137", "x138", "x139", "x140", "x141", "x142", "x143", "x144", "x145", "x146", "x147", "x148", "x149", "x150", "x151", "x152", "x153", "x154", "x155", "x156", "x157", "x158", "x159", "x160", "x161", "x162", "x163", "x164", "x165", "x166", "x167", "x168", "x169", "x170", "x171", "x172", "x173", "x174", "x175", "x176", "x177", "x178", "x179", "x180", "x181", "x182", "x183", "x184", "x185", "x186", "x187", "x188", "x189", "x190", "x191", "x192", "x193", "x194", "x195", "x196", "x197", "x198", "x199", "x200", "x201", "x202", "x203", "x204", "x205", "x206", "x207", "x208", "x209", "x210", "x211", "x212", "x213", "x214", "x215", "x216", "x217", "x218", "x219", "x220", "x221", "x222", "x223", "x224", "x225", "x226", "x227", "x228", "x229", "x230", "x231", "x232", "x233", "x234", "x235", "x236", "x237", "x238", "x239", "x240", "x241", "x242", "x243", "x244", "x245", "x246", "x247", "x248", "x249", "x250", "x251", "x252", "x253", "x254", "x255", "x256", "x257", "x258", "x259", "x260", "x261", "x262", "x263", "x264", "x265", "x266", "x267", "x268", "x269", "x270", "x271", "x272", "x273", "x274", "x275", "x276", "x277", "x278", "x279", "x280", "x281", "x282", "x283", "x284", "x285", "x286", "x287", "x288", "x289", "x290", "x291", "x292", "x293", "x294", "x295", "x296", "x297", "x298", "x299", "x300", "x301", "x302", "x303", "x304", "x305", "x306", "x307", "x308", "x309", "x310", "x311", "x312", "x313", "x314", "x315", "x316", "x317", "x318", "x319", "x320", "x321", "x322", "x323", "x324", "x325", "x326", "x327", "x328", "x329", "x330", "x331", "x332", "x333", "x334", "x335", "x336", "x337", "x338", "x339", "x340", "x341", "x342", "x343", "x344", "x345", "x346", "x347", "x348", "x349", "x350", "x351", "x352", "x353", "x354", "x355", "x356", "x357", "x358", "x359", "x360", "x361", "x362", "x363", "x364", "x365", "x366", "x367", "x368", "x369", "x370", "x371", "x372", "x373", "x374", "x375", "x376", "x377", "x378", "x379", "x380", "x381", "x382", "x383", "x384", "x385", "x386", "x387", "x388", "x389", "x390", "x391", "x392", "x393", "x394", "x395", "x396", "x397", "x398", "x399", "x400", "x401", "x402", "x403", "x404", "x405", "x406", "x407", "x408", "x409", "x410", "x411", "x412", "x413", "x414", "x415", "x416", "x417", "x418", "x419", "x420", "x421", "x422", "x423", "x424", "x425", "x426", "x427", "x428", "x429", "x430", "x431", "x432", "x433", "x434", "x435", "x436", "x437", "x438", "x439", "x440", "x441", "x442", "x443", "x444", "x445", "x446", "x447", "x448", "x449", "x450", "x451", "x452", "x453", "x454", "x455", "x456", "x457", "x458", "x459", "x460", "x461", "x462", "x463", "x464", "x465", "x466", "x467", "x468", "x469", "x470", "x471", "x472", "x473", "x474", "x475", "x476", "x477", "x478", "x479", "x480", "x481", "x482", "x483", "x484", "x485", "x486", "x487", "x488", "x489", "x490", "x491", "x492", "x493", "x494", "x495", "x496", "x497", "x498", "x499", "x500", "x501", "x502", "x503", "x504", "x505", "x506", "x507", "x508", "x509", "x510", "x511", "x512", "x513", "x514", "x515", "x516", "x517", "x518", "x519", "x520", "x521", "x522", "x523", "x524", "x525", "x526", "x527", "x528", "x529", "x530", "x531", "x532", "x533", "x534", "x535", "x536", "x537", "x538", "x539", "x540", "x541", "x542", "x543", "x544", "x545", "x546", "x547", "x548", "x549", "x550", "x551", "x552", "x553", "x554", "x555", "x556", "x557", "x558", "x559", "x560", "x561", "x562", "x563", "x564", "x565", "x566", "x567", "x568", "x569", "x570", "x571", "x572", "x573", "x574", "x575", "x576", "x577", "x578", "x579", "x580", "x581", "x582", "x583", "x584", "x585", "x586", "x587", "x588", "x589", "x590", "x591", "x592", "x593", "x594", "x595", "x596", "x597", "x598", "x599", "x600", "x601", "x602", "x603", "x604", "x605", "x606", "x607", "x608", "x609", "x610", "x611", "x612", "x613", "x614", "x615", "x616", "x617", "x618", "x619", "x620", "x621", "x622", "x623", "x624", "x625", "x626", "x627", "x628", "x629", "x630", "x631", "x632", "x633", "x634", "x635", "x636", "x637", "x638", "x639", "x640", "x641", "x642", "x643", "x644", "x645", "x646", "x647", "x648", "x649", "x650", "x651", "x652", "x653", "x654", "x655", "x656", "x657", "x658", "x659", "x660", "x661", "x662", "x663", "x664", "x665", "x666", "x667", "x668", "x669", "x670", "x671", "x672", "x673", "x674", "x675", "x676", "x677", "x678", "x679", "x680", "x681", "x682", "x683", "x684", "x685", "x686", "x687", "x688", "x689", "x690", "x691", "x692", "x693", "x694", "x695", "x696", "x697", "x698", "x699", "x700", "x701", "x702", "x703", "x704", "x705", "x706", "x707", "x708", "x709", "x710", "x711", "x712", "x713", "x714", "x715", "x716", "x717", "x718", "x719", "x720", "x721", "x722", "x723", "x724", "x725", "x726", "x727", "x728", "x729", "x730", "x731", "x732", "x733", "x734", "x735", "x736", "x737", "x738", "x739", "x740", "x741", "x742", "x743", "x744", "x745", "x746", "x747", "x748", "x749", "x750", "x751", "x752", "x753", "x754", "x755", "x756", "x757", "x758", "x759", "x760", "x761", "x762", "x763", "x764", "x765", "x766", "x767", "x768", "x769", "x770", "x771", "x772", "x773", "x774", "x775", "x776", "x777", "x778", "x779", "x780", "x781", "x782", "x783", "x784"],
                    "tensor": {
                        shape: [1, 28, 28, 1],
                        values: tensorDataArray
                    },
                }
            }
            try{

                var JsonString = "json=" + JSON.stringify(newJson)
                console.log(tensorDataArray.length);
                console.log(28*28);

                 var URL = "http://localhost:5000/predict";  //Your URL

                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("POST", URL, false);

                xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlhttp.withCredentials = false;

                xmlhttp.send(JsonString);

                const resp = xmlhttp.responseText;
                console.log(resp);
               
                    const sJson = JSON.parse(resp);
                    console.log(sJson);

                    const arr = sJson.data.tensor.values
                    var max = 0;
                    var result = 0;
                     for (i = 0; i < arr.length; i++) {                    
                        console.log( arr[i]);
                        if(max < arr[i]){
                          max = arr[i];
                          result = i;
                        }
                    }
                  console.log("Max: " + max);
                  console.log("Number predicted: " + result);
                  document.getElementById('rightside').innerHTML = '<p><h1>' + result +'</h1></p>';
                  document.getElementById('rightsidePosibility').innerHTML = '<p><h2>' + max + '</h2></p>';
                  
              }catch(err){
                console.log(err);
                console.log(err.message)
                document.getElementById('rightside').innerHTML = err.message;
              }
        }

        function predict() {
            const imageData = ctx.getImageData(0, 0, 140, 140);

            //convert to tensor
            var tfImg = tf.fromPixels(imageData, 1);
            var smalImg = tf.image.resizeBilinear(tfImg, [28, 28]);
            smalImg = tf.cast(smalImg, 'float32');
            var tensor = smalImg.expandDims(0);
            tensor = tensor.div(tf.scalar(255));
            //var xhttp = new XMLHttpRequest();

           // document.getElementById('rightside').innerHTML = tensor




            const userAction = async () => {
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                body: myBody, // string or object
                headers:{
                  'Content-Type': 'application/x-www-form-urlencoded'
                }
              });

              const myJson = await response.json(); //extract JSON from the http response
              // do something with myJson 
              console.log(myJson);
              document.getElementById('rightside').innerHTML = myJson
            }


       /*     const prediction = model.predict(tensor);
            const predictedValues = prediction.dataSync();
            var isThereAnyPrediction = false;
            for (index = 0; index < predictedValues.length; index++) {
                if (predictedValues[index] > 0.5) {
                    isThereAnyPrediction = true;
                    document.getElementById('rightside').innerHTML = '<br/>Predicted Number: ' + index;
                }
            }
            if (!isThereAnyPrediction) {
                document.getElementById('rightside').innerHTML = '<br>Unable to Predict';
            }*/
        }