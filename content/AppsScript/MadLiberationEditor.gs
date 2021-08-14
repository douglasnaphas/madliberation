function onOpen(e) {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem("Show Menu", "showMenu")
    .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showMenu() {
  const ui = HtmlService.createHtmlOutputFromFile("sidebar").setTitle(
    "Mad Liberation"
  );
  DocumentApp.getUi().showSidebar(ui);
}

/**
 * @return {Array.<string>} The selected text, [] if nothing is selected.
 */
function getSelectedText() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  var text = [];
  if (selection) {
    var elements = selection.getRangeElements();
    for (var i = 0; i < elements.length; ++i) {
      if (elements[i].isPartial()) {
        var element = elements[i].getElement().asText();
        var startIndex = elements[i].getStartOffset();
        var endIndex = elements[i].getEndOffsetInclusive();
        text.push(element.getText().substring(startIndex, endIndex + 1));
      } else {
        var element = elements[i].getElement();
        if (element.editAsText) {
          var elementText = element.asText().getText();
          if (elementText) {
            text.push(elementText);
          }
        }
      }
    }
  }
  return text;
}

/**
 * Replaces the text of the current selection with the provided text, or
 * inserts text at the current cursor location. (There will always be either
 * a selection or a cursor.) If multiple elements are selected, only inserts the
 * translated text in the first element that can contain text and removes the
 * other elements.
 *
 * @param {string} newText The text with which to replace the current selection.
 */
function insertText(newText) {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    var replaced = false;
    var elements = selection.getRangeElements();
    if (
      elements.length === 1 &&
      elements[0].getElement().getType() ===
        DocumentApp.ElementType.INLINE_IMAGE
    ) {
      throw new Error("Can't insert text into an image.");
    }
    for (var i = 0; i < elements.length; ++i) {
      if (elements[i].isPartial()) {
        var element = elements[i].getElement().asText();
        var startIndex = elements[i].getStartOffset();
        var endIndex = elements[i].getEndOffsetInclusive();
        element.deleteText(startIndex, endIndex);
        if (!replaced) {
          element.insertText(startIndex, newText);
          element
            .asText()
            .setBackgroundColor(
              startIndex,
              startIndex + newText.length - 1,
              "#ffff00"
            );
          replaced = true;
        } else {
          // This block handles a selection that ends with a partial element. We
          // want to copy this partial text to the previous element so we don't
          // have a line-break before the last partial.
          var parent = element.getParent();
          var remainingText = element.getText().substring(endIndex + 1);
          parent.getPreviousSibling().asText().appendText(remainingText);
          // We cannot remove the last paragraph of a doc. If this is the case,
          // just remove the text within the last paragraph instead.
          if (parent.getNextSibling()) {
            parent.removeFromParent();
          } else {
            element.removeFromParent();
          }
        }
      } else {
        var element = elements[i].getElement();
        if (!replaced && element.editAsText) {
          // Only replace elements that can be edited as text, removing other
          // elements.
          element.clear();
          element.asText().setText(newText);
          element.asText().setBackgroundColor("#ffff00");
          replaced = true;
        } else {
          // We cannot remove the last paragraph of a doc. If this is the case,
          // just clear the element.
          if (element.getNextSibling()) {
            element.removeFromParent();
          } else {
            element.clear();
          }
        }
      }
    }
  } else {
    var cursor = DocumentApp.getActiveDocument().getCursor();
    var surroundingText = cursor.getSurroundingText().getText();
    var surroundingTextOffset = cursor.getSurroundingTextOffset();
    var insertedElement = cursor.insertText(newText);
    insertedElement.setBackgroundColor("#ffff00");
  }
}

function exportMD() {
  var blob = DocumentApp.getActiveDocument().getBlob();
  var atts = DocumentApp.getActiveDocument().getBody().getAttributes();
  for (var att in atts) {
    Logger.log(att + ":" + atts[att]);
  }
  var body = DocumentApp.getActiveDocument().getBody();
  var children = [];
  var exportText = "# {{ Page }}\n\n";
  for (var i = 0; i < body.getNumChildren(); i++) {
    var child = body.getChild(i);
    var mlText = "";
    mlText = "";
    var formatType = child.getAttributes()[DocumentApp.Attribute.HEADING];
    Logger.log("text format type: " + formatType);
    if (
      formatType == "Title" ||
      formatType == "Heading 1" ||
      formatType == "TITLE" ||
      formatType == "HEADING1"
    ) {
      mlText = mlText + "# ";
    }
    if (formatType == "Subtitle" || formatType == "SUBTITLE")
      mlText = mlText + "#### ";
    if (formatType == "Heading 2" || formatType == "HEADING2")
      mlText = mlText + "## ";
    if (formatType == "Heading 3" || formatType == "HEADING3")
      mlText = mlText + "### ";
    if (formatType == "Heading 4" || formatType == "HEADING4")
      mlText = mlText + "#### ";
    if (formatType == "Heading 5" || formatType == "HEADING5")
      mlText = mlText + "##### ";
    if (formatType == "Heading 6" || formatType == "HEADING6")
      mlText = mlText + "###### ";
    var elText = child.asText().getText();
    // Logger.log(elText);
    if (elText) mlText = mlText + elText + "\n\n";
    var containsPageBreak =
      child.asParagraph().findElement(DocumentApp.ElementType.PAGE_BREAK) !=
      null;
    // Logger.log(containsPageBreak);
    if (containsPageBreak) {
      mlText = mlText + "# {{ Page }}\n\n";
    }
    if (mlText) exportText = exportText + mlText;
    children.push(child);
  }
  return exportText;
}
