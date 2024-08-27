// const express = require('express')
// const app = express()
// const { readDataFromExcelFile,writetoExcel,removeRowById ,updateNameById} = require('../services/excelManipulation.services');
// app.use(express.json())
// var cors = require('cors');
// app.use(cors());


document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");


    let btnscr = document.getElementById('btnscrl');
    let btnAdd = document.getElementById('btn');
    let input = document.getElementById('todo-input');
    let list = document.getElementById('todo-list');
    let dropdown = document.getElementById('priority-select');
    let high = document.getElementById('high');
    let low = document.getElementById('low');
    let medium = document.getElementById('medium');
    let notfilter = document.getElementById('toutlist');
    let searchh = document.getElementById('search');
    let storegee = [];
    var array = [];

    btnAdd.addEventListener('click', function () {
        addlist();
    });

    btnAdd.addEventListener('click', function () {

    });

    btnAdd.classList.add('addlist');

    //lal scroll
    window.onscroll = function () {
        scrol();
    }

    //refresh
    window.onload = function () {
        refresh();
    };

    //button el filter
    high.addEventListener('click', function () {
        filter('high')
    });
    low.addEventListener('click', function () {
        filter('low')
    });
    medium.addEventListener('click', function () {
        filter('medium')
    });
    notfilter.addEventListener('click', function () {
        refresh();
    });


    //function el search 
    searchh.onkeydown = function () {
        if (searchh.value) {
            filter(searchh.value)
        }

    };

    //creat element to list
    function printlist(array) {

        array.forEach(function (item, index) {

            console.log(`mawjud sar  :`, array);
            let deletee = document.createElement('button');
            deletee.setAttribute('class', 'delete');
            deletee.textContent = 'delete';
            let update = document.createElement('button');
            update.setAttribute('class', 'update');
            update.textContent = 'update';
            let li = document.createElement('li');
            li.setAttribute('class', 'lii');

            console.log("item:" + array.item);
            li.innerText = item.Item + "-" + item.Priority;

            let check = document.createElement('input');
            check.type = 'checkbox';
            check.setAttribute('class', 'checkbox');

            li.appendChild(check);
            li.appendChild(deletee);
            li.appendChild(update);

            console.log('new:' + li.innerHTML)
            list.appendChild(li);
            console.log(item, index);
            check.onclick = function () {

                if (check.checked == true) {
                    li.style.textDecoration = 'line-through';
                }
                else {

                    li.style.textDecoration = 'none';
                }
            }
            update.addEventListener('click', function () {
                if (update.textContent == 'update') {
                    let up = li.firstChild.textContent.split('-');;
                    input.value = up[0];
                    update.textContent = 'save';
                }
                else {

                    if (input.value != "") {
                        console.log('li:' + li.firstChild.textContent)
                        // let d = li.innerText.split('de');
                        // i = array.indexOf(d[0]);
                        fetch('http://localhost:3000/UpdateTodo/', { // Replace with your API endpoint
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                "filepath": "todolist.xlsx",
                                "itemColomn": "Item",
                                "item": array[index].Item,
                                "newitem": input.value,
                                "newpriority": dropdown.value
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log('Success:', data);
                                // Handle success (e.g., display a message to the user)
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                // Handle error (e.g., display an error message)
                            });

                        array[index] = { item: input.value, priority: dropdown.value };
                        li.firstChild.textContent = input.value + '-' + dropdown.value;
                        input.value = '';
                        update.textContent = 'update';
                        input.focus();
                    }
                }

            });

            deletee.addEventListener('click', function () {
                let ind;
                let str = li.firstChild.textContent;
                str = str.split('-');
                str = str[0];
                console.log('first:' + str);
                for (let i = 0; i < array.length; i++) {
                    if (array[i].Item == str) {
                        ind = i;
                    }
                }
                li.remove();
                li.innerHTML = "";
                console.log("the value deleted is: " + array[ind].Item);
                // i = array.indexOf(array.name);
                console.log('index:' + ind);

                fetch('http://localhost:3000/DeleteTodo/', { // Replace with your API endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        filepath: 'todolist.xlsx',
                        itemColomn: 'Item',
                        item: array[ind].Item
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Success:', data);
                        // Handle success (e.g., display a message to the user)
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        // Handle error (e.g., display an error message)
                    });
                array.splice(ind, 1);
                console.log("sar:", array);
            });
        })
    }
    //localstorage
    async function refresh() {
        fetch('http://localhost:3000/getAllItems/', { // Replace with your API endpoint
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                savelist(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }

    //savelist 
    function savelist(array) {
            list.innerHTML = "";
            printlist(array);
            input.value = "";
            input.focus()
    }

    ////add to list
    function addlist() {   
            // array.length=0;
            console.log("fee:", storegee)
            list.innerHTML = "";
            array = storegee;
            array.push({ item: input.value, priority: dropdown.value });
            printlist(array);//function add to list
            input.value = "";
            input.focus();
    };

    //filter 
    function filter(namess) {
        let disp = [];
        let exist = 0;
        for (let i = 0; i < storegee.length; i++) {
            console.log("fi:" + storegee[0].priority.includes(namess));
            if (storegee[i].importance.includes(namess) || storegee[i].name.includes(namess)) {
                console.log('eeeeeeeee');
                disp.push({ item: storegee[i].name, priority: storegee[i].importance });
                console.log('dsp howe:' + disp);
                exist++;
            }
        }
        if (exist != 0) {
            console.log('disp:', disp);
            filterlist(disp);
        }
    }

    //lal filter
    function filterlist(disp) {
        list.innerHTML = "";

        console.log('array is:', disp)
        
        printlist(disp);
        localStorage.setItem('todo-list', JSON.stringify(storegee));
    }

    //scroll
    function scrol() {
        if (scrollY >= 400) {
            btnscr.style.display = 'block';

        }
        else {
            btnscr.style.display = 'none';
        }
    }

    btnscr.onclick = function () {
        scroll({
            left: 0,
            top: 0,
            behavior: 'smooth'
        })
    }
});
