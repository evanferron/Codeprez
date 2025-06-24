import { chooseFile, unzipFile } from './zip.js'

export const handleChooseFile = async () => {
  const file = await chooseFile()
  if (file.canceled) {
    console.log('File selection was canceled')
  } else {
    unzipFile(file.filePaths[0])
  }
}
