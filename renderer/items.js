//DOM nodes
let items = document.getElementById('items')



//Add new item

exports.addItem = item => {

    //Create new DOM node
    let itemNode = document.createElement('div')

    //Assign 'read-item' class
    itemNode.setAttribute('class', 'read-item')

    //add inner HTML
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    //Append new node to items
    items.appendChild(itemNode)
}