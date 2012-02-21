importScripts('libraries/LZWEncoder.js', 'libraries/NeuQuant.js', 'libraries/GIFEncoder.js');

var encoder;

self.onmessage = function(e) {
    switch(e.data.type) {
        case 'setup': {
            doSetup(e.data.opts);
        } break;
        case 'addFrame': {
            doAddFrame(e.data.imagedata);
        } break;
        case 'finish': {
            doFinish();
        } break;
    }
}

doSetup = function(opts) {
    encoder = new GIFEncoder();
    encoder.setRepeat(opts.repeat);
    encoder.setDelay(opts.delay);
    encoder.setSize(opts.width, opts.height);
    encoder.setQuality(21 - (20 * (opts.quality / 10)));
    encoder.start();
    self.postMessage({status: 'setupDone'});
}

doAddFrame = function(imagedata) {
    encoder.addFrame(imagedata.data, true);
    self.postMessage({status: 'addFrameDone'});
}

doFinish = function() {
    encoder.finish();

    var imagedata = encoder.stream().getData();
    self.postMessage({status: 'complete', imagedata: imagedata});
}
