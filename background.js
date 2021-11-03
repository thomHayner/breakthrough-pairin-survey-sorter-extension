// // Declare an initial placeholder variable.
// let active_tab_id = 0;

// // When a tab is selected, add a listener.      https://developer.chrome.com/docs/extensions/reference/tabs/#event-onActivated
// chrome.tabs.onActivated.addListener(tab => {
//     // The listener uses the chrome API to get the target tabId of the currently selected tab.     https://developer.chrome.com/docs/extensions/reference/tabs/#method-get
//     chrome.tabs.get(tab.tabId, current_tab_info => {
//         // The callback sets active_tab_id to the tabId of the currently selected tab.      // when does active_tab_id ever get used?  does it do anything or is this leftover code that I forgot to delete?
//         active_tab_id = tab.tabId;

//         // And, if the curently selected tab is a Pairin survey page...
//         // if (/^https:\/\/survey\.pairin/.test(current_tab_info.url)) {
//             // add an onClicked listener to the extension icon in the browser's top bar
//             chrome.action.onClicked.addListener((tab) => 
//                 // it executes the script in the foreground.js file. (and console.logs to confirm)
//                 chrome.scripting.executeScript({
//                     target: { tabId: tab.id },
//                     function: sortTheList
//                 })
//             );
//         // }
//     });
// });

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: sortTheList
    })
})

function sortTheList() {

  // If the page is fully loaded,
  // if (document.readyState === 'complete' && /^survey\.pairin/.test(current_tab_info.url)) {
  if (document.readyState === 'complete') {
    // the checklist parent div is the only div with className "pairin-survey-adjective-checklist",
    let myElement = Array.from(document.getElementsByClassName("pairin-survey-adjective-checklist"));

    // make an array from the children of the checklist parent div element,
    let adjectivesList = Array.from(myElement[0].children);
    let adjectivesListCopy = [...adjectivesList];

    // sort the array (by the numerical value of 'adjective ID' as parsed from the "data-name" attribute),
    let sortedAdjectivesList = adjectivesListCopy.sort((a,b) => {
      return parseInt(a.firstChild.getAttribute("data-name").substring(5)) - parseInt(b.firstChild.getAttribute("data-name").substring(5))
    });

    // and update the display.
    function update() {
        for (let i=0; i < adjectivesListCopy.length; i++) {
            // If a child element already exists on a parent div, the .appendChild method will simply move
            // it instead of adding a second copy.
            myElement[0].appendChild(sortedAdjectivesList[i])
        }
    };

    // But don't forget to run the update function.
    update()
  }
}
