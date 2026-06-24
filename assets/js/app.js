const cl= console.log;

const postContainer = document.getElementById('postContainer')
const titleControl = document.getElementById('title')
const bodyControl = document.getElementById('body')
const userIdControl = document.getElementById('userId')
const addbtn = document.getElementById('addbtn')
const updatebtn = document.getElementById('updatebtn')
const formPost = document.getElementById('formPost')

let BASE_URL= `https://jsonplaceholder.typicode.com`
let POST_URL = `${BASE_URL}/posts`

function snackBar(msg, icon){
Swal.fire({
    title: msg,
    icon: icon,
    timer: 3000
})
}

function tooltip(){
    $(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
}


let postArr=[];
function createCards(arr){
    let result = '';

    arr.forEach(post =>{
        result += `
        

         <div class="col-md-3 mb-3" id="${post.id}">

<div class="card h-100">
   <div class="card-header" data-toggle="tooltip" data-placement="top" title="${post.title}">
    <h3>
        ${post.title}
    </h3>
   </div>
   <div class="card-body">

    <p>${post.body}</p>
   </div>
   <div class="card-footer d-flex justify-content-between">

    <button onClick="onEdit(this)" class="btn btn sm btn-primary">Edit</button>
    <button onClick="onRemove(this)" class="btn btn sm btn-danger">Remove</button>

   </div>
</div>

    </div>
        
        
        `
    })
    postContainer.innerHTML= result
    tooltip()
}


function fetchpost(){

    spinner.classList.remove('d-none')

    let xhr= new XMLHttpRequest()
    xhr.open('GET', POST_URL, true )
    xhr.send(null)
    xhr.onload= function (){
        if (xhr.status>= 200 && xhr.status <= 299){
     postArr= JSON.parse(xhr.response)

       createCards(postArr)
    spinner.classList.add('d-none')


        }else{
    spinner.classList.add('d-none')

            snackBar(`something went wrong while fetching Post`, `error`)

        }
    }
}
fetchpost()

function onSubmit(eve){
    eve.preventDefault()

    let obj={
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    }


    cl(obj)
    spinner.classList.remove('d-none')


    let xhr= new XMLHttpRequest()
    xhr.open('POST', POST_URL, true)
    xhr.send(obj)
    xhr.onload= function(){
        if(xhr.status >= 200 && xhr.status <= 299){
   let res= JSON.parse(xhr.response)

   let col= document.createElement('div')
   col.className= "col-md-3 mb-3"
   col.id= res.id
   col.innerHTML= `
        
<div class="card h-100">
   <div class="card-header" data-toggle="tooltip" data-placement="top" title="${obj.title}">
    <h3>
        ${obj.title}
    </h3>
   </div>
   <div class="card-body">

    <p>${obj.body}</p>
   </div>
   <div class="card-footer d-flex justify-content-between">

    <button onClick="onEdit(this)" class="btn btn sm btn-primary">Edit</button>
    <button onClick="onRemove(this)" class="btn btn sm btn-danger">Remove</button>

   </div>
</div>

   `
   postContainer.prepend(col)
   tooltip()
    spinner.classList.add('d-none')

snackBar(`New Post Added Successfully`, `success`)

        }else{
    spinner.classList.add('d-none')


            snackBar(`someting went wrong`, `error`)
        }
    }
}



function onEdit(ele){
    let EDIT_ID= ele.closest('.col-md-3').id
    cl(EDIT_ID)

    localStorage.setItem('EDIT_ID', EDIT_ID)

    let EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}`


    spinner.classList.remove('d-none')

    let xhr= new XMLHttpRequest()
    xhr.open('GET', EDIT_URL)
    xhr.send()
    xhr.onload=function(){
if(xhr.status >= 200 && xhr.status <= 299){

    let EDIT_OBJ= JSON.parse(xhr.response)

titleControl.value = EDIT_OBJ.title
bodyControl.value = EDIT_OBJ.body
userIdControl.value = EDIT_OBJ.userId


addbtn.classList.add('d-none')
updatebtn.classList.remove('d-none')

  formPost.scrollIntoView({
    behavior: "smooth",
    block: 'start'
})


    spinner.classList.add('d-none')


}else{
    spinner.classList.add('d-none')


    snackBar(`something went wrong while Editing Post`, `error`)
}

    }


}


function onUpdt(){
    let UPDATE_ID = localStorage.getItem('EDIT_ID')
    let UPDATE_URL = `${BASE_URL}/posts/${UPDATE_ID}`

let UPDATED_OBJ={
    title: titleControl.value ,
    body: bodyControl.value ,
    userId: userIdControl.value
}


    spinner.classList.remove('d-none')

let xhr= new XMLHttpRequest()
xhr.open('PATCH', UPDATE_URL)
xhr.send(UPDATED_OBJ)
xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status <= 299){

        let col= document.getElementById(UPDATE_ID)
        let h3= col.querySelector('.card-header h3')
        let p = col.querySelector('.card-body p')

        h3.innerText= UPDATED_OBJ.title
        p.innerText = UPDATED_OBJ.body

formPost.reset()

addbtn.classList.remove('d-none')
updatebtn.classList.add('d-none')

col.scrollIntoView({
    behavior:"smooth",
    block: "center"
})


col.classList.add('highlight-card');

setTimeout(()=>{
col.classList.remove('highlight-card')
}, 3000)


snackBar(`The post with id ${UPDATE_ID} is updated successfully`, `success`)
    spinner.classList.add('d-none')


    }else{

    spinner.classList.add('d-none')

        snackBar(`Something went wrong updating Post `, `error`)

    }
}

}


function onRemove(ele){

Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    
    let REMOVE_ID = ele.closest('.col-md-3').id
    let REMOVE_URL = `${BASE_URL}/posts/${REMOVE_ID}`

    let xhr= new XMLHttpRequest()
    xhr.open('DELETE', REMOVE_URL)
    xhr.send()
    xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            ele.closest('.col-md-3').remove()
  }

        }
    }else{

    }


});



}


formPost.addEventListener('submit', onSubmit)
updatebtn.addEventListener('click', onUpdt)