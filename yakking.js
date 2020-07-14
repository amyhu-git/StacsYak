const bar = []; //array for three most recent dates of posts
let allData; //global variable used for chart creation

//CREATE BAR CHARTS

//function to hide charts
function hideChart() {

    const hourCharts = document.getElementById('hourChart'); //grab element
    const dayCharts = document.getElementById('myChart');

    hourCharts.style.display = 'none'; //hide
    dayCharts.style.display = 'none';
}

//Chart for posts per day with Chart.js
async function barchart() {
    await getYak();
    const ctx = document.getElementById('myChart').getContext('2d'); //grab element defined in HTML

    //counting posts per day
    let postCounts = allData.reduce(function(result, yak) { //reduce allData object to day and post counts
        let day = moment(yak.timestamp).format("DD-MM-YYYY"); //format date values
        if (!bar.includes(day)) {
            bar.push(day); //make each date once available in global "bar" array
        };

        if (!result[day]) {
            result[day] = 0
        }
        result[day]++; //increment count per day
        return result;
    }, {});

    let countArray = Object.values(postCounts); //extract values of object 
    //console.log(countArray);

    const yposts = []; //array to define y-labels
    yposts.push.apply(yposts, countArray); //push values into array defining y-labels

    //Check correct count of posts:
    //console.log(postCounts);

    //Create new chart
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: bar, //call global array with date values
            datasets: [{
                data: yposts, //calls array for y-labels
                label: '# of YAKS per day',
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(0, 0, 0, 0.1)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(0, 0, 0, 0.5)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
                barThickness: '80'
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Number of posts per day'
            }
        }
    });

    //re-display chart after hideChart() function
    const dayCharts = document.getElementById('myChart');
    dayCharts.style.display = '';
};

//Button event for hourChart
let chartButton = document.getElementById('hour');
chartButton.addEventListener('click', hourChart);

//Chart for posts per hour with Zing Chart
async function hourChart() {
    await getYak();

    //function to count posts per hour/day
    let hourTracker = function(day) {
        let counter = {}
        console.log("Date ", day)
        const yakCount = allData.filter(yak => (new Date(yak.timestamp)).getDate() === day) //every yaks relating to specific day (parameter)
            // console.log(count)
        yakCount.forEach((yak) => {
                let h = new Date(yak.timestamp).getHours() //get hours of posts
                if (typeof counter[h] === 'undefined') {
                    counter[h] = 1; //start post per hour count
                } else {
                    counter[h]++; //increment post per hour count
                }
            })
            // console.log(counter)

        var transformedArray = Object.keys(counter).map(function(key) {
            return [Number(key), counter[key]]; //transform object into Array with key-value pairs
        });
        //console.log(transformedArray);
        return transformedArray;
    }

    //create array with relevant days
    let days = []

    let x = allData.filter(function(p) {
        let day = moment(p.timestamp).format("DD"); //format day
        let number = parseInt(day); //turn day value into integer for hourTracker function
        if (!days.includes(number)) { //avoid repetitve date values
            days.push(number); //populate "days" array
        }
    });

    let chartData = []; //array used to define data in Zing Chart

    for (day of days) { //iterate through days to obtain chartData
        chartData.push({ //populate chartData array
            values: hourTracker(day), //define values for chart using created function 
            text: 'Click Me', //text for interactive legend buttons
            alpha: 0.8, //transparency gradient for bars
        });
    }
    //console.log(chartData)

    //displayChart
    zingchart.render({
        id: "hourChart",
        height: 400,
        width: "100%",
        data: {
            type: "bar",
            labels: [{ //create label boxes to distinguish dates 
                    text: bar[0], //access date value through global bar array
                    x: "80%", //move box across x or y axis 
                    y: "3%",
                    fontSize: "10px",
                    fontColor: '#fff',
                    backgroundColor: "#00BAF0",
                    padding: "10px",
                },
                {
                    text: bar[1],
                    x: "80%",
                    y: "12%",
                    fontSize: "10px",
                    fontColor: '#fff',
                    backgroundColor: "red",
                    padding: "10px",
                }, {

                    text: bar[2],
                    x: "80%",
                    y: "21%",
                    fontSize: "10px",
                    fontColor: '#fff',
                    backgroundColor: "#9ACD32",
                    padding: "10px",

                }
            ],
            plot: {
                stacked: false,
            },
            title: {
                text: "Number of posts per hour",
            },
            scaleX: {
                label: {
                    text: 'Hours of the Day [h]'
                },
            },
            scaleY: {
                label: {
                    text: 'Number of Posts'
                },
            },
            legend: {
                "toggle-action": "remove",
                header: {
                    text: "Compare the Days!"
                },
                "draggable": true,
                "drag-handler": "icon",
            },
            series: chartData //input prepared data for chart
        }
    });

    //re-display chart after hideChart() function
    const hourCharts = document.getElementById('hourChart');
    hourCharts.style.display = "";
}


//STACSYAK posting 

//request url
const api_url = 'https://cs5003-api.host.cs.st-andrews.ac.uk/api/yaks?key=f6e875e2-8b77-491b-8a9e-81590c411fbc';
const user_url = 'https://cs5003-api.host.cs.st-andrews.ac.uk/api/user?key=f6e875e2-8b77-491b-8a9e-81590c411fbc';

let latestData; //updated based on functions performed
let filteredData = []; //results of filter use

//calling functions
getYak(); //fetch and display data
setInterval(getYak, 5000); //polls server every 5 seconds
barchart(); //display post/day chart 
changeName(); //enables setting username
postYak(); //enables posting

//fetch and display data
async function getYak() {
    try {
        const response = await fetch(api_url); //fetch data
        if (response.status == 200) { //check if status is ok
            const data = await response.json(); //turn into json 
            console.log(data);
            allData = data; //original data required for charts
            latestData = data; //updating latestData

            //consider any applied filters on data
            let userSearch = document.getElementById('searchAll'); //grab elements 
            let contentSearch = document.getElementById('hashtag');
            if (userSearch != "" || contentSearch != "") { //check if filter active
                searchUser(); //perform user filter
                searchHashtag(); //perform content filter 
                latestData = filteredData; //updating latestData
                displayYak(latestData); //display latest data
            } else { displayYak(latestData) } //display unfiltered data
        };
    } catch (err) { //catch server error
        console.log(err);
        document.getElementById('all-posts').innerHTML = "Yaks cannot be accessed"
    };
};


//function to delete displayed posts
let deleteDisplay = () => {
    let oldContent = document.getElementById('all-posts') //grab content
    while (oldContent.hasChildNodes()) {
        oldContent.removeChild(oldContent.firstChild); //remove all attached elements
    };
};

//display posts
let displayYak = data => {
    deleteDisplay(); //delete old data 
    let content = document.getElementById('all-posts');

    for (item of data) { //iterate through data
        const yakId = item.id;

        //request url 
        const del_url = `https://cs5003-api.host.cs.st-andrews.ac.uk/api/yaks/${yakId}?key=f6e875e2-8b77-491b-8a9e-81590c411fbc`
        const vote_url = `https://cs5003-api.host.cs.st-andrews.ac.uk/api/yaks/${yakId}/vote?key=f6e875e2-8b77-491b-8a9e-81590c411fbc`

        //create elements for each post
        const yakPost = document.createElement('p')
        const uNick = document.createElement('h5');
        const date = document.createElement('small');
        const votes = document.createElement('p');
        const del_button = document.createElement('button');
        del_button.innerHTML = 'DELETE';
        const voteUp = document.createElement('button');
        voteUp.innerHTML = 'LIKE';
        const voteDown = document.createElement('button');
        voteDown.innerHTML = 'DISLIKE';

        //create content for elements
        yakPost.innerText = `YAK: ${item.content}`;
        uNick.innerText = `${item.userNick}`;
        const dateString = new Date(item.timestamp).toLocaleString(); //converting date into string
        date.innerText = `Posted on: ${dateString}`;
        votes.innerText = `Votes ${item.votes}`;

        //BUTTON ACTIONS FOR EACH POST

        //DELETE
        del_button.onclick = async event => { //start event on click
            const del_yak = {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json'
                },
            };

            try {
                let oldPost = await fetch(del_url, del_yak); //request delete 

                if (oldPost.status == 200) { //check status 
                } else {
                    alert('Unauthorized: THIS IS NOT YOUR POST!'); //catch error client
                    console.log(oldPost.status + ': Unauthorized');
                }
            } catch (err) {
                console.log(err); //catch error server
                alert(err);
            };
        };

        //VOTING EVENTS
        //LIKE
        voteUp.onclick = async event => { //start event
            //console.log(yakId);

            const body = {
                'direction': 'up'
            };

            const up = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(body)
            };

            try {
                let myVote = await fetch(vote_url, up); //request vote action

                if (myVote.status == 200) { //check status
                    let response = await myVote.json(); //response into json
                    console.log(response);
                    getYak(); //re-display data
                } else {
                    alert('Error: You have already voted on this post!'); //client error
                    console.log(myVote.status + ': Invalid Request');
                }
            } catch (err) { //catch server error
                console.log(err);
                alert(err);
            };
        };


        //DISLIKE
        voteDown.onclick = async event => { //start event on button click 
            //console.log(yakId);

            const body = {
                'direction': 'down'
            };

            const down = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(body)
            };

            try {
                let myDown = await fetch(vote_url, down); //request vote action 

                if (myDown.status == 200) { //check status
                    let res = await myDown.json(); //turn into json
                    console.log(res);
                    getYak(); //re-display data
                } else {
                    alert('Error: You have already voted on this post!'); //client error
                    console.log(myDown.status + ': Invalid Request')
                };
            } catch (err) { //catch server error
                console.log(err);
                alert(err);
            };
        };

        let listElement = document.createElement('li'); //create each post as list element

        listElement.append(uNick, yakPost, date, votes, voteUp, voteDown, del_button); //add elements to post
        content.appendChild(listElement); //add post to content body
    };
};

//Posting Yak function
function postYak() {
    const button = document.getElementById('submit'); //define button 
    button.onclick = async event => { //start event after button click

        let content = document.getElementById('yak').value; //content of post

        const yak = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content
            }),
        };
        try {
            let myPost = await fetch(api_url, yak); //request post

            if (myPost.status == 200) {
                let response = await myPost.json(); //turn response into json
                document.getElementById('yak').value = null; //clear textbox
                console.log(response);
                await getYak(); //re-display data
            } else {
                console.log('Error: ' + myPost.status);
                alert('Please enter a value!'); //alert error
            };
        } catch (err) { //catch server error
            console.log(err);
            document.getElementById('all-posts').innerText = "Could not post Yak"; //display on page
        };
    };
};

//Change username
function changeName() {
    const button = document.getElementById('newU'); //define button 
    button.onclick = async event => { //start event on button click
        let userNick = document.getElementById('uNick').value; //get username
        const user = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userNick
            }),
        };
        try {
            let newName = await fetch(user_url, user); //request post
            if (newName.status == 200) {
                let response = await newName.json(); //turn reponse into json
                alert("Username has been changed"); //let user know (bc everyone just has one) 
                console.log(response);
                document.getElementById('uNick').value = ''; //clear text field
                await getYak() //re-display data with new username
            };
        } catch (err) { //catch server error
            console.log(err);
            alert(err);
        };
    };
};

//search username
function searchUser() {
    let userInput = document.getElementById('searchAll');
    let filter = userInput.value.toLowerCase(); //get filter content

    filteredData = latestData.filter(post => {
        if (userInput === '') {
            return true //no filter if input is null 
        } else if (post.userNick) {
            return post.userNick.toLowerCase().includes(filter); //case-insensitive input for filter, find match
        };
    });
    latestData = filteredData; //update latest data to be displayed
    sortPosts(); //sort posts if requested
    displayYak(latestData); //re-display data
};

//search content (including hashtag)
function searchHashtag() {
    let search = document.getElementById('hashtag');
    let find = search.value.toLowerCase();

    filteredData = latestData.filter(post => {
        if (search === '') {
            return true //no filter if input null
        } else if (post.content) {
            return post.content.toLowerCase().includes(find) //find matching content
        };
    });
    latestData = filteredData; //update latest data
    sortPosts(); //sort posts if not default
    displayYak(latestData); //re-display data
};

//function to show ALL POST after search
function reset() {
    document.getElementById('hashtag').value = ""; //clear search boxes
    document.getElementById('searchAll').value = "";

    getYak(); //fetch and display data
}

//sort function
function sortPosts() {

    let sortValue = document.getElementById('sortBy').value; //options defined in HTML

    switch (sortValue) { //sort based on chosen option
        case '1': //Highest Votes
            latestData.sort(function(a, b) {
                return b.votes - a.votes;
            });
            console.log('sorted by most votes');
            displayYak(latestData);
            break;
        case '2': //Lowest Votes
            latestData.sort(function(a, b) {
                return a.votes - b.votes;
            });
            console.log('sorted by least votes');
            displayYak(latestData);
            break;
        case '3': //Most Recent
            latestData.sort(function(a, b) {
                return new Date(b.timestamp) - new Date(a.timestamp);
            });
            console.log('sorted by most recent');
            displayYak(latestData);
            break;
        case '4': //Least Recent
            latestData.sort(function(a, b) {
                return new Date(a.timestamp) - new Date(b.timestamp);
            });
            console.log('sorted by least recent');
            displayYak(latestData);
            break;
    };
};

//END