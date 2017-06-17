var candidatesInfoText = new Array ();
candidatesInfoText['CLINTON'] = "Allgemein:Lorem ipsum dolor sit amet,consectetuer adipiscing elit,sed diam nonummy nibh euismod tincidunt ut laoreet, dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit cilisi. Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet minim veniam, quis nostrud exerci tation Lorem ipsum dolor sit amet, consec-";


var candidatesInfoImage = new Array ();
candidatesInfoImage['CLINTON'] = "/data/Clinton.jpg";

var candidatesNames = new Array();
candidatesNames['CLINTON'] = "Hillary Clinton";


function back() {
	window.open("http://localhost:3000/","_self")
}

function showCandidateInformation(name){		
	document.getElementById("sidebarInfoContainer").style.visibility = "visible";	
	document.getElementById("candidateName").textContent = candidatesNames[name];
	document.getElementById("candidateInfoText").textContent = candidatesInfoText[name];
	document.getElementById("candidateInfoImage").src=candidatesInfoImage[name];
}

function hideCandidateInformation(){
	document.getElementById("sidebarInfoContainer").style.visibility = "hidden";	
}