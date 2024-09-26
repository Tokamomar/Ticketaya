const accessToken = localStorage.getItem('accessToken');
// const editParty = Number(JSON.parse(localStorage.getItem('editParty')));
const editParty =localStorage.getItem('editParty');

console.log(",,,,,")
console.log(editParty)

fetch(`http://127.0.0.1:8000/parties/${editParty}` , {
    method : "GET" , 
    headers:{
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${accessToken}`
    }
    }).then(response=>{
        if(response.ok){
            return response.json();
        }else{
            alert("can not retrieve the party")
        }
    }).then(data=>{
        console.log(data)
    })




fetch(`http://127.0.0.1:8000/parties/${editParty}/update` , {
    method : "PATCH",
    headers : {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${accessToken}`
    }
}).then(response=>{
    if(response.ok){
        return response.json();
    }else{
        alert("can not update the data")
    }
})