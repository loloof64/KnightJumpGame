# Knight Jumping Game

A simple game based on chess knight move.
Try to eat all pieces in a row.

Window users : you must accept the installation of `Microsoft Edge Webview Runtime` when requested !

## Credits

### Pictures

#### Flaticon.com

Using some pictures from flaticon.com.

* The application icon has been designed by Freepik and downloaded at https://www.flaticon.com/free-icon/jumping-horse-with-jockey_32979.

#### Chess vectors

Chess vectors have been designed by CBurnett and downloaded from https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces.

## Developers

### Publishing a release

* edit `package.json` and update field `version`
* edit `tauri.conf.json` and update field `version` (top of configuration) 
* edit `./github/workflows/build_artifacts.yml` and update field `releaseBody` (bottom of configuration)

So that a Github Action will be able to publish a new release
