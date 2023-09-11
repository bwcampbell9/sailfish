# Sailfish

App app desgined to make the simple or repetitive parts of development go at lighting speed.


## TODO

### Base app

- [ ] Add pluggable electron
- [ ] Determine how much the base app will dictate visual structure (how can we make extension play together but still be powerful)
- [ ] Load commands from extensions
- [ ] Load views from extensions
- [ ] Make global search
    - [ ] global search tags can be filtered by prefix ">" for commands, "f" for files, "b" for browser bookmarks...
- [ ] Make unit of work structure (tasks in folders)
- [ ] Tags
- [ ] Backlinks
- [ ] Work Screen
- [ ] Dashboard view
- [ ] Task view
- [ ] Extension management panel
- [ ] Keyboard shortcut maker
    - [ ] OS wide
    - [ ] In app
    - [ ] In panel


### Extensions
- [ ] Git (With worktree)
    - [ ] Multiple repos can be linked to one task
    - [ ] Add
    - [ ] push
    - [ ] pull
    - [ ] switch branch
    - [ ] create branch
- [ ] ADO Integration (write this with ado part abstracted to make it as easy as possible to switch to git or jira)
    - [ ] Auth
    - [ ] ADO PR's
        - [ ] Preview (integrate with ado pr extension if possible I think)
        - [ ] Create 
        - [ ] Review
        - [ ] Auto desctiption
        - [ ] Link work item
        - [ ] Status
        - [ ] Complete
    - [ ] ADO Work items
        - [ ] Mangage status
        - [ ] Pull description
        - [ ] Open in browser (in app?)
    - [ ] ADO Code flow
        - [ ] From writing through to release? (at least display it)
- [ ] Calculator in global search
- [ ] Internet in global search (google, bing...)
- [ ] Bookmarks in global search

## Thoughts
Base unit of organization is a "Task"
tasks live in folders, have tags and back links, can link to:
 - Work items
 - Git repos

 Views:
  - Screen (Whole screen)
  - Panel (Partial screen lives alongside other panels)
  - Popup
  - Menu Group
  - Sidebar
  - Search result (rendered in global search results)

Maybe if tasks are markdown the whole folder can be opened in obsidian? or maybe another type of DB would be faster for tags/backlinks/all that. how does obsidian do it?

How do we know which view to display. We can have default (sidebar menu, task file structure, task dashboar...) but we want extensions to be able to take it over...