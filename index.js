function load()
{
    const $inputTask = document.querySelector("#inputTask");
    const $submitBtn = document.querySelector("#submitBtn");
    const $containerListTask = document.querySelector(".containerTaskList");

    $submitBtn.addEventListener("click", addNewTask);

    loadTask();

    function addNewTask(event)
    {
        event.preventDefault();
        if($inputTask.value!=="") 
        {
            const newTask = templateLI($inputTask.value);
            $containerListTask.appendChild(newTask);
        }
    }
    
    function templateLI(task)
    {
        var actualDate = new Date(Date.now());
        
        let date = actualDate.getDate().toString();
        let month = actualDate.getMonth().toString();
        let year = actualDate.getFullYear().toString().slice(2,4);
        
        const LI = document.createElement("li");
        const taskContent =`
        <div class="conteinerLeft">
            <label class="checkBox" id="checkBoxBtn"></label>
            <label class="taskLI">${task}</label>
        </div>
        <div>
            <label class="dateLI">${date}/${month}/${year}</label>
            <i class='bx bx-edit-alt' id="editBtn"></i>
            <i class='bx bx-trash' id="removeBtn"></i>
        </div>
        `
        LI.innerHTML=taskContent;
        LI.addEventListener("click",clickAction);
        
        $inputTask.value = "";
        saveTask(taskContent);
        
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
    }

    function loadTask()
    {
        if(localStorage.getItem("tasks") !== null)
        {
            let listTasks=JSON.parse(localStorage.getItem("tasks"));

            listTasks.forEach(task => {
                const LI = document.createElement("li");
                LI.innerHTML=task;
                LI.addEventListener("click",clickAction);

                $containerListTask.appendChild(LI);
            });
        }
    }

    function clickAction(e)
    {
        const task = e.target;
        switch(task.id)
        {
            case "checkBoxBtn":
                { 
                    if(!task.classList.contains("checkActive")) 
                    {
                        task.classList.add("checkActive");
                    }
                    else 
                    {
                        task.classList.remove("checkActive");
                    }
                }
                break;
        }
    }
}

window.onload = load;