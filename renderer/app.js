// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//Modules
const { ipcRenderer } = require("electron")

// Dom Nodes
let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    addItem = document.getElementById('add-item'),
    itemUrl = document.getElementById('url')

// Show modal
showModal.addEventListener('click', () => {
    modal.style.display = 'flex'
    itemUrl.focus()
})

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none'
})

//Handle new item
addItem.addEventListener('click', () => {
    //Check a url exists
    if (itemUrl.value) {
        console.log(itemUrl.value)
        ipcRenderer.send('new-item', itemUrl.value)
    }
})

//Listen for new item from main process
ipcRenderer.on('new-item-sucess', (e, newItem) => {
    console.log(newItem)
})

// Liste for keyboard submition
itemUrl.addEventListener('keyup', e => {
    //Entrar com o item ao apertar enter
    if (e.key === 'Enter') addItem.click()
})