# STACSYAK

### (Update) STACSYAK API NOT IN USE ANYMORE

This project implements the client-side for a new messaging service named StacsYak. It lets users post messages, called Yaks, to a server and read the Yaks other people post. 


![Alt text](screenshots/overview.png "Overview")
<br>

Functionalities:
* allows users to see all the Yaks that are currently available from the server. Polls server every 5s to get and display the updated list of Yaks from the server without reloading the page
![Alt text](screenshots/allPosts.png "Overview")
<br>

* allows users to post Yaks, re-display the updated list of Yaks from the server without reloading the page
![Alt text](screenshots/examplePost.png "Overview")
<br>

* Allow users to delete Yaks they have created. After successfully deleting a Yak, re-display the updated list of Yaks from the server without reloading the page. E.g. Error message deleting post that is not yours: 
![Alt text](screenshots/delete.png "Overview")
<br>

* Allow users vote Yaks up and down. After successfully up/down voting a Yak, re-display the updated list of Yaks from the server without reloading the page.
![Alt text](screenshots/like.png "Overview")
<br>

![Alt text](screenshots/dislike.png "Overview")
<br>

![Alt text](screenshots/errorVote.png "Overview")
<br>

* Allow users change their nickname. After successfully changing the nickname, display it in the interface without reloading the page
![Alt text](screenshots/usernameChange.png "Overview")
<br>

Filter 
* Allow users to filter current Yaks based on nichname, hashtags, number of votes and timestamp
![Alt text](screenshots/searchAndSort.png "Overview")
<br>

Barchart
* Display barchart showing the number of Yaks poster PER HOUR over the last 2 days
![Alt text](screenshots/hourlyPost.png "Overview")
<br>

![Alt text](screenshots/hourlyPost_filtered.png "Overview")
<br>

* Display barchart showing the number of Yaks poster PER DAY 
![Alt text](screenshots/dailyPost.png "Overview")
<br>


