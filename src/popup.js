// shafique.hasan@gmail.com
// rana68793311

chrome.runtime.sendMessage({ type: "isLogged" }, function (res) {
    if (res == "true") {
        document.querySelector("body").classList.add("logged-in");
    }
});

document.querySelector(".form-wrapper button").addEventListener("click", async function () {
    let btn = this;
    let email = document.querySelector("input[name=email]").value.trim();
    let pwd = document.querySelector("input[name=pwd]").value.trim();

    if (email != "" && pwd != "") {
        btn.disabled = true;
        document.querySelector(".loader").classList.add("active");

        try {
            let ip = await fetch("https://ipinfo.io/?format=jsonp&callback=");
                ip = await ip.json();
            let country = ip.country;

            if (country == "BD") {
                fetch("https://autoclick-eta.vercel.app/user/login", {
                    "headers": {
                        "content-type": "application/json; charset=utf-8"
                    },
                    "method": "POST",
                    "body": `{\"email\": "${email}",\"password\": "${pwd}"}`
                })
                    .then(e => e.json())
                    .then(function (res) {
                        if (res.status == "success") {
                            // Success
                            chrome.runtime.sendMessage({ type: "auth", val: res.token }, function (res) {
                                if (res == "success") {
                                    document.querySelector("input[name=email]").value = "";
                                    document.querySelector("input[name=pwd]").value = "";
                                    document.querySelector("body").classList.add("logged-in");
                                }
                            });
                        } else {
                            // Error
                            alert("Invalid User");
                        }

                        btn.disabled = false;
                        document.querySelector(".loader").classList.remove("active");
                    })
                    .catch(function () {
                        alert("Something Went Wrong");
                    });
            }
        } catch (err) {
            alert("Network Error");
        }

    }
});


document.querySelector(".content-wrapper button").addEventListener("click", function () {
    let btn = this;

    chrome.runtime.sendMessage({ type: "getAuthToken" }, function (res) {
        let token = res;

        if (token != "") {
            btn.disabled = true;
            document.querySelector(".loader").classList.add("active");

            fetch("https://autoclick-eta.vercel.app/user/logout", {
                "headers": {
                    "authorization": `Bearer ${token}`
                },
                "method": "GET"
            })
                .then(e => e.json())
                .then(function (res) {
                    if (res.status == "success") {
                        // Success
                        chrome.runtime.sendMessage({ type: "logout" }, function (res) {
                            if (res) {
                                document.querySelector("body").classList.remove("logged-in");
                                console.log(res);
                            }
                        });
                    } else {
                        // Error
                        alert("Invalid Request")
                    }

                    btn.disabled = false;
                    document.querySelector(".loader").classList.remove("active");
                })
                .catch(function () {
                    alert("Something Went Wrong");
                });
        }

    });
});


