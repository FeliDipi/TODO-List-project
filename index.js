function load()
{
    //html elements 
    const $inputTask = document.querySelector("#inputTask");
    const $submitBtn = document.querySelector("#submitBtn");
    const $filterBtn = document.querySelector("#filterBtn");
    const $containerListTask = document.querySelector(".containerTaskList");
    const $containerList = document.querySelector(".containerList");
    const $darkMode = document.querySelector("#darkMode");

    //state of dark mode
    let darkModeStatus = false;

    //events of elements html
    $submitBtn.addEventListener("click", addNewTask);//add new task

    //select filter and load the tasks filtered
    $filterBtn.addEventListener("change", (e)=>
    {
        loadTask($filterBtn.value.toString());
    });

    //change theme
    $darkMode.addEventListener("click", changeTheme);

    loadTask("ALL");//initial load with all tasks

    function changeTheme(e)
    {
        let root = document.documentElement;//get var of css file

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

    //if the content overflow then container list become a scrolleable element
    function updateScrolleable()
    {
        //check the content is overflowed
        if($containerList.clientHeight < $containerList.scrollHeight) $containerList.classList.add("scrolleableContent");
        else $containerList.classList.remove("scrolleableContent");
    }

    //function that add a new task
    function addNewTask(event)
    {
        event.preventDefault();//refresh page with submit off
        if($inputTask.value!=="")//check that input is not empty
        {
            const newTask = templateLI($inputTask.value);//create new LI element
            $containerListTask.appendChild(newTask);//add LI to the list
            updateScrolleable();//check overflow
        }
    }
    
    function templateLI(task)
    {
        var actualDate = new Date(Date.now());//get the actual date
        
        let date = actualDate.getDate();//get day
        let month = actualDate.getMonth()+1;//get month
        let year = actualDate.getFullYear().toString();//get full year

        const LI = document.createElement("li");//create node html LI
        const taskContent =`
        <div class="conteinerLeft">
            <label class="checkBox" id="checkBoxBtn"></label>
            <label class="taskLI">${task}</label>
            <input type="text" placeholder="${task}" class="inputEditTask" maxlength="40"/>
        </div>
        <div>
            <label class="dateLI">${date}/${month}/${year}</label>
            <i class='bx bx-edit-alt editBtn' id="editBtnId"></i>
            <i class='bx bx-trash' id="removeBtn"></i>
        </div>
        `
        let id = saveTask(taskContent);//sabe new task element

        LI.innerHTML=taskContent;//add content task to the element LI
        LI.addEventListener("click",clickAction);//add click event
        LI.id  = id;//add identificator
        
        $inputTask.value = "";//reset input

        return LI;
    }

    //function that save task on localStorage and return id 
    function saveTask(newTask)
    {
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

    //function that load tasks from localStorage and check the filter condition 
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

    //function that print tasks element on the html file 
    function loadHtmlTask(task,id)
    {
        const LI = document.createElement("li");
        LI.innerHTML=task;
        LI.addEventListener("click",clickAction);
        LI.id = id;

        $containerListTask.appendChild(LI);
    }

    //function that check if clicked on edit, remove or check button
    function clickAction(e)
    {
        const task = e.target;//get target element on click
        switch(task.id)
        {
            case "checkBoxBtn":
                { 
                    const parent = task.parentElement;
                    const nameTask = parent.querySelector(".taskLI");

                    //switch check and unchecked button
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

                    saveCheck(parentLI);//save changes
                }
                break;
            case "removeBtn":
                {
                    const parent = e.target.parentElement.parentElement;
                    parent.classList.add("removeActive");//add class that active the animation delete
                    removeTask(parent);//remove task from localStorage
                    //check the animation finished and remove html element from page
                    parent.addEventListener("transitionend", (e)=>
                    {
                        parent.remove();
                    })

                    //check overflow
                    updateScrolleable();
                }
                break;
            case "editBtnId":
                {
                    const parent = e.target.parentElement.parentElement;
                    const $conteinerLeft = parent.querySelector(".conteinerLeft");
                    const $inputEdit = $conteinerLeft.querySelector(".inputEditTask");
                    
                    //switch edit mode active or disable
                    if(!$conteinerLeft.classList.contains("editActive")) 
                    {
                        $conteinerLeft.classList.add("editActive");
                        e.target.classList.add("editBtnActive");
                    }
                    else
                    {
                        $conteinerLeft.classList.remove("editActive");
                        e.target.classList.remove("editBtnActive");

                        //if input edit not empty then save changes
                        if($inputEdit.value!=="")
                        {
                            parent.querySelector(".taskLI").innerHTML = $inputEdit.value;//update task html element
                            $inputEdit.placeholder = $inputEdit.value;//update placeholder input edit with the new task
                            $inputEdit.value="";//reset input edit
                            saveCheck(parent);//save changes
                        }
                    }
                }
        }
    }

    //function that save changes (checks and edits) on localStorage
    function saveCheck(taskCheck)
    {
        let id = taskCheck.id;
        let taskListSaved = JSON.parse(localStorage.getItem("tasks"));
        taskListSaved[id]=taskCheck.innerHTML;
        localStorage.setItem("tasks",JSON.stringify(taskListSaved));
    }

    //function that save changes (remove) on localStorage
    function removeTask(taskRemove)
    {
        let id = taskRemove.id;
        let taskListSaved = JSON.parse(localStorage.getItem("tasks"));
        taskListSaved.splice(id, 1);
        localStorage.setItem("tasks",JSON.stringify(taskListSaved));
    }
}

//when the window loaded execute the load function
window.onload = load;