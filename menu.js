//Modules
const { Menu, shell } = require('electron')

//Module function to create main app menu
module.exports = appWin => {

    //Menu template
    let template = [
        {
            label: 'Sites',
            submenu: [
                {
                    label: 'Incluir',
                    accelerator: 'Ctrl+O',
                    click: () => {
                        appWin.send('menu-show-modal')

                    }
                },

                {
                    label: 'Abrir',
                    accelerator: 'Ctrl+Enter',
                    click: () => {
                        appWin.send('menu-open-item')

                    }
                },

                {
                    label: 'Excluir',
                    accelerator: 'Ctrl+Backspace',
                    click: () => {
                        appWin.send('menu-delete-item')

                    }
                },

                {
                    label: 'Abrir no Navegador',
                    accelerator: 'Ctrl+Shift+Enter',
                    click: () => {
                        appWin.send('menu-open-item-native')

                    }
                }, 

                {
                    label: 'Pesquisar',
                    accelerator: 'Ctrl+S',
                    click: () => {
                        appWin.send('menu-focus-search')

                    }
                }
            ]
        },

        {
            role: 'editMenu'
        },

        {
            role: 'windowMenu'
        },

        {
            role: 'help',
            submenu: [
                {
                    label: 'Projeto',
                    click: () => {
                        shell.openExternal('https://github.com/lucasspeixoto/read_later')
                    }
                }
            ]
        }
    ]

    //Create windows app menu
    if (process.platform === 'darwin') template.unshift({role: 'appMenu'})

    //build menu
    let menu = Menu.buildFromTemplate(template)

    //Set as main app menu
    Menu.setApplicationMenu(menu)
}