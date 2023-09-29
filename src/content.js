chrome.runtime.sendMessage({ type: "getExecTimeStamp"}, function (res) {
    if(res){
        let t1 = new Date().getTime();
        let t2 = parseInt(res);
        let diff = t2 - t1;
        
        setTimeout(function () {
            let targetElem = document.querySelector(".pvs-profile-actions button.pvs-profile-actions__action");
        
            if(targetElem){
                document.querySelector(".pvs-profile-actions button.pvs-profile-actions__action").click();
                //document.querySelector(".pvs-profile-actions button.pvs-profile-actions__action").style.background = "#000";
                
                chrome.runtime.sendMessage({ type: "taskComplete"});
            }else{
                setTimeout((targetElem) => {
                    if(targetElem){
                        document.querySelector(".pvs-profile-actions button.pvs-profile-actions__action").click();
                        //document.querySelector(".pvs-profile-actions button.pvs-profile-actions__action").style.background = "#000";

                        chrome.runtime.sendMessage({ type: "taskComplete"});

                    }
                }, 10000, targetElem);
            }
        }, diff);
    }
});


