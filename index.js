function load()
{
    const $inputTask = document.querySelector("#inputTask");
    const $submitBtn = document.querySelector("#submitBtn");
    const $filterBtn = document.querySelector("#filterBtn");
    const $containerListTask = document.querySelector(".containerTaskList");
    const $containerList = document.querySelector(".containerList");
    const $darkMode = document.querySelector("#darkMode");
    let $inputEdit = null;
    let darkModeStatus = false;

    $submitBtn.addEventListener("click", addNewTask);
    $filterBtn.addEventListener("change", (e)=>
    {
        loadTask($filterBtn.value.toString());
    });
    $darkMode.addEventListener("click", changeTheme);

    loadTask("ALL");

    function changeTheme(e)
    {
        let root = document.documentElement;

        if(!darkModeStatus)
        {
            darkModeStatus=true;
            root.style.setProperty('--background-color', "#333333");
            root.style.setProperty('--principal-font-color', "white");
        }
        else
        {
            root.style.setProperty('--background-color', "white");
            root.style.setProperty('--principal-font-color', "black");
            darkModeStatus=false;
        }
    }

    function updateScrolleable()
    {
        if($containerList.clientHeight < $containerList.scrollHeight) $containerList.classList.add("scrolleableContent");
        else $containerList.classList.remove("scrolleableContent");
    }

    function addNewTask(event)
    {
        event.preventDefault();
        if($inputTask.value!=="") 
        {
            const newTask = templateLI($inputTask.value);
            $containerListTask.appendChild(newTask);
            updateScrolleable();
        }
    }
    
    function templateLI(task)
    {
        var actualDate = new Date(Date.now());
        
        let date = actualDate.getDate();
        let month = actualDate.getMonth()+1;
        let year = actualDate.getFullYear().toString();//.slice(2,4);

        const LI = document.createElement("li");
        const taskContent =`
        <div class="conteinerLeft">
            <label class="checkBox" id="checkBoxBtn"></label>
            <label class="taskLI">${task}</label>
            <input type="text" placeholder="${task}" class="inputEditTask" maxlength="40"/>
        </div>
        <div>
            <label class="dateLI">${date}/${month}/${year}</label>
            <i class='bx bx-edit-alt' id="editBtn"></i>
            <i class='bx bx-trash' id="removeBtn"></i>
        </div>
        `
        let id = saveTask(taskContent);

        LI.innerHTML=taskContent;
        LI.addEventListener("click",clickAction);
        LI.id  = id;
        
        $inputTask.value = "";

        return LI;
    }

    function saveTask(newTask)
    {
        //console.log(newTask);

        let listTasks;
        if(localStorage.getItem("tasks") === null)
        {
            listTasks=[];
        }
        else
        {
            listTasks = JSON.parse(localStorage.getItem("tasks"));
        }
        
        listTasks.push(newTask);
        
        localStorage.setItem("tasks", JSON.stringify(listTasks));

        return listTasks.length-1;
    }

    function loadTask(filter)
    {
        $containerListTask.innerHTML = "";
        if(localStorage.getItem("tasks") !== null && localStorage.getItem("tasks").length>0)
        {
            let listTasks=JSON.parse(localStorage.getItem("tasks"));

            for(let i=0 ;i<listTasks.length;i++)
            {
                switch(filter)
                {
                    case "UNCHECK":
                        {
                            if(!listTasks[i].includes("checkActive")) loadHtmlTask(listTasks[i],i);
                        }
                    break;

                    case "CHECK":
                        {
                            if(listTasks[i].includes("checkActive")) loadHtmlTask(listTasks[i],i);
                        }
                    break;

                    default: loadHtmlTask(listTasks[i],i);
                        break;
                }
            }
        }
    }

    function loadHtmlTask(task,id)
    {
        const LI = document.createElement("li");
        LI.innerHTML=task;
        LI.addEventListener("click",clickAction);
        LI.id = id;

        $containerListTask.appendChild(LI);
    }

    function clickAction(e)
    {
        const task = e.target;
        switch(task.id)
        {
            case "checkBoxBtn":
                { 
                    const parent = task.parentElement;
                    const nameTask = parent.querySelector(".taskLI");

                    if(!task.classList.contains("checkActive") && nameTask!==null) 
                    {
                        task.classList.add("checkActive");
                        nameTask.classList.add("taskChecked");
                    }
                    else 
                    {
                        task.classList.remove("checkActive");
                        nameTask.classList.remove("taskChecked");
                    }

                    let parentLI = parent.parentElement;

                    //console.log(parentLI.innerHTML);

                    saveCheck(parentLI);
                }
                break;
            case "removeBtn":
                {
                    const parent = e.target.parentElement.parentElement;
                    parent.classList.add("removeActive");
                    removeTask(parent);
                    parent.addEventListener("transitionend", (e)=>
                    {
                        parent.remove();
                    })
                    updateScrolleable();
                }
                break;
            case "editBtn":
                {
                    const parent = e.target.parentElement.parentElement;
                    const $conteinerLeft = parent.querySelector(".conteinerLeft");
                    const $inputEdit = $conteinerLeft.querySelector(".inputEditTask");
                    
                    if(!$conteinerLeft.classList.contains("editActive")) 
                    {
                        $conteinerLeft.classList.add("editActive");
                    }
                    else
                    {
                        $conteinerLeft.classList.remove("editActive");
                    }
                    
                    if($inputEdit.value!=="")
                    {
                        parent.querySelector(".taskLI").innerHTML = $inputEdit.value;
                        $inputEdit.placeholder = $inputEdit.value;
                        $inputEdit.value="";
                        $conteinerLeft.classList.remove("editActive");
                        saveCheck(parent);
                    }
                }
        }
    }

    function saveCheck(taskCheck)
    {
        let id = taskCheck.id;
        //console.log(id);
        let taskListSaved = JSON.parse(localStorage.getItem("tasks"));
        taskListSaved[id]=taskCheck.innerHTML;
        localStorage.setItem("tasks",JSON.stringify(taskListSaved));
    }

    function removeTask(taskRemove)
    {
        let id = taskRemove.id;
        let taskListSaved = JSON.parse(localStorage.getItem("tasks"));
        taskListSaved.splice(id, 1);
        localStorage.setItem("tasks",JSON.stringify(taskListSaved));
    }
}

window.onload = load;