//Electron Updater module
const { dialog } = require('electron')
const { autoUpdater } = require('electron-updater')

//Configure log debugging
autoUpdater.logger = require('electron-log')
autoUpdater.logger.transports.file.level = "info"

//Disable auto download of updates
autoUpdater.autoDownload = false

//Single export to check for and apply any available updates
module.exports = () => {

    //Check for update (GH releases)
    autoUpdater.checkForUpdates()

    //Listen for update found
    autoUpdater.on('update-available', () => {

        //Prompt user to start download
        dialog.showMessageBox({
            type:"info",
            title: "Atualização disponível",
            message: "Uma nova versão está disponível",
            buttons: ['Atualizar', 'Não']
        }).then(result => {
            let buttonIndex = result.response

            //If button 0(Updat), start downloading the update
            if (buttonIndex === 0) autoUpdater.downloadUpdate()
        }) 
    })

    //Listen for update downloaded
    autoUpdater.on('update-downloaded', () => {

        //Prompt the user to install the update
        dialog.showMessageBox({
            type:"info",
            title: "Atualização Pronta",
            message: "Instalar e Reiniciar Sistema ?",
            buttons: ['Sim', 'Não']
        }).then(result => {
            let buttonIndex = result.response

            //Install and restar if index is 0
            if (buttonIndex === 0) autoUpdater.quitAndInstall(false, true)
        })
    })
}