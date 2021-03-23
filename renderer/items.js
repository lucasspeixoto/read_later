//DOM nodes
let items = document.getElementById('items')

//Track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

//Persist storage
exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage)) //To storage localy in a session we neeed a string, not object
}

//Set item as selected
exports.select = e => {

    //Remove currently selected item class | selected item: document.getElementsByClassName('read-item selected')[0]
    document.getElementsByClassName('read-item selected')[0].classList.remove('selected')

    //Add to clicked item
    e.currentTarget.classList.add('selected')
}


//Move to newly selected item
exports.changeSelection = direction => {

    //Get selected item
    let currentItem = document.getElementsByClassName('read-item selected')[0]

    //Handle up/down
    if (direction === 'ArrowUp' && currentItem.previousElementSibling) {
        currentItem.classList.remove('selected')
        currentItem.previousElementSibling.classList.add('selected')
    } else if (direction === 'ArrowDown' && currentItem.nextElementSibling) {
        currentItem.classList.remove('selected')
        currentItem.nextElementSibling.classList.add('selected')
    }
}

//Open selected item
exports.open = () => {

    //Check if exists item
    if (!this.storage.length) {
        return
    } else {

    //Get selected item
    let selectedItem = document.getElementsByClassName('read-item selected')[0]

    //Get selected item url
    let selectedUrl = selectedItem.dataset.url

    console.log('Opening item: ', selectedUrl)

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