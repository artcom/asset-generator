# Asset Generator

This is a command-line tool for generating custom assets. The tool uses the [ffmpeg](https://www.ffmpeg.org/) and [ImageMagick](https://imagemagick.org/index.php) libraries to generate MP4 and WebM video files with text overlays.

## Installation

Clone this repository: `git clone https://github.com/yourusername/your-repo.git`
Install the dependencies: `npm install`

## Usage

To use the tool, you need to create a JSON file that describes your asset collections and options. Here's an example:

```
json
Copy code
{
  "assetCollections": [
    {
      "folder": "collection-1",
      "pngs": [
        { "name": "image-1", "size": "large", "transparent": true },
        { "name": "image-2", "size": "medium" },
        { "name": "image-3", "size": "small", "transparent": true }
      ],
      "mp4s": [
        { "name": "video-1", "size": "large" },
        { "name": "video-2", "size": "medium" }
      ]
    },
    {
      "folder": "collection-2",
      "pngs": [
        { "name": "image-4", "size": "small" },
        { "name": "image-5", "size": "medium" }
      ],
      "mp4s": [
        { "name": "video-3", "size": "large" }
      ]
    }
  ],
  "sizes": {
    "small": { "width": 320, "height": 240 },
    "medium": { "width": 640, "height": 480 },
    "large": { "width": 1280, "height": 720 }
  },
  "options": {
    "parentFolder": "assets",
    "globalPrefix": "My Company\n"
  }
}
```

Save this file as config.json.

To generate the assets, run the command `node generateAssets.js ./config.json.` This will generate a set of PNG and video files in the assets directory. Otherwise you can run `npm start` to generate the assets.

## Customization

You can customize the tool by editing the generateAssets.js file. Here are some things you can do:

Change the font size and color of the text overlay in the generatePng and generateTransparentPng functions.
Change the duration and transition of the video fade effect in the generateMp4 function.
Add support for other video formats (e.g. AVI, MOV) by modifying the generateMp4 and generateWebM functions.
Change the output directory by modifying the ASSET_PATH variable.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
