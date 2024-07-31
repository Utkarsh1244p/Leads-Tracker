let myLeads = []
let myLeadsName = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const leadsFromLocalStorage = JSON.parse( localStorage.getItem("myLeads") )
const tabBtn = document.getElementById("tab-btn")

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    myLeadsName = extractSiteNameFromArray(myLeads)
    render(myLeads, myLeadsName)
}

function render(leads,names) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
        <li>
        <a target='_blank' href='${leads[i]}'>
        ${names[i]}
        </a>
        </li>
        `
    }
    ulEl.innerHTML = listItems
}



tabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        let siteTabName = extractSiteName(tabs[0].url)
        myLeads.push(tabs[0].url)
        myLeadsName.push(siteTabName)
        localStorage.setItem("myLeads", JSON.stringify(myLeads) )
        render(myLeads, myLeadsName)
    })
})


deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    myLeads = []
    myLeadsName = []
    render(myLeads, myLeadsName)
})


inputBtn.addEventListener("click", function() {
    let siteName = extractSiteName(inputEl.value)
    myLeads.push(inputEl.value)
    myLeadsName.push(siteName)
    inputEl.value = ""
    localStorage.setItem("myLeads", JSON.stringify(myLeads) )
    render(myLeads ,myLeadsName)
})



function extractSiteName(urlInput) {
    try {
        const url = new URL(urlInput);
        const hostname = url.hostname;

        const siteName = getSiteNameFromHostname(hostname);
        return siteName;
    } catch (error) {
        console.error("Invalid URL");
        return "Invalid URL";
    }
}



function getSiteNameFromHostname(hostname) {
    const domainParts = hostname.split('.');
    // For domains like 'linkedin.com', 'www.linkedin.com'
    if (domainParts.length > 1) {
        if (domainParts[0] === 'www') {
            return capitalizeFirstLetter(domainParts[1]);
        } else {
            return capitalizeFirstLetter(domainParts[0]);
        }
    }
    return hostname;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}




function extractSiteNameFromArray(arr) {
    let siteNameArray = []
    let isError = false
    for(let i=0;i<arr.length;i++){
        try {
            const url = new URL(arr[i]);
            const hostname = url.hostname;

            siteNameArray.push(getSiteNameFromHostname(hostname));
        } catch (error) {
            console.error("Invalid URL");
            siteNameArray.push("-NoName Error")
            isError = True
        }
    }
    
    return siteNameArray;
    
}