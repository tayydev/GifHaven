# gifhaven design doc
## the problem
- losing track of funny gifs is very sad
- most gif pallets don't provide favorites/recents search
    - e.g. Discord's gifs are star-able, but you can only *search* the entirety of Tenor
- the 1984 problem
    - gif platforms do not have elaborate moderation policies, your content can go down at any time
## the solution
 - gifs must be easy to save
    - keyboard shortcuts
    - automatic local downloads
    - drag and drop files
    - copy and past links (and files?)
    - duplicate detection
 - gifs must be easy to discover
    - your existing gifs must be searchable **fast**
    - must also be able to search external services (potentially multiple)
 - gifs must be easy to archive
    - store in a human-readable folder heirachy
    - storage should be externally syncable (limit the number of garbage files)

## storage pattern
|item|type|required|
|----|----|--------|
|file ref|string|yes|
|name|string|yes|
|timestamp|integer|yes|
|source url|string|no|