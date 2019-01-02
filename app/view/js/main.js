document.querySelector('.ajax-form').addEventListener('submit', function(e) {
    e.preventDefault();

    let formData = new FormData(this);

    let parsedData = {};
    for(let name of formData) {
        if (typeof(parsedData[name[0]]) == "undefined") {
            let tempdata = formData.getAll(name[0]);
            if (tempdata.length > 1) {
                parsedData[name[0]] = tempdata;
            } else {
                parsedData[name[0]] = tempdata[0];
            }
        }
    }

    let options = {};
    options.body = JSON.stringify(parsedData);
    options.method = "POST"
    options.headers = {
        "Content-Type": "application/json"
    }
    fetch(this.action, options).then(r => r.json()).then(data => {
    });

});