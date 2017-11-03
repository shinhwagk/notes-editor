function toUTF8 ($dirPath) {
  foreach ($tree in (Get-ChildItem $dirPath)) {
    $filepath = ($dirPath + "/" + $tree)
    if ((Get-Item $filepath) -is [System.IO.DirectoryInfo]) {
      toUTF8($filepath)
    }
    else {
      sed -i '1s/^\xEF\xBB\xBF//' $filepath
    }
  }
}

toUTF8("./")