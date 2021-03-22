//DOM nodes
let items = document.getElementById('items')

//Track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

//Persist storage
exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage)) //To storage localy in a session we neeed a string, not object
}

//Add new item
exports.addItem = (item, isNew = false) => {

    //Create new DOM node
    let itemNode = document.createElement('div')

    //Assign 'read-item' class
    itemNode.setAttribute('class', 'read-item')

    //add inner HTML
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    //Append new node to items
    items.appendChild(itemNode)

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