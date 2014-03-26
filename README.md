dEmail ![David_dmStatus](https://david-dm.org/dfeagans/dEmail.png)
======

The goal of this quick project is to automatically send out a result's email after every NASCAR practice session. I used the Antwort email template because it handles both Outlook and mobile formatting concerns.

There were three reasons I tried this project: First, I needed to apply all the html, css, and node documentation I had been reading. Second, the current result's email is a screenshot of the leaderboard, which isn't exactly congruent with the company's polished image. Third, based on [this data](http://www.campaignmonitor.com/resources/will-it-work/email-clients/), it seems like making the formatting more mobile-friendly could add some value. 

**Currently Working On:** Add some logic to grab the currently available leaderboard.json from NASCAR.com. NASCAR's scheme for the leaderboard is: http://www.nascar.com/leaderboard/Series_1/2014/4282/1/leaderboard.json. The 4282 is the "RaceID" and it increments every race. All practices are served through that same URL, so the data needs to be grabbed before the next practice starts.

**Checkpoints in the Project:**

- [X] Create html template using [antwort's](http://internations.github.io/antwort/) guidelines that replicates the PR departments current style. 
- [X] Convert the html template to a Jade template for later use in generating the static email html. I used [html2jade](http://html2jade.com/) to turn his template into a starter jade file.
- [X] Style the email template upt to match current marketing document.
- [X] Use node.js to grab data from Nascar's json feed. Search for all the available practice results and create an email for the most recent.
- [X] Combine the leaderboard.json feed with the jade template and ~~save the resulting html to file~~. email the html with images as integrated attachments.
- [ ] Polish up styling and test it using Litmus. Mostly worried about Outlook.
- [X] Use [nodemailer](www.nodemailer.com) to mail the email to a single person for final review before forwarding it out.
- [X] Create simple way to trigger the email being sent. dev.okdane.com/RequestResults?email=FirstPartOfEmail triggers it to be sent, but you have to be on the approved list.
- [X]- Come up with a better way of integrating the gmail account to send the emails and an easier way to maintain the approved list of email recipients that can make the request.

**Current Issue**
- My getCurrentRaceID function requests the headers for every raceID I expect to see over the season. Then it returns the highest RaceID from the ones where the request returned 200. Sometimes random ones that shouldn't have returned 200 do and then it passes an erroneous raceID to the getLeaderboard function (the 404 error is later caught and it throws a message to the user at the point). Why are odd RaceIDs showing succcessful headers? I could brute force it and make a function that finds the last number that was preceded by a number (since the erroneous ones are usually floating in a sea of 0's which I use to indicate the file doesn't exist).

**Lessons for Next Time**
- One of the big problems with html emails is that you can't use CSS and that most email clients only render the inline style attributes. The antwort guide advises against using a style inliner, but it was a huge pain doing everything inline. Atleast try the inliner next time. There were several times where a certain font sized didn't look write. So I only had to change it one place, I made an object called format at the top of the template that had things like titleSize : "15pt" for example. Then I could use format.titleSize all over the place.

**Personal Bonus Points**
- Add more signal, less noise. This available is already available on the internet. It's nice to have it sent to your inbox, but add more value to it. Possibly do statistical analysis on all previous practices at that track and our finish and predict probabilities of finishing in top 10, top 5, or winning. Another good idea would be to show the 2 lap average, 5 lap average, and 10 lap average for each fo the cars that did runs long enough to calculate them.
- Make it able to focus on specific cars and more/less than the current two cars. The in the GET request you could send a query parameter with the list of cars.
- Think about the entire process: Because I was doing everything for the first time, I broke the project up into simple functions. The first loads a json into memory and uses the jade template to create the email and then sends it out. The second component grabs the json form the network and saves it to disk. This is nice because I could reuse those components for different purposes, but would it be worthwhile to skip saving the json to disk and just pass it into the template?