//Modules
const { throws } = require('assert')
const { shell } = require('electron')
const fs = require('fs')

//DOM nodes
let items = document.getElementById('items')

//Get readerJS content
let readerJS
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString()
})

//Track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

//Listen for "Pronto" message from reader window
window.addEventListener('message', e => {

    //Check for correct message
    if (e.data.action === 'delete-reader-item') {

        //Delete item at give index
        this.delete(e.data.itemIndex)

        //Close the reader window
        e.source.close()
    }
})

//Delete item
exports.delete = itemIndex => {

    //Remove item from DOM
    //items.removeChild( items.childNodes[itemIndex] )
    items.removeChild(this.getSelectedItem().node) //Better way
    
    //Remove item from storage
    this.storage.splice(itemIndex, 1)

    //Persist storage
    this.save()

    //select previous item or new top item (for the first)
    if (this.storage.length) {

        //Get new selected item index
        let = newSelectedItemIndex = (itemIndex === 0) ? 0 : itemIndex - 1

        //Select item at new index
        document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected')
    }
}

//Get Selected item index
exports.getSelectedItem = () => {

    //Get selected node
    let currentItem = document.getElementsByClassName('read-item selected')[0]

    //Get item index
    let itemIndex = 0
    let child = currentItem
    while ((child = child.previousElementSibling) != null) itemIndex++

    //Return selected item and index
    return { node: currentItem, index: itemIndex }

}

//Persist storage
exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage)) //To storage localy in a session we neeed a string, not object
}

//Set item as selected
exports.select = e => {

    //Remove currently selected item class | selected item: document.getElementsByClassName('read-item selected')[0]
    //document.getElementsByClassName('read-item selected')[0].classList.remove('selected')
    this.getSelectedItem().node.classList.remove('selected')

    //Add to clicked item
    e.currentTarget.classList.add('selected')
}

//Move to newly selected item
exports.changeSelection = direction => {

    //Get selected item
    let currentItem = this.getSelectedItem()

    //Handle up/down
    if (direction === 'ArrowUp' && currentItem.node.previousElementSibling) {
        currentItem.node.classList.remove('selected')
        currentItem.node.previousElementSibling.classList.add('selected')
    } else if (direction === 'ArrowDown' && currentItem.node.nextElementSibling) {
        currentItem.node.classList.remove('selected')
        currentItem.node.nextElementSibling.classList.add('selected')
    }
}

//Open Selected item in the native browser
exports.openNative = () => {

    //Check if exists item
    if (!this.storage.length) {
        return
    } else {

        //Get selected item
        let selectedItem = this.getSelectedItem()

        //Get selected item url
        let selectedUrl = selectedItem.node.dataset.url

        //Open the the user's default browser system
        shell.openExternal(selectedUrl)

    } 
}


//Open selected item
exports.open = () => {

    //Check if exists item
    if (!this.storage.length) {
        return
    } else {

        //Get selected item
        let selectedItem = this.getSelectedItem()

        //Get selected item url
        let selectedUrl = selectedItem.node.dataset.url

        //Open item in proxy window
        /*let readerWindow = window.open(selectedUrl, '')  Aqui, essa janela criada é uma janela
        com as mesmas propriedades da nossa main window, dimensões, e com o nodeIntegration true*/
        let readerWindow = window.open(selectedUrl, '', `
        maxWidth=2000,
        maxHeight=2000,
        width=1200,
        height=800,
        backgroundColor=#DEDEDE,
        nodeIntegration=0,
        contextIsolation=1
    `)

        //Inject JavaScript with specific item index (selectedItem.index)
        readerWindow.eval(readerJS.replace('{{index}}', selectedItem.index))
    }
}

//Add new item
exports.addItem = (item, isNew = false) => {

    //Create new DOM node
    let itemNode = document.createElement('div')

    //Assign 'read-item' class
    itemNode.setAttribute('class', 'read-item')

    //set item url as data attribute
    itemNode.setAttribute('data-url', item.url)

    //Add inner HTML
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    //Append new node to items
    items.appendChild(itemNode)

    //Attach click handler to select
    itemNode.addEventListener('click', this.select)

    //Attach doubleclick handler to open
    itemNode.addEventListener('dblclick', this.open)

    //if this is the first item, select it
    if (document.getElementsByClassName('read-item').length === 1) {
        itemNode.classList.add('selected')
    }

    //Add item to storage and persist
    if (isNew) {
        this.storage.push(item)
        this.save()
    }
}

//Add itens from storage when uploads
this.storage.forEach(item => {
    this.addItem(item, false)
})