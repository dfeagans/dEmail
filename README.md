dEmail ![David_dmStatus](https://david-dm.org/dfeagans/dEmail.png)
======

The goal of this quick project is to automatically send out a result's email after every NASCAR practice session. I used the Antwort email template because it handles both Outlook and mobile formatting concerns.

There were three reasons I tried this project: First, I needed to apply all the html, css, and node documentation I had been reading. Second, the current result's email is a screenshot of the leaderboard, which isn't exactly congruent with the company's polished image. Third, based on [this data](http://www.campaignmonitor.com/resources/will-it-work/email-clients/), it seems like making the formatting more mobile-friendly could add some value. 

![Resulting Email Screenshot](/images/screenshot_dEmail.png "Resulting Email")

**How-To Use**
- After hosting this, just go to <your domain>/RequestResults?email=<EMAIL_ID> to send the current leaderboard results to the email associated with <EMAIL_ID>.
- The approved email addresses are defined in a config.json file. The program checks that json for the <EMAIL_ID> and returns the complete email associated with it.
- If you want a specific race, just add "?raceID=<DESIRED_RACEID" to end of the url you want. The 2014 season started with 4282 for reference. The id is increment every race and all practices are served from the same ID.

**Project Milestones:**

- [X] Create html template using [antwort's](http://internations.github.io/antwort/) guidelines that replicates the PR departments current style. 
- [X] Convert the html template to a Jade template for later use in generating the static email html. I used [html2jade](http://html2jade.com/) to turn his template into a starter jade file.
- [X] Style the email template upt to match current marketing document.
- [X] Use node.js to grab data from Nascar's json feed. Search for all the available practice results and create an email for the most recent.
- [X] Combine the leaderboard.json feed with the jade template and ~~save the resulting html to file~~. email the html with images as integrated attachments.
- [ ] Polish up styling and test it using Litmus. There is a minor border issue in Outlook currently. That's job number 1.
- [X] Use [nodemailer](www.nodemailer.com) to mail the email to a single person for final review before forwarding it out.
- [X] Create simple way to trigger the email being sent. dev.okdane.com/RequestResults?email=FirstPartOfEmail triggers it to be sent, but you have to be on the approved list.
- [X] Come up with a better way of integrating the gmail account to send the emails and an easier way to maintain the approved list of email recipients that can make the request.

**Lessons for Next Time**
- One of the big problems with html emails is that you can't use CSS and that most email clients only render the inline style attributes. The antwort guide advises against using a style inliner, but it was a huge pain doing everything inline. Atleast try the inliner next time. There were several times where a certain font sized didn't look pleasing. So I only had to change it one place, I made an object called format at the top of the template that had things like titleSize : "15pt" for example. Then I could use format.titleSize all over the place.

**Personal Bonus Points**
- Add more signal, less noise. This available is already available on the internet. It's nice to have it sent to your inbox, but add more value to it. Possibly do statistical analysis on all previous practices at that track and our finish and predict probabilities of finishing in top 10, top 5, or winning. Another good idea would be to show the 2 lap average, 5 lap average, and 10 lap average for each of the cars that did runs long enough to calculate them.
- Make it able to focus on specific cars and more/less than the current two cars. Then in the GET request you could send a query parameter with the list of cars.
- Think about the entire process: Because I was doing everything for the first time, I broke the project up into simple functions. The first loads a json into memory and uses the jade template to create the email and then sends it out. The second component grabs the json from the network and saves it to disk. This is nice because I could re-purpose the components with some modification, but would it be worthwhile to skip saving the json to disk and just pass it into the template?

**Current Issue w/ Successful Work-Around in Place**
- My getCurrentRaceID function requests the headers for every raceID I expect to see over the season. Then it returns the highest RaceID from the ones where the request returned 200. Sometimes random ones that shouldn't have returned 200 do and then it passes an erroneous raceID to the getLeaderboard function. Why are odd RaceIDs showing successful headers? In the end, I don't care. The current workaround is to inspect the returned header for the "content-type" key. If it was a genuinely successful URL that contianed a leaderboard it is set to "application/json".
