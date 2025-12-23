import { db } from "./firebase.js";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp }
from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const quill = new Quill("#editor",{theme:"snow"});
let editId=null;

savePost.onclick=async()=>{
 const data={
  title:title.value,
  image:image.value,
  content:quill.root.innerHTML,
  category:category.value,
  status:status.value
 };
 if(editId){
  await updateDoc(doc(db,"posts",editId),data);
  editId=null;
 }else{
  await addDoc(collection(db,"posts"),{...data,likes:0,createdAt:serverTimestamp()});
 }
 load();
};

async function load(){
 postsList.innerHTML="";
 (await getDocs(collection(db,"posts"))).forEach(d=>{
  postsList.innerHTML+=`
  <div class="border p-2 mb-2">
   ${d.data().title}
   <button onclick="edit('${d.id}')">Edit</button>
   <button onclick="del('${d.id}')">Delete</button>
  </div>`;
 });
}

window.edit=async id=>{
 (await getDocs(collection(db,"posts"))).forEach(d=>{
  if(d.id===id){
   title.value=d.data().title;
   image.value=d.data().image;
   category.value=d.data().category;
   status.value=d.data().status;
   quill.root.innerHTML=d.data().content;
   editId=id;
  }
 });
};

window.del=async id=>{
 if(confirm("Delete?")){
  await deleteDoc(doc(db,"posts",id));
  load();
 }
};

load();
