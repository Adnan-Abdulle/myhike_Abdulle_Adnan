function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;

            // method #1:  insert with JS
            document.getElementById("name-goes-here").innerText = userName;    

            //method #2:  insert using jquery
            //$("#name-goes-here").text(userName); //using jquery

            //method #3:  insert using querySelector
            //document.querySelector("#name-goes-here").innerText = userName

        } else {
            // No user is signed in.
            console.log("No user is logged in");
        }
    });
}
getNameFromAuth(); //run the function


// Function to read the quote of the day from the Firestore "quotes" collection
// Input param is the String representing the day of the week, aka, the document name
function readQuote(day) {
    db.collection("quotes").doc(day)                                                         //name of the collection and documents should matach excatly with what you have in Firestore
        .onSnapshot(dayDoc => {                                                              //arrow notation
            console.log("current document data: " + dayDoc.data());                          //.data() returns data object
            document.getElementById("quote-goes-here").innerHTML = dayDoc.data().quote;      //using javascript to display the data on the right place

            //Here are other ways to access key-value data fields
            //$('#quote-goes-here').text(dayDoc.data().quote);         //using jquery object dot notation
            //$("#quote-goes-here").text(dayDoc.data()["quote"]);      //using json object indexing
            //document.querySelector("#quote-goes-here").innerHTML = dayDoc.data().quote;

        }, (error) => {
            console.log("Error calling onSnapshot", error);
        });
}
readQuote("tuesday");        //calling the function

function writeHikes() {
    //define a variable for the collection you want to create in Firestore to populate data
    var hikesRef = db.collection("hikes");

    hikesRef.add({
        code: "BBY01",
        name: "Burnaby Lake Park Trail", //replace with your own city?
        city: "Burnaby",
        province: "BC",
        level: "easy",
        details: "A lovely place for lunch walk",
        length: 10,          //number value
        hike_time: 60,       //number value
        lat: 49.2467097082573,
        lng: -122.9187029619698,
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    hikesRef.add({
        code: "AM01",
        name: "Buntzen Lake Trail", //replace with your own city?
        city: "Anmore",
        province: "BC",
        level: "moderate",
        details: "Close to town, and relaxing",
        length: 10.5,      //number value
        hike_time: 80,     //number value
        lat: 49.3399431028579,
        lng: -122.85908496766939,
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("March 10, 2022"))
    });
    hikesRef.add({
        code: "NV01",
        name: "Mount Seymour Trail", //replace with your own city?
        city: "North Vancouver",
        province: "BC",
        level: "hard",
        details: "Amazing ski slope views",
        length: 8.2,        //number value
        hike_time: 120,     //number value
        lat: 49.38847101455571,
        lng: -122.94092543551031,
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
}
writeHikes(); 

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("hikeCardTemplate");

    db.collection(collection).get()
        .then(allHikes => {
            // Added this line to track cities that have already been processed
            let processedCities = [];  // This array will store cities we've already added a card for

            allHikes.forEach(doc => {
                var title = doc.data().name;
                var details = doc.data().details;
                var hikeCode = doc.data().code;
                var hikeLength = doc.data().length;
                var city = doc.data().city;
                var docID = doc.id;

                // Added this check to ensure we only create one card per city
                if (!processedCities.includes(city)) {  // If the city hasn't been processed yet
                    processedCities.push(city);  // Mark the city as processed by adding it to the array

                    // Create and populate the new card
                    let newcard = cardTemplate.content.cloneNode(true);
                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-length').innerHTML = hikeLength + "km";
                    newcard.querySelector('.card-text').innerHTML = details;
                    newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg`;  // Set the image
                    newcard.querySelector('a').href = "eachHike.html?docID=" + docID;  // Set the link to the details page

                    // Append the new card to the DOM
                    document.getElementById(collection + "-go-here").appendChild(newcard);
                }
            });
        })
        .catch(error => {
            console.error("Error getting documents: ", error);
        });
}


displayCardsDynamically("hikes");  //input param is the name of the collection