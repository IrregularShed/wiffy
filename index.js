const fs = require("fs");
const Jimp = require("jimp");
const q = require("q");

const readfile = q.nfbind(fs.readFile);

// open a WIF
readfile("test images/A/A.WIF").then(function (imgdata) {
    // read the first four bytes to get the size (height, width as words)
    var h = imgdata.readUInt16LE(0);
    var w = imgdata.readUInt16LE(2);

    console.log("Height: " + h + ", width: " + w);

    // create an image to size
    var image = new Jimp(w, h, 0xffffffff, function (err, image) {
        if (err) throw err;
        
        var bytePtr = 4;
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x += 8) {
                var byte = imgdata.readUInt8(bytePtr);
                for (var bit = 0; bit < 8; bit++) {
                    if (byte & Math.pow(2, bit)) {
                        this.setPixelColor(0xff, x + bit, y);
                    }
                }
                bytePtr++;
            }
        }
        
        this.write("a.png", function () {
            console.log("Done");
        })
    });
});
