var todoListWrapper = document.querySelector(".todo-list-wrapper");
var todoList = document.querySelector("ul.todo-list");
var li = todoList.getElementsByTagName("li");
var modal = document.getElementById("add-task-modal");
var itemLeft = 0;

function openModal() {
    modal.style.display = "block";
    todoListWrapper.style.display = "none";
}

function closeModal() {
    modal.style.display = "none";
    todoListWrapper.style.display = "block";
}

// Add task
function addTask() {
    // Parse the JSON stored in allEntriesP
    var existingTasks = JSON.parse(localStorage.getItem("allTasks"));
    if (existingTasks == null) {
        existingTasks = [];
    }
    var taskTitle = document.getElementById("task-title").value;
    var taskDesc = document.getElementById("task-desc").value;
    var taskDate = document.getElementById("task-date").value;
    var taskTime = document.getElementById("task-time").value;
    var taskType = document.querySelector('input[name="task_type"]:checked').value;
    var task = {
        "title": taskTitle,
        "desc": taskDesc,
        "date": taskDate,
        "time": taskTime,
        "type": taskType,
        "done": false
    };
    localStorage.setItem("task", JSON.stringify(task));
    // Save tasks back to local storage
    existingTasks.push(task);
    localStorage.setItem("allTasks", JSON.stringify(existingTasks));
    closeModal();
};

// Modal save button
document.getElementById("saveTaskBtn").addEventListener("click", function() {
    addTask();
    // List of all tasks
    console.log(localStorage.getItem("allTasks"));
    // Last task inserted
    console.log(localStorage.getItem("task"));
});

// populate todo list
const data = JSON.parse(localStorage.getItem("allTasks"));

function createListItem(text) {

    const template = `<li>
  <p class="task-initial"><span>${text.title.charAt(0)}</span></p>
  <h3 class="task-name">${text.title}</h3>
  <p class="task-desc">${text.desc}</p>
  <span class="task-remaining-time">${text.time}</span>
  <span class="task-delete-action">+</span>
  <span class="task-category">${text.type}</span>
  </li>`;

    todoList.insertAdjacentHTML("beforeend", template);
}

// Create list item funtion for each obj in data array
data.forEach(function(element) {
    createListItem(element);
});

function checkIfDone() {
    itemLeft = 0
    for (let i = 0; i < data.length; i++) {
        if (data[i].done) {
            li[i].classList.add("done");
        } else {
            li[i].classList.remove("done");
            itemLeft = itemLeft + 1;
            document.getElementById("item-left").innerHTML = itemLeft + " item(s) left";
        }
    }
}
checkIfDone();

// Category/type Dropdown filter function
function commonFilter(e) {
    let filter = e.value.toUpperCase();

    for (let i = 0; i < li.length; i++) {
        if (e.name === "footer_filter") { // Footer filter by status
            if (filter === "COMPLETED" && !data[i].done) {
                li[i].style.display = "none";
            } else if (filter === "ACTIVE" && data[i].done) {
                li[i].style.display = "none";
            } else {
                li[i].style.display = "";
            }
        } else if (e.name === "category_dropdown") { // Category/type Dropdown filter
            let taskCategoryName = li[i].getElementsByClassName("task-category")[0];
            let taskNameValue = taskCategoryName.textContent || taskCategoryName.innerText;
            if (taskNameValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        } else { // Search textbox filter
            let taskNameTag = li[i].getElementsByTagName("h3")[0];
            let txtValue = taskNameTag.textContent || taskNameTag.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }
}

// Select Task to mark it DONE
todoList.addEventListener('click', function(e) {
    if (e.target.className == "task-initial") {
        let li = e.target.closest('li');
        let nodes = Array.from(todoList.children);
        let index = nodes.indexOf(li);

        for (let i = 0; i < data.length; i++) {
            if (index === i) {
                data[index].done = !data[index].done;
                break;
            }
        }
        localStorage.setItem('allTasks', JSON.stringify(data));
        // e.target.parentNode.remove(); 
    }
    checkIfDone();
});