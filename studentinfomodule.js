const productsdb = (dbname, table) => {
    const db = new Dexie(dbname);
    db.version(1).stores(table);
    db.open();

    return db;
    /**
    * const db = new Dexie('myDb');
        db.version(1).stores({
        friends: `name, age`
      });
    */
};

const bulkcreate = (dbtable, data) => {
    let flag = empty(data);
    if (flag) {
        dbtable.bulkAdd([data]);
        console.log("Data Inserted Successfully...!");
    } else {
        console.log("Please Provide Data...!");
    }
    return flag;
};

// Creating Dynamic Elements
const createEle = (tagname, appendTo, fn) => {
    const element = document.createElement(tagname);
    if (appendTo) appendTo.appendChild(element);
    if (fn) fn(element);
};

// Checking Textbox Validation
const empty = object => {
    let flag = false;
    for (const value in object) {
        if (object[value] != "" && object.hasOwnProperty(value)) {
            flag = true;
        } else {
            flag = false;
        }
    }
    return flag;
};

// getData from its Database
const getData = (dbname, fn) => {
    let index = 0;
    let obj = {};
    dbname.count(count => {
        // Count rows in the table using count method
        if (count) {
            dbname.each(table => {
                /* table => return the table object data
                to arrange order we are going to create for in loop */
                obj = SortObj(table);
                fn(obj, index++); // calling the function w/ data argument
            });
        } else {
            fn(0);
        }
    });
};

const SortObj = (sortobj) => {
    let obj = {};
    obj = {
        id: sortobj.id,
        name: sortobj.name,
        studentgrdsection: sortobj.studentgrdsection,
        sbjattendance: sortobj.sbjattendance
    };
    return obj;
};

export default productsdb;
export {
    bulkcreate,
    createEle,
    getData,
    SortObj
};