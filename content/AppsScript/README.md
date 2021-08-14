# Google Apps Script for creating scripts

We use a special format to encode words or phrases that will get supplied by participants during a game, called "libs."

The Google Apps Script script in this folder will assist in formatting a text file for consumption by Mad Liberation.

## How to use this

1. Open a Google doc.
1. Open _Tools_ > _Script editor_.
1. In the Script Editor, rename the script.
1. Manually copy and paste the two files from this folder, `MadLiberationEditor.gs` and `sidebar.html` into Files on the left.
1. Save the project.
1. In `MadLiberationEditor.gs`, select `onOpen` in the dropdown at the top for _function to run_.
1. Click _Run_. Wait until it completes running. There should be an _Execution log_ entry like `Execution completed`.
1. Back in the doc, click _Add-ons_ and select the name you picked for the script, and click _Show Menu_.

Once the add-on is open, type text like a normal doc. Highlight text and click _Create lib_ to create a lib. You'll get the idea from trying it. Click _Insert lib_ to insert a lib with special lib formatting into the doc, pulling the lib data from the boxes in the menu. Click _Generate markdown_ and copy and paste the markdown from the output box into this repo in the `scripts/` directory with a `.md` extension. The build of the top-level repo that this repo is a submodule of will convert the `.md` files into `.json` files that the Mad Liberation backend can consume.
