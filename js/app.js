const webAR = new WebAR(1000, '/webar/recognize');

const threeHelper = new ThreeHelper();

document.querySelector('#openCamera').addEventListener('click', function(){
    
}, false);

function OpenCamerafunc() {
    const videoSetting = {width: 480, height: 360};

    const video = document.querySelector('#video');
    const videoDevice = document.querySelector('#videoDevice');

    const openCamera = (video, deviceId, videoSetting) => {
        webAR.openCamera(video, deviceId, videoSetting)
            .then((msg) => {
                let videoWidth = video.offsetWidth;
                let videoHeight = video.offsetHeight;

                if (window.innerWidth < window.innerHeight) {
                    if (videoHeight < window.innerHeight) {
                        video.setAttribute('height', window.innerHeight.toString() +'px');
                    }
                }  else {
                    if (videoWidth < window.innerWidth) {
                        video.setAttribute('width', window.innerWidth.toString() +'px');
                    }
                }
            })
            .catch((err) => {
                alert(err);
                alert('Open video device failure');
            });
    };

    webAR.listCamera(videoDevice)
        .then(() => {
            openCamera(video, videoDevice.value, videoSetting);
            videoDevice.onchange = () => {
                openCamera(video, videoDevice.value, videoSetting);
            };

            document.querySelector('#openCamera').style.display = 'none';
            document.querySelector('#start').style.display = 'inline-block';
            document.querySelector('#stop').style.display = 'inline-block';
        })
        .catch((err) => {
            console.info(err);
            alert('Unaccountable video device');
        });
}

document.querySelector('#start').addEventListener('click', () => {
    startRec();
    document.getElementById("start").style.display = "none";
}, false);

document.addEventListener("DOMContentLoaded", function(event) { 
  OpenCamerafunc()
});

function startRec() {
    webAR.startRecognize((msg) => {
        threeHelper.loadObject('asset/model/'+msg.name+'.fbx');
        webAR.trace('Recognized');
    });
}

document.querySelector('#stop').addEventListener('click', () => {
    
    webAR.trace('Delete');

    threeHelper.removeObject();
    webAR.stopRecognize();    
    startRec();
}, false);
