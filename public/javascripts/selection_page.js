var candidatesInfoText = new Array ();
candidatesInfoText['CLINTON'] = "Allgemein:Lorem ipsum dolor sit amet,consectetuer adipiscing elit,sed diam nonummy nibh euismod tincidunt ut laoreet, dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit cilisi. Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet minim veniam, quis nostrud exerci tation Lorem ipsum dolor sit amet, consec-";
candidatesInfoText['TRUMP'] = "";
candidatesInfoText['SANDERS'] = "";
candidatesInfoText['CRUZ'] = "";
candidatesInfoText['KASICH'] = "";
candidatesInfoText['BELLEN'] = "";
candidatesInfoText['HOFER'] = "";
candidatesInfoText['GRISS'] = "";
candidatesInfoText['HUNDSTORFER'] = "";
candidatesInfoText['KHOL'] = "";

var candidatesInfoImage = new Array ();
candidatesInfoImage['CLINTON'] = "/data/Clinton.jpg";
candidatesInfoImage['TRUMP'] = "/data/Trump.jpg";
candidatesInfoImage['SANDERS'] = "/data/Sanders.jpg";
candidatesInfoImage['CRUZ'] = "/data/Cruz.jpg";
candidatesInfoImage['KASICH'] = "/data/Kasich.jpg";
candidatesInfoImage['BELLEN'] = "/data/Bellen.jpg";
candidatesInfoImage['HOFER'] = "/data/Hofer.jpg";
candidatesInfoImage['GRISS'] = "/data/Griss.jpg";
candidatesInfoImage['HUNDSTORFER'] = "/data/Hundstorfer.jpg";
candidatesInfoImage['KHOL'] = "/data/Khol.jpg";

var candidatesNames = new Array();
candidatesNames['CLINTON'] = "Hillary Clinton";
candidatesNames['TRUMP'] = "Donald Trump";
candidatesNames['SANDERS'] = "Bernie Sanders";
candidatesNames['CRUZ'] = "Ted Cruz";
candidatesNames['KASICH'] = "John Kasich";
candidatesNames['BELLEN'] = "Alexander Van der Bellen";
candidatesNames['HOFER'] = "Norbert Hofer";
candidatesNames['GRISS'] = "Irmgard Griss";
candidatesNames['HUNDSTORFER'] = "Rudolf Hundstorfer";
candidatesNames['KHOL'] = "Andreas Khol";


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