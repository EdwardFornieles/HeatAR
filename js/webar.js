const WebAR = function(interval, recognizeUrl) {
    var interval = interval;
    var recognizeUrl = recognizeUrl;

    var videoSetting = {width: 320, height: 240};
    var videoElement = null;
    var videoDeviceElement = null;

    var canvasElement = null;
    var canvasContext = null;

    var timer = null;
    var isRecognizing = false;

    var debug = document.createElement('div');
    debug.setAttribute('id', 'debug');
    debug.setAttribute('width', (window.innerWidth / 2).toString());
    debug.setAttribute('height', window.innerHeight.toString());
    document.body.appendChild(debug);

    this.listCamera = function(videoDevice) {
        videoDeviceElement = videoDevice;

        return new Promise((resolve, reject) => {
            navigator.mediaDevices.enumerateDevices()
                .then((devices) => {
                    devices.find((device) => {
                        if (device.kind === 'videoinput') {
                            const option = document.createElement('option');
                            option.text = device.label || 'camera '+ (videoDeviceElement.length + 1).toString();
                            option.value = device.deviceId;

                            videoDeviceElement.appendChild(option);
                        }
                    });

                    if (videoDeviceElement.length === 0) {
                        reject('Camera not found');
                    } else {
                        videoDeviceElement.style.display = 'inline-block';

                        canvasElement = document.createElement('canvas');
                        canvasContext = canvasElement.getContext('2d');

                        resolve(true);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    this.openCamera = function(video, deviceId, setting) {
        videoElement = video;
        if (setting) {
            videoSetting = setting;
        }

        const constraints = {
            audio: false,
            video: {deviceId: {exact: deviceId}}
        };

        canvasElement.setAttribute('width', videoSetting.width + 'px');
        canvasElement.setAttribute('height', videoSetting.height + 'px');

        if (videoElement.srcObject) {
            videoElement.srcObject.getTracks().forEach((track) => {
                track.stop();
            });
        }

        return new Promise((resolve, reject) => {
            navigator.mediaDevices.getUserMedia(constraints)
                .then((stream) => {
                    videoElement.srcObject = stream;
                    videoElement.style.display = 'block';
                    videoElement.onloadedmetadata = function(){
                        resolve(true);
                    };
                    videoElement.play();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    this.captureVideo = function() {
        canvasContext.drawImage(videoElement, 0, 0, videoSetting.width, videoSetting.height);
        return canvasElement.toDataURL('image/jpeg', 0.5).split('base64,')[1];
    };

    this.startRecognize = function(callback) {
        timer = window.setInterval(() => {
            if (isRecognizing) return;

            isRecognizing = true;

            const image = {image: this.captureVideo()};

            this.httpPost(recognizeUrl, image)
                .then((msg) => {
                    this.stopRecognize();

                    callback(msg);
                })
                .catch((err) => {
                    isRecognizing = false;
                    //this.trace(err);
                });
        }, interval);
    };

    this.stopRecognize = function() {
        if (timer) {
            window.clearInterval(timer);
            isRecognizing = false;
        }
    };

    this.httpPost = function(url, image) {
        return new Promise((resolve, reject) => {
            const http = new XMLHttpRequest();
            http.onload = () => {
                try {
                    const msg = JSON.parse(http.responseText);
                    if (http.status === 200) {
                        if (msg.statusCode === 0) {
                            resolve(msg.result);
                        } else {
                            reject(msg);
                        }
                    } else {
                        reject(msg);
                    }
                } catch (err) {
                    reject(err);
                }
            };
            http.onerror = (err) => {
                reject(err);
            };

            http.open('POST', url);
            http.setRequestHeader('Content-Type', 'application/json;Charset=UTF-8');
            http.send(JSON.stringify(image))
        });
    };

    this.trace = function(arg) {

        if(arg == 'Delete')
        {
            debug.innerHTML = '';                
        }else{
            if (typeof arg === 'string') {
                debug.innerHTML += arg;
            } else {
                debug.innerHTML += JSON.stringify(arg);
            }
            debug.innerHTML += '<br />';
        }
    };
};