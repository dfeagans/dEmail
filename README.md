dEmail
======

The goal of this quick project is to automatically send out a result's email after every NASCAR practice session. I used the Antwort email template because it handles both Outlook and mobile formatting concerns.

There were three reasons I tried this project: First, I needed to apply all the html, css, and node documentation I had been reading. Second, the current result's email is a screenshot of the leaderboard, which isn't exactly congruent with the company's polished image. Third, based on [this data](http://www.campaignmonitor.com/resources/will-it-work/email-clients/), it seems like making the formatting more mobile-friendly could add some value. 

**Currently Working On:** Create a node.js program that grabs the currently available leaderboard.json. This needs to be done when NASCAR practices are on, in the meantime, work on setting up nodemailer.

**Checkpoints in the Project:**

- [X] Create html template using [antwort's](http://internations.github.io/antwort/) guidelines that replicates the PR departments current style. 
- [X] Convert the html template to a Jade template for later use in generating the static email html. I used [html2jade](http://html2jade.com/) to turn his template into a starter jade file.
- [X] Style the email template upt to match current marketing document.
- [ ] **Current Task ** Use node.js to grab data from Nascar's json feed. Search for all the available practice results and create an email for the most recent.
- [ ] Combine the leaderboard.json feed with the jade template and save the resulting html to file.
- [ ] Test it using Litmus. Mostly worried about Outlook.
- [ ] Use [nodemailer](www.nodemailer.com) to mail the email to a single person for final review before forwarding it out.
- [ ] Run npm init, or handbuild the package.json for deployment.

 **REMINDER:** Make it so that the webpage is 100% on mobile screens. Make sure all background colors are specified in 6 digit hex. That works the best. 

**Lessons for Next Time**
- One of the big problems with html emails is that you can't use CSS and that most email clients only render the inline style attributes. The antwort guide advises against using a style inliner, but it was a huge pain doing everything inline. Atleast try the inliner next time. There were several times where a certain font sized didn't look write. So I only had to change it one place, I made an object called format at the top of the template that had things like titleSize : "15pt" for example. Then I could use format.titleSize all over the place.

**Final Phase**
- Add more signal, less noise. This available is already available on the internet. It's nice to have it sent to your inbox, but add more value to it. Possibly do statistical analysis on all previous practices at that track and our finish and predict probabilities of finishing in top 10, top 5, or winning?

