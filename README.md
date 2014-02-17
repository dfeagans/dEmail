dEmail
======

The goal of this quick project is to automatically send out a result's email after every NASCAR practice session. It will eventually be a web app that lets you select which team or driver to focus on, but the drivers will be hardcoded in the beginning and there won't be a web interface until the core functionality is completed. I used the Antwort email template because it handles both Outlook and mobile formatting concerns.

There were three reasons I tried this project: First, I needed to apply all the html, css, and node documentation I had been reading. Second, the current result's email is a screenshot of the leaderboard, which isn't exactly congruent with the company's polished image. Third, based on [this data](http://www.campaignmonitor.com/resources/will-it-work/email-clients/), it seems like making the formatting more mobile-friendly could add some value. 

**Currently Working On:** The jade template is correctly importing the leaderboard.json. The next step is to correct the formatting (align the individual results columns and add the appropriate table borders). Then it's onto the actual node.js part.

 **REMINDER:** Make it so that the webpage is 100% on mobile screens.

**Checkpoints in the Project:**
- Create html template using [antwort's](http://internations.github.io/antwort/) guidelines that replicates the PR departments current style. 
- Convert the html template to a Jade template for later use in generating the static email html. I used [html2jade](http://html2jade.com/) to turn his template into a starter jade file.
- Use node.js to grab data from Nascar's json feed.
- Combine the leaderboard.json feed with the jade template and save the resulting html to file.
- Use [nodemailer](www.nodemailer.com) to mail the email to a single person for final review before forwarding it out.

**Lessons for Next Time
- One of the big problems with html emails is that you can't use CSS and that most email clients only render the inline style attributes. The antwort guide advises against using a style inliner, but it was a huge pain doing everything inline. Atleast try the inliner next time.


