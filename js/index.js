scrollDown()
setTimeout(scrollDown,100)
const azKuldo = document.getElementById("aKuldo")
const azUzenet = document.getElementById("uzenet")
const formError = document.getElementById("form-error")
const messagesDiv = document.getElementById("uzenetek")
let localUserName = localStorage.getItem("localUserName")
let upAndDown

hideNameInput()

azKuldo.addEventListener("keyup",()=>{
    if(azKuldo.value.length>0){
        document.body.classList.remove("error")
        formError.style.display = "none"
        clearInterval(upAndDown)
        document.body.classList.remove("up-and-down")
    }
})


displayMessagesRefresh()



document.getElementById("uzenoForm").addEventListener("submit",(e)=>{
    e.preventDefault()

    if(azKuldo.value.length===0 && localUserName===null){
        formError.style.display = "block"
        formError.innerHTML=`
            <p><span id="hand">👈</span>Haver! Írd be a neved!</span></p>
        `
        document.body.classList.add("error")
        upAndDown = setInterval(()=>{
            document.body.classList.toggle("up-and-down")
        },500)
        return
    }
    else if(azUzenet.value.length===0){
        return
    }


    if(localUserName===null){
        localStorage.setItem("localUserName",azKuldo.value)
    }

    localUserName=localStorage.getItem("localUserName")

    fetch("https://json.extendsclass.com/bin/ae8fe16061b0",{
        method: "GET",
        credentials: 'same-origin',
        Headers: {"Content-Type": "application/x-javascript; charset=utf-8"}
    })
    .then(res => res.json())
    .then(olvas => {

    const date = new Date()
    const hour = date.toLocaleTimeString("hu-hu", {timeStyle: "short"})
    const theDate = date.toLocaleDateString()
    let currentID = olvas.slice(-1)[0]
    if(typeof(currentID)==="undefined"){
        currentID=0
    }
    else{
        currentID=olvas.slice(-1)[0].id+1
    }
    
    const felulIr = {
        id: currentID,
        userName: localUserName,
        message: azUzenet.value,
        date: theDate,
        hour: hour
    }

    if(felulIr.message==="//torol"){
        deleteChat()
        azUzenet.value=""
        return
    }
    else if(felulIr.message==="//nev"){
        localStorage.removeItem("localUserName")
        location.reload()
        return
    }

    olvas.push(felulIr)

    fetch("https://json.extendsclass.com/bin/ae8fe16061b0", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Security-key': 'uzenofal123',
            'Private': false},
        body: JSON.stringify(olvas)
    })
        .then(res => res.json())
        .catch((error) => {
            console.error('Error:', error);
          })

        renderMessages(olvas)
        azUzenet.value=""
        scrollDown()
        hideNameInput()
    })
    
})

document.getElementById("refresh").addEventListener("click",(e)=>{
    e.preventDefault()
    displayMessagesRefresh()
    scrollDown()
})

function renderMessages(data){
    let gyujto = ""
    for(let i = 0; i<data.length; i++){
        gyujto+=`
        <div class="uzenet ${data[i].userName===localUserName ? "myclass" : ""}">
            <div class="chat-head">
                <span id="name-span">${data[i].userName}</span>
                <span id="date" title="${data[i].date} - ${data[i].hour}">${data[i].hour}</span>
            </div>
            <p>${data[i].message}</p>
        </div>
    `
    }
    
    messagesDiv.innerHTML=gyujto

    const messagesCount = messagesDiv.children.length
    if(messagesCount === 0){
        messagesDiv.classList.add("empty")
        messagesDiv.innerHTML=`
            
        <p>Add meg a neved és küldj egy üzenetet.</p>

        `
    }
    else{
        messagesDiv.classList.remove("empty")
    }
}

function scrollDown(){
    document.getElementById("footer").scrollIntoView(false)
}

function hideNameInput(){
    if(localUserName!==null){
        azKuldo.style.display="none"
    }    
}

function deleteChat(){
    let olvas = []
    fetch("https://json.extendsclass.com/bin/ae8fe16061b0", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Api-key': '39a549c4-2542-11ec-8e13-0242ac110002',
            'Security-key': 'uzenofal123',
            'Private': false},
        body: JSON.stringify(olvas)
    })
        .then(res => res.json())
        .catch((error) => {
            console.error('Error:', error);
          })
        renderMessages(olvas)
}


function displayMessagesRefresh(){
    fetch("https://json.extendsclass.com/bin/ae8fe16061b0",{
    method: "GET",
    credentials: 'same-origin',
    Headers: {"Content-Type": "application/x-javascript; charset=utf-8"}})
    .then(res => res.json())
    .then(olvas => {
        renderMessages(olvas)
        console.log(olvas)
        console.log("refreshbol")
    })
}