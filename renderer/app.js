// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//Modules
const { ipcRenderer } = require("electron")
const items = require('./items')

// Dom Nodes
let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    addItem = document.getElementById('add-item'),
    itemUrl = document.getElementById('url'),
    search = document.getElementById('search')


//Open modal from menu
ipcRenderer.on('menu-show-modal', () => {
    showModal.click()
})
//Open selected item from menu
ipcRenderer.on('menu-open-item', () => {
    items.open()
})
//Delete selected item from menu
ipcRenderer.on('menu-delete-item', () => {
    let selectedItem = items.getSelectedItem()
    items.delete(selectedItem.index)
}) 
//Open the url in the browser
ipcRenderer.on('menu-open-item-native', () => {
    items.openNative()
})
//Open modal from menu
ipcRenderer.on('menu-focus-search', () => {
    search.focus()
})

//Filter items with "search"
search.addEventListener('keyup', e => {

    //Loop items
    Array.from( document.getElementsByClassName('read-item') ).forEach( item => {

        //Hide items that don't match search value
        let hasMatch = item.innerText.toLowerCase().includes(search.value)
        item.style.display = hasMatch ? 'flex' : 'none'
    })
})


//Navigate item selection with up/down arrows
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        items.changeSelection(e.key)
    }
})


//Disable & Enable modal buttons
const toggleModalButtons = () => {

    //Check state of buttons
    if (addItem.disabled === true) {
        addItem.disabled = false
        addItem.style.opacity = 1
        addItem.innerText = 'Adicionar URL'
        //Hide Cancel button
        closeModal.style.display = 'inline'
    } else {
        addItem.disabled = true
        addItem.style.opacity = 0.5
        addItem.innerText = 'Adicionando...'
        //Hide Cancel button
        closeModal.style.display = 'none'
    }
}

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
        ipcRenderer.send('new-item', itemUrl.value) //Waiting 2s
        //Disable the buttons
        toggleModalButtons()
    }
})

//Listen for new item from main process
ipcRenderer.on('new-item-sucess', (e, newItem) => {

    //Add new item to itens node
    items.addItem(newItem, true)

    //Enable the buttons
    toggleModalButtons()

    //Hide modal and clear the value
    modal.style.display = 'none'
    itemUrl.value = ''
})

//Listen for keyboard submition
itemUrl.addEventListener('keyup', e => {
    //Entrar com o item ao apertar enter
    if (e.key === 'Enter') addItem.click()
})








