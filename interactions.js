'use strict';

//GETTING THE LOCAL STORAGE's DATA
const getLocalStorage = () => JSON.parse(localStorage.getItem('dataset')) ?? [];

//UPLOADING DATA TO LOCALSTORAGE
const setLocalStorage = (data) => localStorage.setItem('dataset',JSON.stringify(data));

//OPEN / CLOSE FORM
const openModal = () => document.getElementById('modal').classList.add('active');
const closeModal = () => {
  document.getElementById('modal').classList.remove('active');
  clearFields();
};

//CRUD => CREATE READ DELETE UPDATE
//CREATE
const createClient = (client) => {
  const dbData = readClient();
  dbData.push(client);
  setLocalStorage(dbData);
};

//READ
const readClient = () => getLocalStorage();

//UPDATE
const updateClient = (index,client) => {
  const dbData = readClient();
  dbData[index] = client;
  setLocalStorage(dbData);
};

//DELETE
const deleteClient = (index) => {
  const dbData = readClient();
  const response = confirm(`Do you really want to delete the book : ${dbData[index].book.toUpperCase()} ?`);
  if (response){
    dbData.splice(index,1);
    setLocalStorage(dbData);
  }
};

//INTERACTIONS WITH LAYOUT
const addBook = () => {
  document.getElementById('h2').textContent = "NEW BOOK";
  document.getElementById('Book').dataset.index = "new";
  openModal();
};

const isValidFields = () => {
  const VALUE = document.getElementById('Evaluation').value;
  if (VALUE>=0 && VALUE<=100){
    return document.getElementById('form').reportValidity();
  }
};

const clearFields = () => {
  const cfields = document.querySelectorAll('.modal-field');
  cfields.forEach(field => field.value = "");
};

const saveClient = () => {
  if (isValidFields()){
    const client = {
      "book": `${document.getElementById('Book').value}`,
      "author": `${document.getElementById('Author').value}`,
      "evaluation": `${document.getElementById('Evaluation').value}`,
      "date": `${document.getElementById('Date').value}`
    };
    const index = document.getElementById('Book').dataset.index;
    if (index == "new"){
      createClient(client);
      updateTable();
      closeModal();
    }else{
      updateClient(index,client);
      updateTable();
      closeModal();
    }
  }
};

const createRow = (client,index) => {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${client.book}</td>
    <td>${client.author}</td>
    <td>${client.evaluation/10}<span class="small">/10</span></td>
    <td>
      <button type="button" class="UPdate" id="edit-${index}">Update</button>
      <button type="button" class="DElete" id="delete-${index}">Delete</button>
    </td>
  `;
  document.querySelector('#tableBook>tbody').appendChild(newRow);
};

const clearTable = () => {
  const rows = document.querySelectorAll('#tableBook>tbody tr');
  rows.forEach(row => row.parentNode.removeChild(row));
};

const updateTable = () => {
  const dbData = readClient();
  clearTable();
  dbData.forEach(createRow);
};

const fillFields = (client) => {
  document.getElementById('Book').value = client.book;
  document.getElementById('Author').value = client.author;
  document.getElementById('Evaluation').value = client.evaluation;
  document.getElementById('Date').value = client.date;
  document.getElementById('Book').dataset.index = client.index;
};

const editClient = (index) => {
  document.getElementById('h2').textContent = "UPDATE BOOK";
  const client = readClient()[index];
  client.index = index;
  fillFields(client);
  openModal();
};

const editDelete = (event) => {
  if (event.target.type == "button"){
    const [action,index] = event.target.id.split("-");
    if (action == "edit"){
      editClient(index);
    }else if (action == "delete"){
      deleteClient(index);
      updateTable();
    }
  }
};

updateTable();

//EVENTS
document.getElementById('addBook').addEventListener('click',addBook);
document.getElementById('modalClose').addEventListener('click',closeModal);
document.getElementById('cancel').addEventListener('click',closeModal);
document.getElementById('save').addEventListener('click',saveClient);
document.getElementById('tbody').addEventListener('click',editDelete);