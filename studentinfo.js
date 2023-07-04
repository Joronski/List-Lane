import prodb, {
    bulkcreate,
    createEle,
    getData,
    SortObj
} from "./studentinfomodule.js";

let db = prodb("Productdb", {
    products: `++id, name, studentgrdsection, sbjattendance`
});

// Input Tags
const userid = document.getElementById("userid");
const proname = document.getElementById("proname");
const studentgrdsection = document.getElementById("studentgrdsection");
const sbjattendance = document.getElementById("sbjattendance");

// Creating the button
const btncreate = document.getElementById("btn-create");
const btnread = document.getElementById("btn-read");
const btnupdate = document.getElementById("btn-update");
const btndelete = document.getElementById("btn-delete");

// User's Data

// Event Listener for the Create Button 
btncreate.onclick = event => {
    // Inserting Values
    let flag = bulkcreate(db.products, {
        name: proname.value,
        studentgrdsection: studentgrdsection.value,
        sbjattendance: sbjattendance.value
    });
    // Reseting textbox values
    // proname.value = "";
    // studentgrdsection.value = "";
    // sbjattendance.value = "";
    proname.value = studentgrdsection.value = sbjattendance.value = "";

    // Setting the id to its textbox value
    getData(db.products, data => {
        userid.value = data.id + 1 || 1;
    });
    table();

    let insertmsg = document.querySelector(".insertmsg");
    getMsg(flag, insertmsg);
};

// Event Listener for the create button
btnread.onclick = table;

// Button update
btnupdate.onclick = () => {
    const id = parseInt(userid.value || 0);
    if (id) {
        // Call dexie update method
        db.products.update(id, {
            name: proname.value,
            studentgrdsection: studentgrdsection.value,
            sbjattendance: sbjattendance.value
        }).then((updated) => {
            // Let get = updated ? `data updated` : `couldn't update data`;
            let get = updated ? true : false;

            // Display message
            let updatemsg = document.querySelector(".updatemsg");
            getMsg(get, updatemsg);

            proname.value = studentgrdsection.value = sbjattendance.value = "";
        });

    } else {
        console.log(`Please Select Id: ${id}`);
    }
}

// Delete Button
btndelete.onclick = () => {
    db.delete();
    db = prodb("Productb", {
        products: `++id, name, studentgrdsection, sbjattendance`
    });
    db.open();
    table();
    textID(userid);

    // Displaying Message
    let deletemsg = document.querySelector(".deletemsg");
    getMsg(true, deletemsg);
};

window.onload = event => {
    // Setting the id textbox value
    textID(userid);
};

// Creating a dynamic table
function table() {
    const tbody = document.getElementById("tbody");
    const notfound = document.getElementById("notfound");
    notfound.textContent = "";

    // Removing all childs from the DOM first
    while (tbody.hasChildNodes()) {
        tbody.removeChild(tbody.firstChild);
    }

    getData(db.products, (data, index) => {
        if (data) {
            createEle("tr", tbody, tr => {
                for (const value in data) {
                    createEle("td", tr, td => {
                        td.textContent = data.sbjattendance === data[value] ? ` ${data[value]}` : data[value];
                    });
                }
                createEle("td", tr, td => {
                    createEle("i", td, i => {
                        i.className += "fas fa-edit btnedit";
                        i.setAttribute(`data-id`, data.id);

                        // Storing the number of edit buttons
                        i.onclick = editbtn;
                    });
                });
                createEle("td", tr, td => {
                    createEle("i", td, i => {
                        i.className += "fas fa-trash-alt btndelete";
                        i.setAttribute(`data-id`, data.id);

                        // Storing the number of edit buttons
                        i.onclick = deletebtn;
                    })
                });
            });
        } else {
            notfound.textContent = "No record found in the database...!";
        }
    });
}

const editbtn = (event) => {
    let id = parseInt(event.target.dataset.id);
    db.products.get(id, function (data) {
        let newdata = SortObj(data);
        userid.value = newdata.id || 0;
        proname.value = newdata.name || "";
        studentgrdsection.value = newdata.studentgrdsection || "";
        sbjattendance.value = newdata.sbjattendance || "";
    });
}

// Delete icon remove element
const deletebtn = event => {
    let id = parseInt(event.target.dataset.id);
    db.products.delete(id);
    table();
}

// Textbix ID
function textID(textboxid) {
    getData(db.products, data => {
        textboxid.value = data.id + 1 || 1;
    });
}

// Function msg
function getMsg(flag, element) {
    if (flag) {
        // Calling the msg
        element.className += " movedown";

        setTimeout(() => {
            element.classList.forEach(classname => {
                classname == "movedown" ? undefined : element.classList.remove('movedown');
            });
        }, 4000);
    }
}