function start() {
  var webVRCommon = new WebVRCommon({
    layerSourceId: 'webgl-canvas',
    messageElementId: 'messages',
  });

  var panos = [];
  var currentPano = 0;

  // These factory methods create different types of Panos.
  var createPano = [
    function () {
      return new Pano(webVRCommon, {
        src: "img/LAB.JPG",
        stereoMode: Pano.MONO
      });
    }
  ];

  // If you swipe left/right on the Gear VR, or press left/right on the keyboard,
  // we cycle between panos.
  var oninput = function (direction) {
    switch (direction) {
      case 'left':
        currentPano = (currentPano - 1 + createPano.length) % createPano.length;
        break;
      case 'right':
        currentPano = (currentPano + 1) % createPano.length;
        break;
    }
  };

  // Helper for detecting swipes on the Gear VR touch pad.
  gamepad = new GamepadState();
  gamepad.ongearvrinput = oninput;

  // When run in the browser, the keyboard emulates Gear VR swipes
  window.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37:
        oninput('left');
        break;
      case 39:
        oninput('right');
        break;
    }
  };

  // Every frame we need to detect input events.
  webVRCommon.update = function (time) {
    gamepad.update(time);
  };

  webVRCommon.render = function (projectionMat, viewMat, eye) {
    // delay create the pano
    if (!panos[currentPano]) {
      panos[currentPano] = createPano[currentPano]();
    }

    var context = {
      projectionMat: projectionMat,
      viewMat: viewMat,
      eye: eye
    };

    // render the current pano
    panos[currentPano].render(context);
  };

  webVRCommon.start();
}