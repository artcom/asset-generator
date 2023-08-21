import * as child_process from "child_process"
import * as fs from "fs"
import * as path from "path"
import { argv } from "node:process"

const { assetCollections, sizes, options } = JSON.parse(fs.readFileSync(argv[2]))
const ASSET_PATH = path.resolve("./assets")

console.info("Starting to generate assets... \n")
const start = Date.now()

for (const assetCollection of assetCollections) {
  const folderPath = path.join(ASSET_PATH, options.parentFolder, assetCollection.folder)
  createFolder(folderPath)
  if (checkHasPropertyAndIsArray(assetCollection, "pngs")) {
    for (const png of assetCollection.pngs) {
      createPng(folderPath, png)
    }
  }
  if (checkHasPropertyAndIsArray(assetCollection, "mp4s")) {
    for (const asset of assetCollection.mp4s) {
      createMedia(folderPath, asset, "mp4")
    }
  }

  if (checkHasPropertyAndIsArray(assetCollection, "webms")) {
    for (const asset of assetCollection.webms) {
      createMedia(folderPath, asset, "webm")
    }
  }
}

const end = Date.now()
console.info(`\n Took ${(end - start) / 1000}s`)

function createMedia(folderPath, asset, format) {
  const nameStart = asset.name + "Start"
  const nameEnd = asset.name + "End"

  createPng(folderPath, { ...asset, name: nameStart })
  createPng(folderPath, { ...asset, name: nameEnd })

  const command = getMediaCommand(nameStart, nameEnd, asset.name, format)
  child_process.execSync(command, { cwd: folderPath })

  console.info(`Created ${folderPath}/${asset.name}.${format} ✅`)
  deleteFile(folderPath, `${nameStart}.png`)
  console.info(`Deleted ${folderPath}/${nameStart}.png ✅`)
  deleteFile(folderPath, `${nameEnd}.png`)
  console.info(`Deleted ${folderPath}/${nameEnd}.png ✅`)
}

function getMediaCommand(nameStart, nameEnd, outputName, format) {
  return `ffmpeg -y -loop 1 -t 4 -i ${nameStart}.png -loop 1 -t 2 -i ${nameEnd}.png -filter_complex "[0][1]xfade=transition=fadeblack:duration=2:offset=2,format=yuv420p" ${outputName}.${format} -hide_banner -loglevel error`
}

function createPng(folderPath, { name, size, transparent = false }) {
  const { width, height } = sizes[size]
  const scalingFactor = 0.075
  const pointsize = Math.round(((width + height) / 2) * scalingFactor)

  const globalPrefix = options?.globalPrefix ? `${options.globalPrefix}\n` : ""
  const text = `${globalPrefix}${folderPath.split("/").pop()}\n\n${addLineBreak(name)}`

  child_process.execSync(
    `magick \
      -size ${width}x${height} \
      radial-gradient:${transparent ? "none" : "white"}-firebrick \
      -pointsize ${pointsize} \
      -gravity Center \
      -draw "text 0,0 '${text}'" \
    ${folderPath}/${name}.png`
  )
  console.info(`Created ${folderPath}/${name}.png ✅`)
}

function createFolder(folder) {
  try {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true })
    }
  } catch (err) {
    console.error(`Error creating folder ${folder}: ${err.message} ❌`)
    console.error(err.stack)
  }
}

function deleteFile(folder, file) {
  try {
    fs.unlinkSync(path.join(folder, file))
  } catch (error) {
    console.error(`Error deleting file ${file}: ${error.message} ❌`)
    console.error(error.stack)
  }
}

function addLineBreak(text) {
  return text.replace(/([a-z])([A-Z])/g, "$1\\n$2")
}

function checkHasPropertyAndIsArray(object, property) {
  if (!Object.prototype.hasOwnProperty.call(object, property)) {
    console.info(`No ${property} found on folder ${object.folder} ❌`)
    return false
  }
  if (!Array.isArray(object[property])) {
    console.info(`Property ${property} is not an array ❌`)
    return false
  }
  return true
}
