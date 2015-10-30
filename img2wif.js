const fs = require("fs");
const Jimp = require("jimp");
const q = require("q");
const floyd = require("floyd-steinberg");

const w = 264, h = 176;

var imgBuffer = new Buffer((w * h / 8) + 4);

// read in image
var image = new Jimp("test.jpg", function (err, image) {
    this.greyscale().cover(w, h);
    imgBuffer.writeUIntLE(h, 0, 2);
    imgBuffer.writeUIntLE(w, 2, 2);
    
    var bufferPtr = 4;

    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x += 8) {
            var byte = 0;
            for (var bit = 0; bit < 8; bit++) {
                byte += (Jimp.intToRGBA(this.getPixelColor(x + bit, y)).r < 0x80) ? Math.pow(2, bit) : 0;
            }

            imgBuffer.writeUIntLE(byte, bufferPtr, 1);
            bufferPtr++;
        }
    }

    fs.writeFile("test.wif", imgBuffer, function (err) {
        if (err) throw err;
        console.log("I'm done");
    });
});
