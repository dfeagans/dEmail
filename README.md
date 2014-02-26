dEmail
======

The goal of this quick project is to automatically send out a result's email after every NASCAR practice session. It will eventually be a web app that lets you select which team or driver to focus on, but the drivers will be hardcoded in the beginning and there won't be a web interface until the core functionality is completed. I used the Antwort email template because it handles both Outlook and mobile formatting concerns.

There were three reasons I tried this project: First, I needed to apply all the html, css, and node documentation I had been reading. Second, the current result's email is a screenshot of the leaderboard, which isn't exactly congruent with the company's polished image. Third, based on [this data](http://www.campaignmonitor.com/resources/will-it-work/email-clients/), it seems like making the formatting more mobile-friendly could add some value. 

**Currently Working On:** The jade template is correctly importing the leaderboard.json. It now correctly loads the results for the two drivers, changes the comments based on the track and what practice it is. Now I need to add the appropriate table borders. Then it's onto the actual node.js part of grabbing all the possible json's and populating a jqGrid with what's avialable.

**Checkpoints in the Project:**

- [X] Create html template using [antwort's](http://internations.github.io/antwort/) guidelines that replicates the PR departments current style. 
- [x] Convert the html template to a Jade template for later use in generating the static email html. I used [html2jade](http://html2jade.com/) to turn his template into a starter jade file.
- [] **Current Task** Style the template up and test it using Litmus. Mostly worried about Outlook.
- [ ] Use node.js to grab data from Nascar's json feed. Search for all the available practice results and present in a jqGrid sorted by most recent. Let the user select which event they want to prepare the email for.
-[X] Combine the leaderboard.json feed with the jade template and save the resulting html to file.
-[] Use [nodemailer](www.nodemailer.com) to mail the email to a single person for final review before forwarding it out.
-[] Run npm init, or handbuild the package.json for deployment.
-[] Optional- Make it so that you could prepare this for a library of drivers (you'd have to have sponsor logos for everything). Then this could be prepared for every series

 **REMINDER:** Make it so that the webpage is 100% on mobile screens. Make sure all background colors are specified in 6 digit hex. That works the best. 

**Lessons for Next Time**
- One of the big problems with html emails is that you can't use CSS and that most email clients only render the inline style attributes. The antwort guide advises against using a style inliner, but it was a huge pain doing everything inline. Atleast try the inliner next time. There were several times where a certain font sized didn't look write. So I only had to change it one place, I made an object called format at the top of the template that had things like titleSize : "15pt" for example. Then I could use format.titleSize all over the place.

**Final Phase**
- Add more signal, less noise. This available is already available on the internet. It's nice to have it sent to your inbox, but add more value to it. Possibly do statistical analysis on all previous practices at that track and our finish and predict probabilities of finishing in top 10, top 5, or winning?

