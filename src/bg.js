chrome.storage.session.set({ lastTimestamp: 0 });
chrome.storage.session.set({ queue: 0 });
chrome.storage.session.set({ authToken: "" });

chrome.action.setBadgeBackgroundColor({color: '#e71818'});
chrome.action.setBadgeText({text: ""});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
console.log(request);
    if (request.type == "getExecTimeStamp") {
        chrome.storage.session.get(["authToken"]).then((result) => {
            if(result.authToken != ""){
                chrome.storage.session.get(["lastTimestamp"]).then((result) => {
                    let lastTimestamp = result.lastTimestamp;
                    let timeOffset = 2;   // In minutes
                    let newTimeStamp;
                    
                    let currentTimeStamp = new Date().getTime();
        
                    if (lastTimestamp == 0 || lastTimestamp <= currentTimeStamp) {
                        newTimeStamp = new Date(currentTimeStamp + timeOffset * 60000).getTime();
                    }else{
                        newTimeStamp = new Date(lastTimestamp + timeOffset * 60000).getTime();
                    }
        
                    chrome.storage.session.set({ lastTimestamp: newTimeStamp });

                    chrome.storage.session.set({ lastTimestamp: newTimeStamp });
                    chrome.storage.session.get(["queue"]).then((result) => {
                        chrome.storage.session.set({ queue: result.queue + 1 });
                        chrome.action.setBadgeText({text: `${result.queue + 1}`});
                        sendResponse(`${newTimeStamp}`);
                    });
                });
            }else{
                sendResponse(false);
            }
        });
    }

    if(request.type == "taskComplete"){
        chrome.storage.session.get(["queue"]).then((result) => {
            chrome.storage.session.set({ queue: result.queue - 1 });
            chrome.action.setBadgeText({text: `${result.queue - 1}`});
        });  
    }

    if(request.type == "auth"){
        let auth_token = request.val;
        chrome.storage.session.set({authToken: auth_token});
        sendResponse("success");   
    }

    if(request.type == "getAuthToken"){
        chrome.storage.session.get(["authToken"]).then((result) => {
            sendResponse(result.authToken);  
        }); 
    }

    if(request.type == "logout"){
        chrome.storage.session.set({authToken: ""});
        sendResponse("success");   
    }

    if(request.type == "isLogged"){
        chrome.storage.session.get(["authToken"]).then((result) => {
            if(result.authToken != ""){
                sendResponse("true");
            }else{
                sendResponse("false");
            }
        });
    }

    return true;
});



